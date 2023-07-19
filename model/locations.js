const mongoose = require('mongoose');

const locationScheme = mongoose.Schema({
  name:{
    type: String
  },
  latitude:{
    type:Number,
    require:true
  },
  longitude:{
    type:Number,
    require:true
  }
})

const Location = mongoose.model('Location', locationScheme);
module.exports = Location;

