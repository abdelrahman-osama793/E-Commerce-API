let shopOwnersAndAssistants = require('../data/generated_shop_owners_and_assistants.json');
const User = require("../models/userModel");
const { BadRequestError, ResourceNotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");
const utils = require("../utils/utils");
const dataList = require("../data/data_list.json");

let scripts = {};

scripts.insertManyUsers = async () => {
  return new Promise(async (resolve, reject) => {

    try {
      logger.trace("insertManyUsers Started");
      console.log(shopOwnersAndAssistants.length);

      await User.insertMany(shopOwnersAndAssistants).catch(error => {
        utils.errorUtil({error, message: 'Error happened while inserting users'});
      });

      resolve();
    } catch (error) {
      reject(error)
    }

  })
}

module.exports = scripts