import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const snowflake = require('snowflake-sdk');

/**
 * Helper function to wrap Snowflake connection in a Promise
 */
function createConnection(config: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const connection = snowflake.createConnection(config);
    connection.connect((err: Error | null, conn: any) => {
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
function executeQuery(connection: any, sqlText: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText,
      complete: (err: Error | null, stmt: any, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      }
    });
  });
}

export default defineEventHandler(async (event) => {
  try {
    // Get Snowflake credentials from runtime config (server-only, never exposed to client)
    // Fallback to process.env if runtimeConfig doesn't work (e.g., in Netlify serverless functions)
    let account: string | undefined;
    let username: string | undefined;
    let password: string | undefined;
    let warehouse: string | undefined;
    let database: string | undefined;
    let schema: string | undefined;

    try {
      const config = useRuntimeConfig(event);
      
      // Try to get from runtimeConfig first
      if (config?.private?.snowflake) {
        account = config.private.snowflake.account;
        username = config.private.snowflake.username;
        password = config.private.snowflake.password;
        warehouse = config.private.snowflake.warehouse;
        database = config.private.snowflake.database;
        schema = config.private.snowflake.schema;
        console.log('Using runtimeConfig for Snowflake credentials');
      } else {
        console.warn('Runtime config structure invalid, falling back to process.env');
      }
    } catch (configError: any) {
      console.warn('Failed to access runtime config, falling back to process.env:', configError?.message);
    }

    // Fallback to process.env if runtimeConfig values are missing
    if (!account || !username || !password) {
      account = account || process.env.SNOWFLAKE_ACCOUNT;
      username = username || process.env.SNOWFLAKE_USERNAME;
      password = password || process.env.SNOWFLAKE_PASSWORD;
      warehouse = warehouse || process.env.SNOWFLAKE_WAREHOUSE;
      database = database || process.env.SNOWFLAKE_DATABASE;
      schema = schema || process.env.SNOWFLAKE_SCHEMA;
      
      if (account || username || password) {
        console.log('Using process.env for Snowflake credentials (fallback)');
      }
    }

    // Log which variables are missing for debugging
    const missingVars: string[] = [];
    if (!account) missingVars.push('SNOWFLAKE_ACCOUNT');
    if (!username) missingVars.push('SNOWFLAKE_USERNAME');
    if (!password) missingVars.push('SNOWFLAKE_PASSWORD');

    // Validate required environment variables
    if (missingVars.length > 0) {
      console.error('Missing required Snowflake environment variables:', missingVars);
      console.error('Available config values:', {
        account: account ? '***set***' : 'missing',
        username: username ? '***set***' : 'missing',
        password: password ? '***set***' : 'missing',
        warehouse: warehouse || 'not set (optional)',
        database: database || 'not set (optional)',
        schema: schema || 'not set (optional)',
      });
      throw createError({
        statusCode: 500,
        statusMessage: `Missing required Snowflake credentials: ${missingVars.join(', ')}. Please check your Netlify environment variables.`,
      });
    }

    // Create connection configuration
    const connectionConfig: any = {
      account,
      username,
      password,
    };

    // Add optional configuration if provided
    if (warehouse) connectionConfig.warehouse = warehouse;
    if (database) connectionConfig.database = database;
    if (schema) connectionConfig.schema = schema;

    // Connect to Snowflake
    const connection = await createConnection(connectionConfig);

    // Execute query to fetch one employee row
    // Note: Update the table name and query as needed for your schema
    const sqlText = `
      SELECT * 
      FROM employees 
      ORDER BY RANDOM()
      LIMIT 1
    `;

    const rows = await executeQuery(connection, sqlText);

    // Close the connection
    connection.destroy((err: Error | null) => {
      if (err) {
        console.error('Error closing Snowflake connection:', err);
      }
    });

    if (!rows || rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No employee data found',
      });
    }

    // Return the first row
    return {
      success: true,
      data: rows[0],
    };
  } catch (error: any) {
    // Enhanced error logging for debugging
    console.error('Snowflake API error details:', {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
      name: error.name,
    });
    
    // If it's already a createError, preserve the status code
    if (error.statusCode) {
      throw error;
    }
    
    // Otherwise, wrap it in a createError
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch employee data from Snowflake',
    });
  }
});

