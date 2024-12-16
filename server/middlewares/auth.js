const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { errorUtil } = require("../utils/utils");
const { AuthenticationError } = require("../utils/errors");
const logger = require("../utils/logger");

let _TOKEN_STRING = process.env.TOKEN_STRING;

function authenticateUser({ userTypes = [] }) {
  return async (req, res, next) => {

    try {
      logger.trace("authenticateUser Started");
      
      if (!Array.isArray(userTypes)) {
        userTypes = [userTypes];
      }

      const requestHeaderAuthorization = req.header("Authorization");

      if (!requestHeaderAuthorization) {
        throw errorUtil({ error: { message: "No Authorization Header sent" }, message: 'Not authenticated' }, { errorType: AuthenticationError })
      }

      const token = requestHeaderAuthorization.replace("Bearer ", "");
      const verifiedToken = jwt.verify(token, _TOKEN_STRING);

      const user = await userModel.findOne({
        _id: verifiedToken._id,
        "tokens.token": token,
      });

      if (!user) {
        throw errorUtil({ message: 'Not authenticated' }, { errorType: AuthenticationError })
      }

      // Check user type for authorization
      if (!userTypes.includes(user.userType)) {
        throw errorUtil({ message: 'Access denied. You do not have the required permissions.' }, { errorType: AuthenticationError })
      }

      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      res.handleFailureResponse(error);
    }
  }
}

module.exports = authenticateUser;