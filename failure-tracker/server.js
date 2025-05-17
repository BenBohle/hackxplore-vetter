const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

// Supabase client setup
const supabase = createClient(
    'https://deykewviljmbgvdukhgt.supabase.co', // Your Supabase project URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRleWtld3ZpbGptYmd2ZHVraGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NDEyNDMsImV4cCI6MjA2MzAxNzI0M30.fH3O9V70tvF8gISnKhBFetiGD7WgU4O53rlvg6Dtfoo' // Your Supabase API key
);

// Middleware to parse JSON request bodies
app.use(express.json());  // Automatically parses JSON data in the body

app.post('/api/failure-data', async (req, res) => {
    const {
        program_name,
        exit_code,
        failure_reason,
        pid_failure,
        related_pid,
        timestamp
    } = req.body;

    // Log the incoming data
    console.log('Received data:', req.body);

    // Validate incoming data (check for missing or empty fields)
    if (
        !program_name || !failure_reason ||
        isNaN(exit_code) || isNaN(pid_failure) || isNaN(related_pid) || isNaN(timestamp)
    ) {
        return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    // Ensure that all numeric fields are parsed correctly
    const exitCodeNum = Number(exit_code);
    const pidFailureNum = Number(pid_failure);
    const relatedPidNum = Number(related_pid);
    const timestampNum = Number(timestamp);

    // Log the formatted data being inserted into Supabase
    console.log('Formatted data for insertion:', {
        program_name,
        exit_code: exitCodeNum,
        failure_reason,
        pid_failure: pidFailureNum,
        related_pid: relatedPidNum,
        timestamp: timestampNum
    });

    try {
        // Insert the failure data into the Supabase database
        const { data, error } = await supabase
            .from('failed_programs')
            .insert([
                {
                    program_name,
                    exit_code: exitCodeNum,
                    failure_reason,
                    pid_failure: pidFailureNum,
                    related_pid: relatedPidNum,
                    timestamp: timestampNum
                }
            ]);

        if (error) {
            console.error('Error inserting data into Supabase:', error.message);
            return res.status(500).json({ error: 'Failed to save data to Supabase' });
        }

        // Successful response
        res.status(200).json({ message: 'Failure data saved successfully', data });
    } catch (err) {
        // Catch unexpected errors
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Microservice running on http://localhost:${port}`);
});


// run the server with:
// node server.js
// install express and supabase-js with:
// npm install express @supabase/supabase-js
// use npm install to install all dependencies
