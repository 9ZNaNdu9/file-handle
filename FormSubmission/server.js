const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files (like styles.css)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Route for the Configure page
app.get('/configure', (req, res) => {
    res.render('configure'); // Render the configure page
});


// Route to handle date calculation
app.post('/calculate', (req, res) => {
    const { startDate, endDate } = req.body; // Get dates from the form
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate the difference in milliseconds
    const difference = end - start;
    
    // Convert milliseconds to days
    const daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24));
    
    // Redirect to the form page with the calculated time period
    res.redirect(`/form?days=${daysDifference}`);
});

/*
// Route to handle date calculation
app.post('/calculate', (req, res) => {
    const { startDate, endDate } = req.body; // Get dates from the form
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate the difference in milliseconds
    const difference = end - start;
    
    // Convert milliseconds to hours
    const hoursDifference = Math.ceil(difference / (1000 * 60 * 60)); // Convert to hours
    
    // Redirect to the form page with the calculated time period in hours
    res.redirect(`/form?hours=${hoursDifference}`);
});
*/

// Route for the Form page
app.get('/form', (req, res) => {
    const days = req.query.days || 0; // Get the days from the query parameters
    res.render('form', { days }); // Render the form page with the days variable
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
