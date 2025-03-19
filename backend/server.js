require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const File = require('./schema'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

connectDB()
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

app.use('/uploads', express.static(uploadDir));

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'MongoDB is connected' });
});


app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const newFile = new File({
            filename: req.file.filename,
            filepath: `/uploads/${req.file.filename}`
        });

        await newFile.save();
        return res.status(201).json({ message: 'File uploaded successfully', data: newFile });
    } catch (error) {
        console.error('Error in POST /upload:', error.message);
        res.status(500).json({ error: error.message });
    }
});


app.get('/files', async (req, res) => {
    try {
        const files = await File.find();
        res.json(files);
    } catch (error) {
        console.error('Error in GET /files:', error.message);
        res.status(500).json({ message: 'Server Error', error });
    }
});


app.put('/files/:id', async (req, res) => {
    try {
        const { filename } = req.body;
        const updatedFile = await File.findByIdAndUpdate(req.params.id, { filename }, { new: true });

        if (!updatedFile) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.json({ message: 'File updated', data: updatedFile });
    } catch (error) {
        console.error('Error in PUT /files/:id:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/files/:id', async (req, res) => {
    try {
        const deletedFile = await File.findByIdAndDelete(req.params.id);

        if (!deletedFile) {
            return res.status(404).json({ message: 'File not found' });
        }

     
        fs.unlinkSync(path.join(uploadDir, deletedFile.filename));

        res.json({ message: 'File deleted successfully', data: deletedFile });
    } catch (error) {
        console.error('Error in DELETE /files/:id:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
