/**
 * Push log function to window object
 */
var log = {};
var window = {};

window.log = function () {

    log.history = log.history || [];   // store logs to an array for reference
    log.history.push(arguments);

    if (window.console) {
        console.log(Array.prototype.slice.call(arguments));
    }

};
