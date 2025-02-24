require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const port = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(express.json());

let dbConnected = false; // Track DB connection status

// Connect to MongoDB
connectDB()
    .then(() => { dbConnected = true; })
    .catch(() => { dbConnected = false; });

app.get('/', (req, res) => {
    if (!dbConnected) {
        return res.status(500).json({ message: 'MongoDB is not connected' });
    }
    return res.status(200).json({ message: 'MongoDB is connected' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
