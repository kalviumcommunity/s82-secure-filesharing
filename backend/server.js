require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const User = require('./schema');

const port = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

connectDB()
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'MongoDB is connected' });
});

app.post('/menu', async (req, res) => {
    const { name, description, price } = req.body;
    try {
        if (!name || !description || !price) {
            return res.status(400).json({ message: 'Fill all the details' });
        }

        const newUser = new User({ name, description, price });
        await newUser.save();

        return res.status(201).json({ message: 'Menu added', data: newUser });
    } catch (error) {
        console.error('Error in POST /menu:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/menu', async (req, res) => {
    try {
        const menuItems = await User.find();
        res.json(menuItems);
    } catch (error) {
        console.error('Error in GET /menu:', error.message);
        res.status(500).json({ message: 'Server Error', error });
    }
});

app.put('/menu/:id', async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const updatedItem = await User.findByIdAndUpdate(
            req.params.id,
            { name, description, price },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.json({ message: 'Menu item updated', data: updatedItem });
    } catch (error) {
        console.error('Error in PUT /menu/:id:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/menu/:id', async (req, res) => {
    try {
        const deletedItem = await User.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.json({ message: 'Menu item deleted successfully', data: deletedItem });
    } catch (error) {
        console.error('Error in DELETE /menu/:id:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
