import path from 'path';
import app from './app.js';
import DataBaseConnection from './Middlewares/DataBase.js';
import express from 'express';

//import { fileURLToPath } from 'url';

const port = process.env.PORT || 8000;

process.on('uncaughtException',(err) =>{
    console.error('An uncaught error occurred!',err);
    process.exit(1);  // exits the Node.js process with a status code of 1
});

// Get the directory name
//const __dirname = path.resolve();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

//const staticPath = path.join(__dirname, '../frontend/dist');
//app.use(express.static(staticPath));
// app.use(express.static(path.join(__dirname,'/frontend/dist')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname,"frontend","dist","index.html"));
// });

const server = app.listen(port, () =>{
    DataBaseConnection();
    console.log(`Server is running on port ${port}`);  // logs the server is running on the specified port
});

// app.get('*', (req, res) => {
//     res.sendFile(path.join(staticPath, 'index.html'));
// });

process.on('unhandledRejection',(err) =>{
    console.error('An unhandled rejection occurred!',err);
    server.close(() => {
        process.exit(1);  // exits the Node.js process with a status code of 1
    });
});

// server.js
// import express from 'express';
// import app from './app.js';
// import DataBaseConnection from './Middlewares/DataBase.js';

// const port = process.env.PORT || 8000;

// // Get the directory name
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Define the path to the static files
// const staticPath = path.join(__dirname, '../frontend/dist');

// // Serve static files from the dist directory
// app.use(express.static(staticPath, {
//     setHeaders: (res, filePath) => {
//         console.log(`Serving static file: ${filePath}`);
//     }
// }));

// app.use((req, res, next) => {
//     console.log(`Received request: ${req.method} ${req.originalUrl}`);
//     next();
// });

// // Serve the frontend's index.html for all unmatched routes
// app.get('*', (req, res) => {
//     console.log(`Handling request for: ${req.originalUrl}`);
//     res.sendFile(path.join(staticPath, 'index.html'), (err) => {
//         if (err) {
//             console.error('Error serving index.html:', err);
//             res.status(500).send('Error serving index.html');
//         }
//     });
// });

// const server = app.listen(port, () => {
//     DataBaseConnection();
//     console.log(`Server is running on port ${port}`);
// });

// process.on('unhandledRejection', (err) => {
//     console.error('An unhandled rejection occurred!', err);
//     server.close(() => {
//         process.exit(1);
//     });
// });


