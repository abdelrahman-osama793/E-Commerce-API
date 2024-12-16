const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const controller = require('../controllers/userController');
const utils = require("../utils/utils");
const dataList = require('../data/data_list.json');

const scripts = require('../scripts/user');

//userTypes Constants
const CUSTOMER = utils.findInArray(dataList.userTypes, 1, "code").label;
const SYSTEM_ADMIN = utils.findInArray(dataList.userTypes, 2, "code").label;
const SHOP_OWNER = utils.findInArray(dataList.userTypes, 3, "code").label;
const SHOP_ASSISTANT = utils.findInArray(dataList.userTypes, 4, "code").label;

router.post('/', controller.signUpController);
router.get('/login', controller.logInController);
router.get('/profile', auth({ userTypes: [CUSTOMER, SYSTEM_ADMIN, SHOP_OWNER, SHOP_ASSISTANT] }), controller.getUserProfile);
router.get('/:id', auth({ userTypes: [CUSTOMER] }), controller.getUserByIdController);
router.patch('/:id', auth({ userTypes: [CUSTOMER] }), controller.updateUserController);
router.post('/logout', auth({ userTypes: [CUSTOMER, SYSTEM_ADMIN, SHOP_OWNER, SHOP_ASSISTANT] }), controller.logOutController);
router.post('/logoutFromAllDevices', auth({ userTypes: [CUSTOMER, SYSTEM_ADMIN, SHOP_OWNER, SHOP_ASSISTANT] }), controller.logOutFromAllDevicesController);

//Scripts
router.post('/createDummyUsers', scripts.insertManyUsers)

module.exports = router;