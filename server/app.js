require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


connectDB();

app.get('/api/health', (req, res) => {
    res.json({ message: "API running" });
});

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes); 
app.use('/api/products', productRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
