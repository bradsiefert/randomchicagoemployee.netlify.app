import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  try {
    // Get Supabase credentials from environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    console.log('Supabase credentials check:', {
      url: supabaseUrl ? '***set***' : 'missing',
      key: supabaseKey ? '***set***' : 'missing',
    });

    // Validate required environment variables
    if (!supabaseUrl || !supabaseKey) {
      const missingVars: string[] = [];
      if (!supabaseUrl) missingVars.push('SUPABASE_URL');
      if (!supabaseKey) missingVars.push('SUPABASE_KEY');

      console.error('Missing required Supabase environment variables:', missingVars);
      throw createError({
        statusCode: 500,
        statusMessage: `Missing required Supabase credentials: ${missingVars.join(', ')}. Please check your environment variables.`,
      });
    }

    // Create Supabase client
    console.log('Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get total count of employees for random selection
    console.log('Getting total count of employees...');
    const { count, error: countError } = await supabase
      .from('City of Chicago Employees')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Supabase count query error:', countError);
      throw createError({
        statusCode: 500,
        statusMessage: `Supabase count query failed: ${countError.message}`,
      });
    }

    if (!count || count === 0) {
      console.warn('No employees found in table');
      throw createError({
        statusCode: 404,
        statusMessage: 'No employee data found. Check if the table has data and RLS policies allow access.',
      });
    }

    // Generate random offset (0 to count-1)
    const randomOffset = Math.floor(Math.random() * count);
    console.log(`Fetching random employee at offset ${randomOffset} of ${count} total employees...`);

    // Query to fetch one random employee row
    console.log('Querying City of Chicago Employees table...');
    const { data, error } = await supabase
      .from('City of Chicago Employees')
      .select('*')
      .range(randomOffset, randomOffset)
      .limit(1);

    console.log('Supabase query response:', {
      hasData: !!data,
      dataLength: data?.length || 0,
      hasError: !!error,
      error: error ? error.message : null,
    });

    if (error) {
      console.error('Supabase query error:', error);
      throw createError({
        statusCode: 500,
        statusMessage: `Supabase query failed: ${error.message}`,
      });
    }

    if (!data || data.length === 0) {
      console.warn('Query returned no data. This could mean:');
      console.warn('1. The table is empty');
      console.warn('2. Row Level Security (RLS) policies are blocking access');
      console.warn('3. The query syntax needs adjustment');
      throw createError({
        statusCode: 404,
        statusMessage: 'No employee data found. Check if the table has data and RLS policies allow access.',
      });
    }

    console.log('Query executed successfully, random employee fetched');

    // Return the random employee in same format as existing employee API
    return {
      success: true,
      data: data[0],
    };
  } catch (error: any) {
    // Enhanced error logging for debugging
    const errorDetails = {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
      name: error.name,
    };
    
    console.error('Supabase API error details:', errorDetails);
    
    // In development, return more detailed error information
    const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    
    // If it's already a createError, preserve the status code
    if (error.statusCode) {
      if (isDev) {
        // Add more details in dev mode
        throw createError({
          statusCode: error.statusCode,
          statusMessage: `${error.message}\n\nStack: ${error.stack || 'No stack trace'}`,
        });
      }
      throw error;
    }
    
    // Otherwise, wrap it in a createError
    const errorMessage = isDev 
      ? `${error.message || 'Failed to fetch employee data from Supabase'}\n\nDetails: ${JSON.stringify(errorDetails, null, 2)}`
      : error.message || 'Failed to fetch employee data from Supabase';
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: errorMessage,
    });
  }
});

