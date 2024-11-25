const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { errorUtil } = require("../utils/utils");
const { AuthenticationError } = require("../utils/errors");
const logger = require("../utils/logger");

let _TOKEN_STRING = process.env.TOKEN_STRING;

let authenticateUser = async (req, res, next) => {

  try {
    logger.trace("authenticateUser Started");

    const requestHeaderAuthorization = req.header("Authorization");

    if (!requestHeaderAuthorization) {
      throw errorUtil({ error: { message: "No Authorization Header sent" }, userErrorMessage: 'Not authenticated' }, { errorType: AuthenticationError })
    }

    const token = requestHeaderAuthorization.replace("Bearer ", "");
    const verifiedToken = jwt.verify(token, _TOKEN_STRING);

    const user = await userModel.findOne({
      _id: verifiedToken._id,
      "tokens.token": token,
    });

    if (!user) {
      throw errorUtil({ userErrorMessage: 'Not authenticated' }, { errorType: AuthenticationError })
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.handleFailureResponse(error);
  }
}

module.exports = authenticateUser;