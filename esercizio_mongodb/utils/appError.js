class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // unico elemento passato da error
        
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // controlliamo se inzia con 4 == fail sennò è un error
        this.isOperational = true; // controllo se l'errore è operazionale o no
        
        Error.captureStackTrace(this, this.constructor); // metodo che registra la traccia di stack per l'errore
    }
};

module.exports = AppError;  