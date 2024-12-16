const service = require('../services/shopService');
const logger = require('../utils/logger');

let controller = {};

controller.createShopController = async function (req, res) {
  try {
    logger.trace("createShopController started");

    let params = {
      shopData: req.body.data,
      shopOwner: req.user
    };

    let response = await service.createShopService(params);

    res.json(response);
  } catch (error) {
    res.handleFailureResponse(error);
  }
}

module.exports = controller;