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

function checkIfEmailIsUsed(params) {
  return new Promise(async (resolve, reject) => {

    try {
      logger.trace("checkIfEmailIsUsed Started");

      const { email } = params;

      const user = await User.findOne({ email }).catch(error => {
        throw utils.errorUtil({ error, userErrorMessage: 'Error while checking if email is used' });
      });

      if (user) {
        throw utils.errorUtil({ userErrorMessage: 'Email is already used' }, { errorType: BadRequestError });
      }

      resolve({ result: false });

    } catch (error) {
      reject(error);
    }

  });
}
/**
 * @description sign up service to add user to the system and create token after saving successfully.
 * 
 * @param {Object} params the object based to the service 
 * @param {Object} params.userData An object that contains the data submitted to create a user
 * 
 * @throws {BadRequestError | InternalServerError} If password or email are not valid or something wrong happens while saving the user in the database
 * @returns {void}
 */
service.signUpService = (params) => {
  return new Promise(async (resolve, reject) => {

    try {
      logger.trace('SignUpService Started');

      const { userData } = params;

      await checkIfEmailIsUsed({ email: userData.email });

      validateUserData({ userData });

      let user = new User(userData);

      await user.save().catch(error => {
        throw utils.errorUtil({ error, userErrorMessage: 'Error while saving user' });
      });

      await user.generateAuthToken().catch(error => {
        throw utils.errorUtil({ error, userErrorMessage: 'Error while logging in' });
      });

      resolve();
    } catch (error) {
      reject(error);
    }

  });
}

/**
 * @description Login service to check & authenticate: if user is in the DB and his password matches then we create JWT for authentication.
 * 
 * @param {Object} params the object based to the service 
 * @param {Object} params.userData An object that contains the data submitted to create a user
 * 
 * @throws {BadRequestError | InternalServerError} If password or email are not valid or something wrong happens while saving the user in the database
 * @returns {Object} An object that contains the user data and a boolean field called result = true to indicate a success response
 */
service.logInService = (params) => {
  return new Promise(async (resolve, reject) => {

    try {
      logger.trace('logInService started');

      const { userData } = params;

      const user = await User.findByCredentials({ userData }).catch(error => {
        throw utils.errorUtil({ error, userErrorMessage: 'Error while logging in' });
      });

      let token = await user.generateAuthToken().catch(error => {
        throw utils.errorUtil({ error, userErrorMessage: 'Error while logging in' });
      });

      resolve({ result: true, user, token });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @description get user by Id passed in the URL params
 * 
 * @param {Object} params the object based to the service 
 * @param {Object} params.userId user _id that will be used to search
 * 
 * @throws {ResourceNotFoundError | InternalServerError} If User not Found in the database or something wrong happens while getting the user from the database
 * @returns {Object} An object that contains the user data and a boolean field called result = true to indicate a success response
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

/**
 * @description get user by Id passed in the URL params
 * 
 * @param {Object} params the object based to the service 
 * @param {String} params.userId user _id that will be used to search
 * 
 * @throws {ResourceNotFoundError | InternalServerError} If User not Found in the database or something wrong happens while getting the user from the database
 * @returns {void}
 */
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

/**
 * @description logout user by removing the token currently ued from the token array stored in the user database
 * 
 * @param {Object} params the object based to the service 
 * @param {Object} params.user user object that is added to the req body after logging in
 * @param {String} params.token token created & added to the req body after logging in
 * 
 * @throws {InternalServerError}
 * @returns {void}
 */
service.logOutService = (params) => {
  return new Promise(async (resolve, reject) => {

    try {
      logger.trace('logOutService Started');

      const { user, userToken } = params;

      user.tokens = user.tokens.filter((token) => {
        return token.token !== userToken;
      });

      await user.save().catch(error => {
        throw utils.errorUtil({ error, userErrorMessage: 'Error while saving user' });
      });

      resolve();
    } catch (error) {
      reject(error);
    }

  });
}

service.logOutFromAllDevicesService = (params) => {
  return new Promise(async (resolve, reject) => {

    try {
      logger.trace('logOutService Started');

      const { user } = params;

      user.tokens = [];

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

