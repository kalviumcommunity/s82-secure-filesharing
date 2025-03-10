const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (e) {
        console.log(`Something went wrong: ${e.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
