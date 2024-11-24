require("dotenv").config();

const mongoose = require("mongoose");

const connectionURL = process.env.DB;

mongoose
  .connect(connectionURL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Error while connecting to DB\n", error);
    console.log("Unable to Connect");
  });
