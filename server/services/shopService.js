const Shop = require('../models/shopModel');
const logger = require('../utils/logger');
const utils = require('../utils/utils');

let service = {}

service.createShopService = (params) => {
  return new Promise(async (resolve, reject) => {

    try {
      logger.trace('createShopService Started');

      let { shopData, shopOwner } = params;

      if (!shopOwner.isEmailConfirmed) {
        throw utils.errorUtil({ message: 'Please confirm your email address' });
      }

      shopData.staff = [shopOwner._id];

      let shop = new Shop(shopData);

      await shop.save().catch(error => {
        throw utils.errorUtil({ error, message: "Error while creating shop" });
      });

      resolve({ result: true, shop });
    } catch (error) {
      reject(error);
    }

  })
}

module.exports = service;