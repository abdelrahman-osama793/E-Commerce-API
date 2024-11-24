const userService = require('../services/userService');
const logger = require('../utils/logger');

let controller = {};

controller.signUpController = async function (req, res) {
  try {
    logger.trace("signUpController started");
    
    let params = {
      userData: req.body.userData,
    };

    await userService.signUpService(params);    

    res.json({ result: true, message: "Signed up successfully." });
  } catch (error) {    
    res.handleFailureResponse(error);
  }
}

controller.logInController = async function (req, res) {
  try {
    logger.trace("signInController started");
    
    let params = {
      userData: req.body.userData,
    };

    await userService.logInService(params);    

    // res.json({ result: true, message: "Signed up successfully." });
  } catch (error) {    
    res.handleFailureResponse(error);
  }
}

controller.getUserByIdController = async function (req, res) {
  try {
    logger.trace("getUserByIdController started");
    
    let params = {
      userId: req.params.id,
    };

    let response = await userService.getUserByIdService(params);    

    res.json(response);
  } catch (error) {    
    res.handleFailureResponse(error);
  }
}

controller.updateUserController = async function (req, res) {
  try {
    logger.trace("updateUserData started");

    let params = {
      userId: req.params.id,
      userData: req.body.userData,
    };

    await userService.updateUserService(params);    

    res.json({ result: true, message: "Updated successfully." });
  } catch (error) {
    res.handleFailureResponse(error);
  }
}

module.exports = controller;