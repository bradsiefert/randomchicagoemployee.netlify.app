const snowflake = require('snowflake-sdk');

/**
 * Helper function to wrap Snowflake connection in a Promise
 */
function createConnection(config) {
  return new Promise((resolve, reject) => {
    const connection = snowflake.createConnection(config);
    connection.connect((err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
}

/**
 * Helper function to execute a query and return results as a Promise
 */
function executeQuery(connection, sqlText) {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText,
      complete: (err, stmt, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      }
    });
  });
}

/**
 * Netlify Function handler
 * Timeout increased to 26 seconds (Netlify max is 26s for free tier, 10s default)
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
    const username = process.env.SNOWFLAKE_USERNAME;
    const password = process.env.SNOWFLAKE_PASSWORD;
    const warehouse = process.env.SNOWFLAKE_WAREHOUSE;
    const database = process.env.SNOWFLAKE_DATABASE;
    const schema = process.env.SNOWFLAKE_SCHEMA;

    console.log('Snowflake credentials check:', {
      account: account ? '***set***' : 'missing',
      username: username ? '***set***' : 'missing',
      password: password ? '***set***' : 'missing',
      warehouse: warehouse || 'not set (optional)',
      database: database || 'not set (optional)',
      schema: schema || 'not set (optional)',
    });

    // Validate required environment variables
    const missingVars = [];
    if (!account) missingVars.push('SNOWFLAKE_ACCOUNT');
    if (!username) missingVars.push('SNOWFLAKE_USERNAME');
    if (!password) missingVars.push('SNOWFLAKE_PASSWORD');

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

    // Create connection configuration
    const connectionConfig = {
      account,
      username,
      password,
    };

    // Add optional configuration if provided
    if (warehouse) connectionConfig.warehouse = warehouse;
    if (database) connectionConfig.database = database;
    if (schema) connectionConfig.schema = schema;

    console.log('Connecting to Snowflake with account:', account);
    console.log('Connection config:', {
      account,
      username,
      warehouse: warehouse || 'not set',
      database: database || 'not set',
      schema: schema || 'not set'
    });

    // Connect to Snowflake with timeout
    const connectionPromise = createConnection(connectionConfig);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Snowflake connection timed out after 20 seconds')), 20000);
    });
    
    const connection = await Promise.race([connectionPromise, timeoutPromise]);

    // Execute query to fetch one employee row
    const sqlText = `
      SELECT * 
      FROM employees 
      ORDER BY RANDOM()
      LIMIT 1
    `;

    console.log('Executing query...');
    
    // Execute query with timeout
    const queryPromise = executeQuery(connection, sqlText);
    const queryTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Query execution timed out after 10 seconds')), 10000);
    });
    
    const rows = await Promise.race([queryPromise, queryTimeoutPromise]);

    // Close the connection
    connection.destroy((err) => {
      if (err) {
        console.error('Error closing Snowflake connection:', err);
      }
    });

    if (!rows || rows.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'No employee data found'
        })
      };
    }

    // Return the first row
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: rows[0]
      })
    };
  } catch (error) {
    console.error('Snowflake API error:', {
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

