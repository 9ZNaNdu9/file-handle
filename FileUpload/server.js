const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to save files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save file with a timestamp
    }
});

// File type and size checking
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const fileTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true); // Accept file
    }
    cb(new Error('Error: File type not supported!')); // Reject file
};

// Set max file size (5MB in this example)
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit to 5MB
});

// Create the uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded or file does not meet requirements.');
    }
    res.send(`File uploaded successfully: ${req.file.filename}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(500).send(err.message); // Handle multer errors
    } else if (err) {
        return res.status(400).send(err.message); // Handle other errors
    }
    next();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
