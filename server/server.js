const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5001;
const path = require('path'); // first step for deployment (for deploy and tell server to server the static file (html, css, js))

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


// // second step for deployment:
// // Production setup for serving the React frontend
// if (process.env.NODE_ENV === 'production') {
    
//     // 2. Serve static files from the client's build directory
//     // NOTE: If your client build output is 'build', change 'dist' to 'build'
//     // If you are using Vite (as you mentioned earlier): Vite's default build command 
//     // is vite build, and it nearly always outputs to a folder named dist 
//     // (short for distribution).
//     app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

//     // 3. For any other request, send the main index.html file
//     app.get('/*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
//     });
// }

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

    app.get('/:path(*)', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
    });
}



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});