const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Buffer } = require("safe-buffer");
const dataList = require('../data/data_list.json');
const utils = require("../utils/utils");

const customerUserType = utils.findInArray(dataList.userTypes, 1, "code").label;

// In order to take advantage of the middleware in the models
// it is preferred to create the Schema first and then pass it to the model
// We have two methods pre for doing something before and post for doing something after
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
      // Custom Validation using validate function in mongoDB and validator package
      validate(value) {
        if (!validator.isEmail(value)) {
          throw Error("Email is not correct");
        }
      },
    },
    isEmailConfirmed: Boolean,
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
    isMobileConfirmed: Boolean,
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
  const user = this;

  // sign() function takes two variables the first one is the data that is going to be embedded in the token and the other is the string that is going to be encrypted 
  const token = jwt.sign({ _id: user._id.toString() }, process.env.TOKEN_STRING);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// A new function we built specially for logging in users
// Accessible on the model (model methods)
// Find by email and then compare the password to make sure it's the right email and password
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw utils.errorUtil({userErrorMessage: "Invalid email or password"});
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw utils.errorUtil({userErrorMessage: "Invalid email or password"});
  }

  return user;
};

// Hash the Password before saving the user to the database//
// There is difference between hashing and encrypting
// Hashing is one way while encryption is two ways we can decrypt the value as long as we have the key
userSchema.pre("save", async function (next) {
  // this plays as the saved document
  const user = this;

  // check if password is modified to hash it for the first time or to re-hash it
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  // We simply call next when we are done to let the code know that we finished the function
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