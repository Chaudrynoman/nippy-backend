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
    query('number_seat')
      .isInt()
      .withMessage('Number of Seat must be an integer'),
  ], controller.updateCategory);
// router.post('/add',
// [
   
// ], controller.addData);


module.exports = router;