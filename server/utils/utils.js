const { InternalServerError } = require("./errors");
const logger = require("./logger");

let utils = {};

/**
 * @description this function is used to find a specific object in an array of objects
 * 
 * @param {Array} array the array that is going to be searched
 * @param {String | Number} key the key based as a searching criteria to find the object
 * @param {String} keyName the key name in the object it self that os going to be compared
 * @returns {Object} the object found ar an empty array
 */
utils.findInArray = function (array, key, keyName) {
  
  return array.find(item => item[keyName] === key) || {};
}

/**
 * @description this function is used to check if the password is strong and meets the criteria or not
 * 
 * @param {Object} params Object required to run the function
 * @param {String} params.password a string passed as a password needed to run the function
 * @returns {Object} an object indicating whether the password is valid or not and why
 * @throws {InternalServerError}
 */
utils.checkIfStrongPassword = function (params, options) {
  try {

    const { password } = params;

    const minLength = 8;
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    const hasDigit = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      logger.warn("Password must be at least 8 characters long.");
      return { valid: false, message: "Password must be at least 8 characters long." };
    }

    if (!hasUppercase.test(password)) {
      logger.warn("Password must include at least one uppercase letter.");
      return { valid: false, message: "Password must include at least one uppercase letter." };
    }

    if (!hasLowercase.test(password)) {
      logger.warn("Password must include at least one lowercase letter.");
      return { valid: false, message: "Password must include at least one lowercase letter." };
    }

    if (!hasDigit.test(password)) {
      logger.warn("Password must include at least one digit.")
      return { valid: false, message: "Password must include at least one digit." };
    }

    if (!hasSpecialChar.test(password)) {
      logger.warn("Password must include at least one special character.")
      return { valid: false, message: "Password must include at least one special character." };
    }

    return { valid: true };

  } catch (error) {
    throw this.errorUtil({error, message: 'Error while checking if password is strong'})
  }
}

/**
 * @description this function is used to check if the email is valid or not.
 * 
 * @param {Object} params Object required to run the function
 * @param {String} params.email a string passed as a email needed to run the function
 * @returns {Boolean} if true then it is a valid email if false then it failed.
 * @throws {InternalServerError}
 */
utils.checkIfEmailIsValid = function (params, options) {
  try {
    const { email } = params;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);

  } catch (error) {
    throw this.errorUtil({error, message: 'Error while checking if email is valid'})
  }
}

/**
 * @description a utility function used to throw errors to keep error handling neat
 * 
 * @param {Object} params Object required to run the function
 * @param {String} params.error error object based
 * @param {String} params.message a string passed as a password needed to run the function
 * @param {Object} options optional Object is used for manipulating the default behavior of the function
 * @param {Object} options.errorType the type of the error that will be used (internal server error, etc...)
 * @returns {Object} an object indicating whether the password is valid or not and why
 * @throws {InternalServerError}
 */
utils.errorUtil = ({ error = {}, message = 'An unexpected error occurred. Please try again later.' }, options = {}) => {
  const { errorType } = options;

  if (error instanceof Error) {
    return error;
  };

  logger.error(message, error);

  const thrownErrorType = ((errorType || {}).prototype && (errorType.prototype instanceof Error)) ? errorType : InternalServerError;

  const thrownError = new thrownErrorType(message);

  return thrownError;
},

module.exports = utils;