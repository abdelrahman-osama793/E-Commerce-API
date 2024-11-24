let logger = {};

const resetColor = "\x1b[31m";
const errorColor = "\x1b[31m";
const traceColor = "\x1b[32m";
const warnColor = "\x1b[33m";

logger.error = function (message, error) {
  if (error) {
    console.error(`${errorColor}[ERROR DETAILS] ${message}`, error);
  }
};

logger.trace = function (message) {
  console.log(`${traceColor}[TRACE] ${message}${resetColor}`);
};

logger.warn = function (message) {
  console.warn(`${warnColor}[WARN] ${message}${resetColor}`);
};

module.exports = logger;