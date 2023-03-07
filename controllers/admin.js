const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt=require('jsonwebtoken');
const userModel = require('../models/user');
const categoryModel = require('../models/categories');
const err= new Error();

exports.login = async(req, res, next) => {
    try{
        const {email,password}=req.body;
        const errors =validationResult(req);
        if (!errors.isEmpty()) {
            err.status=422;
            err.message=errors.array()[0].msg;
            throw err;
        }
        const user=await userModel.findOne({ email: email });
        if (!user) {
            err.status=422;
            err.message="This Email is not Register!";
            throw err;
        }
        const doMatch=await bcrypt.compare(password, user.password);
        if (!doMatch) {
            err.status=401;
            err.message="Email or Password Incorrect!";
            throw err;
        }
        const token=jwt.sign({
            email: email,
            id: user._id.toString(),
            role: user.role,
            expiresIn: '1h'
        },
        'securesecret',
        );
        res.status(200).json({Suceess:true,Message:"Sucessfully LogIn!",Token:token,value:token.id});
        return;
    }
    catch(e){
        console.log('error', e)
        return res.status(e.status || 500).json({ suceess: false, msg: e.message, data: {} })
    }
  };
  exports.getCategories = async(req, res, next) => {
    try{
        const categories = await categoryModel.find({}, { type: 1, total: 1, booked: 1, remaing:1, open:1, module:1 }).sort({ module: 1 })
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
        res.status(200).json({Suceess:true,Message:"Sucessfully Done!",categories: result});
        return;
    }
    catch(e){
        console.log('error', e)
        return res.status(e.status || 500).json({ suceess: false, msg: e.message, data: {} })
    }
  };
  exports.updateCategory = async(req, res, next) => {
    try{
        const {module,type} = req.query;
        const {total,open} =req.body;
        let remaing = 0;
        const errors =validationResult(req);
        if (!errors.isEmpty()) {
            err.status=422;
            err.message=errors.array()[0].msg;
            throw err;
        }
        const category = await categoryModel.findOne({module:module,type:type});
        if(total!=category.total){
            remaing= parseInt(total) - parseInt(category.booked);
        }
        else{
            remaing=category.remaing;
        }
        if(category){
            category.total=total;
            category.remaing=remaing;
            category.open=open;
            category.save();
        }
        res.status(200).json({Suceess:true,Message:"Sucessfully Update!"});
        return;
    }
    catch(e){
        console.log('error', e)
        return res.status(e.status || 500).json({ suceess: false, msg: e.message, data: {} })
    }
  };

// exports.addData = async(req, res, next) => {
//     try{
//         for(let i=1;i<6;i++){
//             const newUser = new categoryModel({
//                 type: "videos",
//                 total: 30,
//                 booked: 15,
//                 remaing: 15,
//                 open: 10,
//                 module: `m${i}`
//             });
//             newUser.save();
//         }
//         res.status(200).json({Suceess:true,Message:"Sucessfully LogIn!",Token:token,value:token.id});
//         return;
//     }
//     catch(e){
//         console.log('error', e)
//         return res.status(e.status || 500).json({ suceess: false, msg: e.message, data: {} })
//     }
//   };