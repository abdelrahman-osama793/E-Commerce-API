const express = require("express");
// const auth = require("../middleware/auth");
const router = express.Router();
const controller = require('../controllers/userController');

router.post('/', controller.signUpController);
router.get('/', controller.signInController);
router.get('/:id', controller.getUserByIdController);

module.exports = router;