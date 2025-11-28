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
  // “When a browser requests static files (like /assets/main.js, /styles.css, /logo.png), look for them in client/dist.”
  // dist is a folder that vite generate when I run build. also I think is react convention?
  // dist has static files that brower asks for
    app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

    // If browser asks routes that's unknown to server (not in the above)
    // (this part is related to single page app, which you can google)
    // serve index.html and essentially let react handle it (where your client routing comes to play)
    // in other words, it's express intercepting the browser request, and give browser index.html, instead of
    // letting Render handle it, in which case you will see something like CANNOT GET which you have
    app.get('/{*splat}', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
    });
}



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});