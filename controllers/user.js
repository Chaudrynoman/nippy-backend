const { validationResult } = require('express-validator');
const categoryModel = require('../models/categories');
const err = new Error();
const axios = require('axios');
const config = require('../config/config');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.find({ open: { $gt: 0 } }, { type: 1, total: 1, booked: 1, remaining: 1, open: 1, module: 1 })
      .sort({ module: 1 })
      .lean();

    let grouped = {};

    for (let category of categories) {
      let module = category['module'];
      let category_type = category['type'];
      let total = category['total'];
      let booked = category['booked'];
      let open_ = category['open'];
      let remaining = total - booked;

      if (!(module in grouped)) {
        grouped[module] = {};
      }

      if (!(category_type in grouped[module])) {
        grouped[module][category_type] = {
          'total': 0,
          'booked': 0,
          'open': 0,
          'remaining': 0,
        };
      }

      grouped[module][category_type]['total'] += total;
      grouped[module][category_type]['booked'] += booked;
      grouped[module][category_type]['open'] += open_;
      grouped[module][category_type]['remaining'] += remaining;
    }

    let result = [];

    for (let module in grouped) {
      let types = grouped[module];
      let module_data = { 'module': module };

      for (let category_type in types) {
        let data = types[category_type];
        module_data[category_type] = {
          'total': data['total'],
          'booked': data['booked'],
          'remaining': data['remaining'],
          'open': data['open'],
        };
      }

      result.push(module_data);
    }

    res.status(200).json({ success: true, message: "Successfully Done!", categories: result });
    return;

  }
  catch (e) {
    console.log('error', e)
    return res.status(e.status || 500).json({ suceess: false, msg: e.message, data: {} })
  }
};
exports.updateCategory = async (req, res, next) => {
  try {
    const { module, type, transaction_hash, wallet_address } = req.query;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      err.status = 422;
      err.message = errors.array()[0].msg;
      throw err;
    }
    const options = {
      headers: {
        accept: 'application/json',
        'X-API-Key': `${config.x_api_key}`
      }
    };

    const response = await axios.get(`https://deep-index.moralis.io/api/v2/transaction/${transaction_hash}/verbose?chain=goerli`, options);

    if (response && response.data.from_address === wallet_address && parseInt(response.data.logs[0].decoded_event.params[2].value) == 0x0000000000000000000000000000000000000000 ) {
      const number_seat = response.data.logs[0].decoded_event.params[4].value;
      const category = await categoryModel.findOne({ module: module, type: type });
    if (!category || number_seat > category.open) {
      res.status(400).json({ Suceess: false, Message: "Not Booked" });
      return;
    }
    const newOpen = parseInt(category.open) - parseInt(number_seat);
    const newRemaing = parseInt(category.remaing) - parseInt(number_seat);
    const newBooked = parseInt(category.booked) + parseInt(number_seat);
    category.open = newOpen;
    category.remaing = newRemaing;
    category.booked = newBooked;
    category.save();
    res.status(200).json({ Suceess: true, Message: "Sucessfully Booked", response: response.data });
    return;
    }
    else{
      res.status(400).json({ Suceess: false, Message: "Not Booked" });
    return;
    }
    
  }
  catch (e) {
    console.log('error', e)
    return res.status(e.status || 500).json({ suceess: false, msg: e.message, data: {} })
  }
};