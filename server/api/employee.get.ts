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
    // Get Snowflake credentials from environment variables
    const account = process.env.SNOWFLAKE_ACCOUNT;
    const username = process.env.SNOWFLAKE_USERNAME;
    const password = process.env.SNOWFLAKE_PASSWORD;
    const warehouse = process.env.SNOWFLAKE_WAREHOUSE;
    const database = process.env.SNOWFLAKE_DATABASE;
    const schema = process.env.SNOWFLAKE_SCHEMA;

    // Validate required environment variables
    if (!account || !username || !password) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Missing required Snowflake credentials. Please check your .env file.',
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
    console.error('Snowflake connection error:', error);
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch employee data from Snowflake',
    });
  }
});

