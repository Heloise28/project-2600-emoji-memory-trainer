const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routers
const defaultMappingRouter = require('./routes/default_mapping');
app.use('/api/default_mapping', defaultMappingRouter);

const userRouter = require('./routes/user');
app.use('/api/user', userRouter);

const nextUserIdRouter = require('./routes/next_user_id');
app.use('/api/next_user_id', nextUserIdRouter);

const loginRouter = require('./routes/login');
app.use('/api/login', loginRouter);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});