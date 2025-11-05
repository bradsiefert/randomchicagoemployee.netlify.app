/**
 * Netlify Function to query Snowflake using SQL API with Programmatic Access Token (PAT)
 * 
 * This function uses Snowflake's REST SQL API instead of the SDK, avoiding bundling issues.
 */

exports.handler = async (event, context) => {
  // Set function timeout to maximum (26 seconds for free tier)
  context.callbackWaitsForEmptyEventLoop = false;
  
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Get Snowflake credentials from environment variables
    const account = process.env.SNOWFLAKE_ACCOUNT;
    const pat = process.env.SNOWFLAKE_PAT;
    const warehouse = process.env.SNOWFLAKE_WAREHOUSE;
    const database = process.env.SNOWFLAKE_DATABASE;
    const schema = process.env.SNOWFLAKE_SCHEMA;

    console.log('Snowflake SQL API credentials check:', {
      account: account ? '***set***' : 'missing',
      pat: pat ? '***set***' : 'missing',
      warehouse: warehouse || 'not set (optional)',
      database: database || 'not set (optional)',
      schema: schema || 'not set (optional)',
    });

    // Validate required environment variables
    const missingVars = [];
    if (!account) missingVars.push('SNOWFLAKE_ACCOUNT');
    if (!pat) missingVars.push('SNOWFLAKE_PAT');

    if (missingVars.length > 0) {
      console.error('Missing required Snowflake environment variables:', missingVars);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Missing required Snowflake credentials: ${missingVars.join(', ')}. Please check your Netlify environment variables.`
        })
      };
    }

    // Construct Snowflake SQL API URL
    const apiUrl = `https://${account}.snowflakecomputing.com/api/v2/statements`;
    console.log('Connecting to Snowflake SQL API:', apiUrl);

    // Prepare request body
    const requestBody = {
      statement: 'SELECT * FROM employees ORDER BY RANDOM() LIMIT 1',
      // Optional parameters
      ...(warehouse && { warehouse }),
      ...(database && { database }),
      ...(schema && { schema }),
    };

    console.log('Executing query:', requestBody.statement);

    // Make POST request to Snowflake SQL API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${pat}`,
        'X-Snowflake-Authorization-Token-Type': 'PROGRAMMATIC_ACCESS_TOKEN'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage = `Snowflake SQL API request failed: ${response.status} ${response.statusText} - ${errorBody}`;
      console.error('Snowflake SQL API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorBody
      });
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          success: false,
          error: errorMessage
        })
      };
    }

    // Parse response
    const result = await response.json();
    console.log('Snowflake SQL API response received');

    // Extract rows from response
    // SQL API response format: 
    // {data: [[value1, value2, ...], ...], resultSetMetaData: {rowType: [{name: "...", type: "..."}, ...]}}
    const rows = result.data || [];
    const rowType = result.resultSetMetaData?.rowType || [];

    if (rows.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'No employee data found'
        })
      };
    }

    // Convert array-based rows to object-based rows using rowType metadata
    const firstRowArray = rows[0];
    const employeeObject = {};
    
    if (rowType.length > 0) {
      // Use column metadata if available
      rowType.forEach((column, index) => {
        employeeObject[column.name] = firstRowArray[index];
      });
    } else {
      // Fallback: if no metadata, return as-is (array format)
      // This shouldn't happen, but handle gracefully
      console.warn('No rowType metadata found in response, returning array format');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: firstRowArray,
          warning: 'Response returned as array - column metadata missing'
        })
      };
    }

    console.log('Query executed successfully, rows returned:', rows.length);

    // Return the first row as an object
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: employeeObject
      })
    };
  } catch (error) {
    console.error('Snowflake SQL API error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Failed to fetch employee data from Snowflake'
      })
    };
  }
};

