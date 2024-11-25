const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const controller = require('../controllers/userController');

router.post('/', controller.signUpController);
router.get('/login', controller.logInController);
router.get('/:id', auth, controller.getUserByIdController);
router.patch('/:id', auth, controller.updateUserController);
router.post('/logout', auth, controller.logOutController);
router.post('/logoutFromAllDevices', auth, controller.logOutFromAllDevicesController);

module.exports = router;