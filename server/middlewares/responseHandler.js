const utils = require("../utils/utils");
const dataList = require('../data/data_list.json');

const InternalServeErrorCode = utils.findInArray(dataList.ErrorTypesData, 1, 'code').value;
const BadRequestErrorCode = utils.findInArray(dataList.ErrorTypesData, 2, 'code').value;
const ResourceNotFoundErrorCode = utils.findInArray(dataList.ErrorTypesData, 3, 'code').value;
const AuthorizationErrorCode = utils.findInArray(dataList.ErrorTypesData, 4, 'code').value;
const AuthenticationErrorCode = utils.findInArray(dataList.ErrorTypesData, 5, 'code').value;

function errorHandlerMiddleware(req, res, next) {
  res.handleFailureResponse = function (error) {
    if (error.code === InternalServeErrorCode) {
      return res.status(error.statusCode).json({
        result: false,
        message: error.message
      });
    }

    if (error.code === BadRequestErrorCode) {
      return res.status(error.statusCode).json({
        result: false,
        message: error.message
      });
    }

    if (error.code === ResourceNotFoundErrorCode) {
      return res.status(error.statusCode).json({
        result: false,
        message: error.message
      });
    }

    if (error.code === AuthorizationErrorCode) {
      return res.status(error.statusCode).json({
        result: false,
        message: error.message
      });
    }

    if (error.code === AuthenticationErrorCode) {
      return res.status(error.statusCode).json({
        result: false,
        message: error.message
      });
    }

    return res.status(500).json({ result: false, message: error.message || 'An error happened' });

  }

  next();
}

module.exports = errorHandlerMiddleware;