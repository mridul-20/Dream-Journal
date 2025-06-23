require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const dreamRoutes = require('./routes/dreamRoutes');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/dreams', dreamRoutes);

const swagger = require('./swagger');
swagger(app);

app.use(errorHandler);

module.exports = app;