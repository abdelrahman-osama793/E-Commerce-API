const User = require("../models/userModel");
const { BadRequestError, InternalServerError, ResourceNotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");
const utils = require("../utils/utils");

let service = {};

/**
 * @description this function is responsible for validating the user email and password.
 * 
 * @param {Object} params the object based to the service 
 * @param {Object} params.userData An object that contains the data submitted to create a user that will be validated
 * 
 * @throws {BadRequestError} if the password or email are invalid
 * 
 * @returns {Boolean} it only returns true if the password and email are valid
 */
function validateUserData(params) {
  try {

    const { userData } = params;

    let isPasswordValid = utils.checkIfStrongPassword({ password: userData.password });

    if (!isPasswordValid.valid) {
      throw utils.errorUtil({ userErrorMessage: 'Email or password are not valid' }, { errorType: BadRequestError });
    }

    let isEmailValid = utils.checkIfEmailIsValid({ email: userData.email });

    if (!isEmailValid) {
      throw utils.errorUtil({ userErrorMessage: 'Email or password are not valid' }, { errorType: BadRequestError });
    }

    return true;

  } catch (error) {
    throw utils.errorUtil({ error, userErrorMessage: "Error while validating user data" });
  }
}

/**
 * sign up service to add user to the system
 * 
 * @param {Object} params the object based to the service 
 * @param {Object} params.userData An object that contains the data submitted to create a user
 * 
 * @throws {BadRequestError | InternalServerError} If password or email are not valid or something wrong happens while saving the user in the database
 * @returns void
 */
service.signUpService = (params) => {
  return new Promise(async (resolve, reject) => {

    try {
      logger.trace('SignUpService Started');

      const { userData } = params;

      validateUserData({ userData });

      let user = new User(userData);

      await user.save().catch(error => {
        throw utils.errorUtil({ error, userErrorMessage: 'Error while saving user' });
      });

      resolve();
    } catch (error) {
      reject(error);
    }

  });
}

service.logInService = (params) => {
  return new Promise((resolve, reject) => {

    try {
      logger.trace('logInService started');

      const { userData } = params;




    } catch (error) {
      reject(error);
    }
  });
}

/**
 * get user by Id passed in the URL params
 * 
 * @param {Object} params the object based to the service 
 * @param {Object} params.userId user _id that will be used to search
 * 
 * @throws {ResourceNotFoundError | InternalServerError} If User not Found in the database or something wrong happens while getting the user from the database
 * @returns {Object} result = true and user Object
 */
service.getUserByIdService = (params) => {
  return new Promise(async (resolve, reject) => {

    try {
      logger.trace('getUserByIdService started');

      const { userId } = params;

      let user = await User.findById(userId).catch(error => {
        throw utils.errorUtil({ error, userErrorMessage: 'Error while getting user' });
      });

      if (!user) {
        throw utils.errorUtil({ userErrorMessage: 'User not found' }, { errorType: ResourceNotFoundError });
      }

      resolve({ result: true, user });
    } catch (error) {
      reject(error);
    }
  });
}

service.updateUserService = (params) => {
  return new Promise(async (resolve, reject) => {

    try {
      logger.trace('updateUserService started');

      const { userData, userId } = params;

      let updates = Object.keys(userData);

      let user = await User.findById(userId).catch(error => {
        throw utils.errorUtil({ error, userErrorMessage: 'Error while getting user' });
      });

      if (!user) {
        throw utils.errorUtil({ userErrorMessage: 'User not found' }, { errorType: ResourceNotFoundError });
      }

      for (const update of updates) {
        user[update] = userData[update];
      }
      
      await user.save().catch(error => {
        throw utils.errorUtil({ error, userErrorMessage: 'Error while saving user' });
      });

      resolve();
    } catch (error) {
      reject(error);
    }

  });
}

module.exports = service;

