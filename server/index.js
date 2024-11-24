'use strict';

require("dotenv").config();
require("./db/connection");

const express = require("express");
const morgan = require('morgan');
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const errorHandlerMiddleware = require("./middlewares/responseHandler");
const app = express();
const port = process.env.PORT || 8888;
// const auth = require("../middleware/auth");

// const NUM_OF_CPUS = process.env.clusters || 4;

app.use(errorHandlerMiddleware)
app.use(morgan('dev'))
app.use(express.json());
app.use("/api/user", userRoutes);
// app.use("/api/product", productRoutes);
// app.use("/api/cart", cartRoutes);
  
app.use((req, res, next) => {
  const error = new Error('Not Found!');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`The server is running on port: ${port}`);
});