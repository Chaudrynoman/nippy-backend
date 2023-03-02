const mongoose = require('mongoose');

const myModelSchema = new mongoose.Schema({
  fileName: {
    type: Number,
    required: true,
    unique: true
  },
  jsonData: {
    type: Object,
    required: true,
    },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const MyModel = mongoose.model('MyModel', myModelSchema);

module.exports = MyModel;
