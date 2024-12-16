const logger = require("../utils/logger");
const utils = require("../utils/utils");
const dataList = require('../data/data_list.json');
const Product = require("../models/productModel");

let service = {};

service.createProductService = (params) => {
  return new Promise(async (resolve, reject) => {

    try {
      logger.trace("createProductService started");

      let { productData, user } = params;

      if (productData.category) {
        let category = utils.findInArray(dataList.productCategories, productData.category, "code");

        productData.category = category.label;

        if (productData.subCategory) {
          productData.subCategory = utils.findInArray(category.subcategories, productData.subCategory, "code").label;
        }
      }

      productData.addedBy = user._id;

      const product = await Product(productData).save().catch((error) => {
        throw utils.errorUtil({ error, message: 'Error while saving the product' });
      });

      resolve({ result: true, product });

    } catch (error) {
      reject(error);
    }

  });
}

function constructProductsQuery(params) {
  try {
    const { filters } = params;

    let productsQuery = {};

    if (filters.category) {
      let category = utils.findInArray(dataList.productCategories, filters.category, "code");

      productsQuery.category = category.label;

      if (filters.subCategory) {
        productsQuery.subCategory = utils.findInArray(category.subcategories, filters.subCategory, "code").label;
      }
    }

    if (filters.name) {
      productsQuery.name = { $regex: new RegExp(filters.name, 'i') }
    }

    return productsQuery;
  } catch (error) {
    throw utils.errorUtil({ error, message: 'Error while constructing products query' });
  }
}

service.getAllProductsService = (params) => {
  return new Promise(async (resolve, reject) => {

    try {
      const { filters, pagination } = params;

      let productsQuery = constructProductsQuery({ filters })

      let products = await Product.find(productsQuery).limit(pagination.limit).skip(pagination.skip).catch(error => {
        throw utils.errorUtil({ error, message: 'Error while fetching all products' });
      });

      let totalCount = await Product.countDocuments(productsQuery).catch(error => {
        throw utils.errorUtil({ error, message: 'Error while fetching all products' });
      });

      resolve({ result: true, products, totalCount });

    } catch (error) {
      reject(error);
    }

  });
}

module.exports = service;