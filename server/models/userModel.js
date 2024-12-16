const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Buffer } = require("safe-buffer");
const dataList = require('../data/data_list.json');
const utils = require("../utils/utils");
const { BadRequestError } = require("../utils/errors");
const logger = require("../utils/logger");

const customerUserType = utils.findInArray(dataList.userTypes, 1, "code").label;

const tokenString = process.env.TOKEN_STRING;

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
      trim: true,
      lowercase: true,
    },
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
      }
    ],
    phone: {
      type: Number,
      required: false,
    },
    isPhoneConfirmed: {
      type: Boolean,
      default: false,
    },
    userType: {
      type: String,
      default: customerUserType,
    },
    birthDate: {
      type: Date,
      required: false
    },
    avatar: {
      type: Buffer,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      }
    ],
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.tokens;
  delete userObj.avatar;

  return userObj;
};

// Accessible on the instances (instance methods)
// Once the user is created a token is created for him
userSchema.methods.generateAuthToken = async function () {
  try {
    logger.trace("generateAuthToken Started");

    const user = this;

    // sign() function takes two variables the first one is the data that is going to be embedded in the token 
    // and the other is the string that is going to be encrypted 
    const token = jwt.sign({ _id: user._id.toString() }, tokenString);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
  } catch (error) {
    throw utils.errorUtil({ error, message: 'Error while logging in' });
  }
};

// A new function we built specially for logging in users
// Accessible on the model (model methods)
// Find by email and then compare the password to make sure it's the right email and password
userSchema.statics.findByCredentials = async (params) => {
  return new Promise(async (resolve, reject) => {

    try {
      const { userData } = params;

      const user = await User.findOne({ email: userData.email }).catch(error => {
        throw utils.errorUtil({ error, message: "Error while logging in" });
      });

      if (!user) {
        throw utils.errorUtil({ message: "Invalid email or password" }, { errorType: BadRequestError });
      }

      const isMatch = await bcrypt.compare(userData.password, user.password).catch(error => {
        throw utils.errorUtil({ error, message: "Error while logging in" });
      });

      if (!isMatch) {
        throw utils.errorUtil({ message: "Invalid email or password" }, { errorType: BadRequestError });
      }

      resolve(user)
    } catch (error) {
      reject(error);
    }

  });
};

/** 
 * @description a middleware that helps us manipulate data before saving until now it is responsible for
 *              hashing password before saving to DB in case of sign up or updating the password.
 */
userSchema.pre("save", async function (next) {
  // this plays as the saved document
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8).catch(error => {
      throw utils.errorUtil({ error, message: "Error happened while saving the data" });
    });
  }

  next();
});

// Remove the user's related unwanted data
userSchema.pre("remove", async function (next) {
  const user = this;
  // await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;