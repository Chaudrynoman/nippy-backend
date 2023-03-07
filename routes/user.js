const express = require ('express');
const { body, query } = require('express-validator')
const router = express.Router();
const controller = require('../controllers/user');

router.get('/user/categories', controller.getCategories);
router.put('/user/categories',[
    query('module')
      .notEmpty()
      .withMessage('Module is required'),
    query('type')
      .notEmpty()
      .withMessage('Type is required'),
    query('wallet_address')
    .notEmpty()
      .withMessage('wallet_address must be an required'),
      query('transaction_hash')
      .notEmpty()
      .withMessage('transaction_hash must be required'),
  ], controller.updateCategory);


module.exports = router;