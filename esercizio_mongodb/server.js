const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config({path: './config.env'});

// handling uncaught exceptions prima 
    process.on('uncaughtException', err => {
        console.log(err.name, err.message); // leggiamo il messaggio
        console.log('UNCAUGHT EXCEPTION! 🤬 Shutting down... 🥱');
        process.exit(1); // exit with failure
    });

const animaliRouter = require('./routes/animali-route');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

// const bodyParser = require('body-parser');
// app.use(bodyParser.json()); // middleware che intercetta i dati in formato json

app.use(express.json()); // come il middleware sopra, ma utilizzando express

app.use(globalErrorHandler); // middleware per gestire gli errori (nel controller)

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose 
    .connect(DB, 
        // {
        // queste sono tutte deprecate 
        //     useNewUrlParser: true,
        //     useFindAndModify: false
        //     useUnifiedTopology: true // Opzione supportata per la gestione delle modifiche
        // }    
    )
    .then(() => console.log("DB connection successful! 😁"));

    app.use('/api/v1/animali', animaliRouter);
    
    app.all('*', (req, res, next) => {
        // const err = new Error(`can't find ${req.originalUrl} on this server`);
        // err.status = 'fail';
        // err.statusCode = 404;
    
        // next(err);
    
        next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
    });

    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`App running on port ${port}...`)
    });

    process.on('unhandledRejection', err => {
        console.log(err.name, err.message); // leggiamo il messaggio
        console.log('UNHANDLED REJECTION! 💥 Shutting down... 😒');

        // process.exit(0); // exit with success
        server.close(() => {
            process.exit(1); // exit with failure
        });
    });


