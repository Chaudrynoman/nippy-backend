const mongoos = require('mongoose');

const categorySchema = new mongoos.Schema({
    type:{
        type:String,
        required:true,
        enum: ['videos', 'music', 'toys','games']
    },
    total:{
        type:Number,
        required:true,
    },
    booked:{
        type:Number,
        required:true,
    },
    remaing:{
        type:Number,
        required:true
    },
    open:{
        type:Number,
        required:true,
    },
    module:{
        type:String,
        required:true,
        enum: ['m1', 'm2', 'm3','m4','m5']
    },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true, index: { type: 1, module: 1 } });

const categoryModel = mongoos.model('categories', categorySchema);
module.exports=categoryModel;