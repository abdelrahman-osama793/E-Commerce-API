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

controller.signInController = async function (req, res) {
  try {
    logger.trace("signInController started");
    
    let params = {
      userData: req.body.userData,
    };

    await userService.signInService(params);    

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

module.exports = controller;