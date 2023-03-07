const express = require('express');
const { body, query, param } = require('express-validator');
const router = express.Router();

const myModelController = require('../controllers/myController');

// router.post(
//   '/document',
//     body('jsonData').notEmpty().custom((value, { req }) => {
//       if (!Array.isArray(value)) {
//         throw new Error('jsonData must be an array');
//       }
//       if (value.length === 0) {
//         throw new Error('jsonData cannot be empty');
//       }
//       for (let i = 0; i < value.length; i++) {
//         if (typeof value[i] !== 'object') {
//           throw new Error('Elements of jsonData must be objects');
//         }
//       }
//       try {
//         JSON.stringify(value);
//         return true;
//       } catch (e) {
//         throw new Error('jsonData must be a valid JSON format');
//       }
//     }),
//       myModelController.insertDocument
// );

router.get(
  '/document/:fileName',
  param('fileName').notEmpty().isString(),
  myModelController.getDocument
);

router.put(
  '/document/:fileName',
  param('fileName').notEmpty().isString(),
  body('jsonData').notEmpty().custom((value, { req }) => {
    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('jsonData must be an object');
    }
    if (Object.keys(value).length === 0) { // check if object is empty
      throw new Error('jsonData must not be an empty object');
    }
    try {
      JSON.stringify(value);
      return true;
    } catch (e) {
      throw new Error('jsonData must be a valid JSON format');
    }
  }),  
    myModelController.updateDocument
);

module.exports = router;
