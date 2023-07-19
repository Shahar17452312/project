const mongoose = require('mongoose');
const cakeSchema = new mongoose.Schema({
  name:{
    type:String,
    require :true
  },
  price:{
    type:Number,
    require:true
  },
  image:{
    type:String,
    require:true
  },
  description:{
    type:String,
    require:true
  },
  type:{
    type:String,
    require:true
  },
  category: {
    type: String,
    enum: ['cake', 'cookie', 'dessert'],
    required: true
  }
});
const cake = mongoose.model('cake',cakeSchema);
module.exports = cake;