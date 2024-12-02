const pdf = require("pdf-parse");
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sendQuestionToOpenAI } = require('../openAiClient');
const { mdToPdf } = require('md-to-pdf');

// Create uploads folder if it doesn't exist
const uploadsDirectory = './data/uploads/';
const downloadsDirectory = './public/downloads/';

if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory);
}

if (!fs.existsSync(downloadsDirectory)) {
    fs.mkdirSync(downloadsDirectory);
}

const router = express.Router();


// Set up storage engine
const storage = multer.diskStorage({
    destination: uploadsDirectory,
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('pdfFile');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: PDFs Only!');
    }
}

// Route to handle PDF upload
router.post('/upload', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.status(400).json({ message: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ message: 'No file selected!' });
            } else {
                const filename = path.join(uploadsDirectory, `${req.file.filename}`);
                const data = await pdf(filename);
                const response = await sendQuestionToOpenAI(data.text);

                const pdfPath = path.join(downloadsDirectory, `response-${Date.now()}.pdf`);
                const pdfResponse = await mdToPdf({ content: response }).catch(console.error);

                if (pdfResponse) {
                    fs.writeFileSync(pdfPath, pdfResponse.content);
                    const downloadPath = pdfPath.replace('public', '');
                    console.log(downloadPath);
                    res.status(200).json({
                        message: 'File uploaded successfully!',
                        file: downloadPath,
                        response: response
                    });
                } else {
                    res.status(500);
                }
            }
        }
    });
});

module.exports = router;
