/**
 * catchAsync.js
 * 
 * This is a middleware function that takes a controller function
 * and returns a new function that handles errors thrown by that
 * controller. The new function is passed to Express as a route handler.
 * 
 * The controller function is expected to be of the form:
 * 
 *      async function myController(req, res, next) {
 *          // do something
 *      }
 * 
 * The returned function will take the same parameters as the controller,
 * and it will call the controller function, passing req, res, and next.
 * If the controller throws an error, the returned function will call
 * next() with that error, which will trigger the standard Express error
 * handling middleware to take over.
 */
module.exports = fn => {
    /**
     * This function is the middleware that wraps the controller.
     * It takes req, res, and next as parameters, and it calls the
     * controller function, passing those same parameters.
     * If the controller throws an error, this function will catch
     * it and call next() with that error, which will trigger the
     * standard Express error handling middleware to take over.
     * 
     * @param {Object} req The HTTP request object
     * @param {Object} res The HTTP response object
     * @param {Function} next The next middleware function
     */
    return (req, res, next) => {
        /**
         * Call the controller function, passing req, res, and next.
         * If the controller throws an error, catch it and call
         * next() with that error.
         */
        fn(req, res, next).catch(next);
    }
};
