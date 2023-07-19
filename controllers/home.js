const Cake = require('../model/cake');
const user = require('../model/user');
const Order = require('../model/order');
const fs = require('fs');
const Location = require('../model/locations');

//function to check if user is logged in from cookeis 
exports.show = async (req,res)=>{
  if(req.session.email != undefined){
    const {email,cart,_id,name} = req.session.email;
    try {
      const newUser = {cart,email,_id,name};
      if(email==="koby0304@gmail.com"){
        res.render('admin', {user:newUser});
      }else{
        res.render('index' , {user:newUser});
      }
      }catch{   
    }
  }else{
    const { email , name } = req.body;
    try {
        const newUser = await user.findOne({ email: email });
        res.render('index' , {user:newUser});
    }catch{     
    }
  }
}
//returns all cakes from DB 
exports.getCakes = async (req,res)=>{
    try{
        const foundCakes = await Cake.find({});
        res.json(foundCakes);
    }catch(err){
        console.error('Error retrieving cakes:' , err);
        res.json();
    }
};
// saves the item in the cart in the DB
exports.addToCart = async (req, res) => {
    try {
      const { userId, cakeId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
      const cake = await Cake.findById(cakeId);
      if (!cake) {
        return res.status(404).send('Cake not found');
      }
      user.cart.push(cake);
      await user.save();
      res.json(user);
    } catch (err) {
      console.error('Error adding cake to cart:', err);
      res.status(500).json({ error: 'Failed to add cake to cart' });
    }
  };

//returns specific types of cakes by request of user
exports.groupBy = async (req, res) => {
  const { category, cakeType } = req.query;
  try {
    let cakes;

    if (category === "all") {
      cakes = await Cake.find();
    } else if (cakeType === "all") {
      cakes = await Cake.find({ category: category });
    } else {
      cakes = await Cake.find({ category: category, type: cakeType });
    }

    res.json(cakes);
  } catch (error) {
    console.log("Error fetching cakes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.generateRandomCake = async (req,res)=>{
  try {
    const count = await Cake.countDocuments(); 
    const randomIndex = Math.floor(Math.random() * count);  
    const randomCake = await Cake.findOne().skip(randomIndex); 
    return randomCake;
  } catch (err) {
    console.log('Error generating random cake:', err);
    throw err;
  }
};
//returns ratings.json 
exports.getRates = async (req,res)=>{
  fs.readFile('./model/ratings.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch ratings' });
    } else {
      const ratings = JSON.parse(data);
      res.json(ratings);
    }
  });
}
//save the user rate in the json file
exports.Rate = async (req,res)=>{
  const rating = req.body.rating;
  fs.readFile('./model/ratings.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read ratings:', err);
      res.status(500).send('Failed to read ratings');
      return;
    }
    const ratings = JSON.parse(data);
    ratings.push({ rating });
    console.log('New ratings:', ratings); 
    fs.writeFile('./model/ratings.json', JSON.stringify(ratings), 'utf8', (err) => {
      if (err) {
        console.error('Failed to write ratings:', err);
        res.status(500).send('Failed to write ratings');
        return;
      }

      console.log('Ratings saved successfully'); 
      res.send('Rating submitted successfully');
    });
  });
}


exports.getOrders = async (req,res)=>{
  try {
    const orders = await Order.find(); 
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.getLocations = async (req,res)=>{
  try{
    const location = await Location.find();
    res.json(location);
  }catch(err){
    console.error('Error getting the loaction: ' , err);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
}