const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const utils = require("../utils/utils");
const dataList = require('../data/data_list.json');
const controller = require('../controllers/shopController');

//userTypes Constants
const CUSTOMER = utils.findInArray(dataList.userTypes, 1, "code").label;
const SYSTEM_ADMIN = utils.findInArray(dataList.userTypes, 2, "code").label;
const SHOP_OWNER = utils.findInArray(dataList.userTypes, 3, "code").label;
const SHOP_ASSISTANT = utils.findInArray(dataList.userTypes, 4, "code").label;

router.post('/', auth({ userTypes: [SHOP_OWNER] }), controller.createShopController);
// router.get('/', auth({ userTypes: [CUSTOMER, SYSTEM_ADMIN, SHOP_OWNER, SHOP_ASSISTANT] }), controller.getShopDetailsController);

module.exports = router;