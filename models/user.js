const mongoos = require('mongoose');

const userSchema = new mongoos.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
    },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const userModel = mongoos.model('users', userSchema);
module.exports=userModel;