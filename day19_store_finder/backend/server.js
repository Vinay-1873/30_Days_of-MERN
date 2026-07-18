const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db.js');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/stores', require('./routes/storeRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});