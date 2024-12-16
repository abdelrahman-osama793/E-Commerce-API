const service = require('../services/productService');
const logger = require('../utils/logger');

let controller = {};

controller.createProductController = async function (req, res) {
  try {
    logger.trace("createProductController started");

    let params = {
      productData: req.body.data,
      user: req.user
    };

    let response = await service.createProductService(params);

    res.json(response);
  } catch (error) {
    res.handleFailureResponse(error);
  }
}

controller.getAllProductsController = async function (req, res) {
  try {
    logger.trace("getAllProductsController started");

    let params = {
      filters: req.body.filters,
      pagination: req.body.pagination,
    };

    let response = await service.getAllProductsService(params);

    res.json(response);
  } catch (error) {
    res.handleFailureResponse(error);
  }
}

module.exports = controller;