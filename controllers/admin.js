const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt=require('jsonwebtoken');
const userModel = require('../models/user');
const categoryModel = require('../models/categories');
const err= new Error();

exports.login = async(req, res, next) => {
    try{
        // const password="admin@123"
        // const hashedPassword=await bcrypt.hash(password, 12);
        // const newUser = new userModel({
        //   email: "admin@gmail.com",
        //   password: hashedPassword,
        //   name: "admin",
        //   role: "admin",
        //   date: Date.now()
        // });
        // newUser.save();
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
        const current_document = await categoryModel.find({}, { type: 1, total: 1, booked: 1, remaing:1, open:1, module:1 }).lean();
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
//                 type: "games",
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