const { validationResult } = require('express-validator');
const categoryModel = require('../models/categories');
const err= new Error();

  exports.getCategories = async(req, res, next) => {
    try{
        const current_document = await categoryModel.find({ open: { $gt: 0 } }, { type: 1, total: 1, booked: 1, remaing:1, open:1, module:1 }).lean();
        const categories = {
            m1: {videos: {}, toys: {}, games: {}, music: {}},
            m2: {videos: {}, toys: {}, games: {}, music: {}},
            m3: {videos: {}, toys: {}, games: {}, music: {}},
            m4: {videos: {}, toys: {}, games: {}, music: {}},
            m5: {videos: {}, toys: {}, games: {}, music: {}}
          };
          
          for (const item of current_document) {
            const item_type = item['type'];
            const item_module = item['module'];
            
            if (categories[item_module]) {
              categories[item_module][item_type] = {
                total: item['total'],
                booked: item['booked'],
                remaing: item['remaing'],
                open: item['open']
              }
            }
          }          
        res.status(200).json({Suceess:true,Message:"Sucessfully Done!",categories:categories});
        return;
    }
    catch(e){
        console.log('error', e)
        return res.status(e.status || 500).json({ suceess: false, msg: e.message, data: {} })
    }
  };
  exports.updateCategory = async(req, res, next) => {
    try{
        const { module, type, number_seat } = req.query;
        const errors =validationResult(req);
        if (!errors.isEmpty()) {
            err.status=422;
            err.message=errors.array()[0].msg;
            throw err;
        }
        const category = await categoryModel.findOne({module:module,type:type});
        if(!category || number_seat>category.open ){
            res.status(200).json({Suceess:true, Message:"Not Booked"});
            return;
        }
        const newOpen = parseInt(category.open) - parseInt(number_seat);
        console.log("newOpen",newOpen);
        const newRemaing = parseInt(category.remaing) - parseInt(number_seat);
        console.log("newRemaing",newRemaing);
        const newBooked = parseInt(category.booked) + parseInt(number_seat);
        console.log("newBooked",newBooked);
        category.open = newOpen;
        category.remaing = newRemaing;
        category.booked = newBooked;
        category.save();
        res.status(200).json({Suceess:true,Message:"Sucessfully Booked"});
        return;
    }
    catch(e){
        console.log('error', e)
        return res.status(e.status || 500).json({ suceess: false, msg: e.message, data: {} })
    }
  };