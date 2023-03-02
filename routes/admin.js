const express = require ('express');
const { body, query } = require('express-validator')
const router = express.Router();
const controller = require('../controllers/admin');
const isAuth = require('../middleware/isAuth')

router.post('/admin/login',
[
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .trim(),
], controller.login);
router.get('/admin/categories', controller.getCategories);
router.put('/admin/categories',[
    query('module')
      .notEmpty()
      .withMessage('Module is required'),
    query('type')
      .notEmpty()
      .withMessage('Type is required'),
    body('total')
      .isInt()
      .withMessage('Total must be an integer'),
    body('booked')
      .isInt()
      .withMessage('Booked must be an integer'),
    body('remaing')
      .isInt()
      .withMessage('Remaining must be an integer'),
    body('open')
      .isInt()
      .withMessage('Open must be an integer')
      .custom((value, { req }) => {
        const total = req.body.total;
        if ( value > total) {
            console.log("in error");
          throw new Error('Open must be less than Total');
          
        }
        return true;
      }),
  ], controller.updateCategory);
// router.post('/add',
// [
   
// ], controller.addData);


module.exports = router;