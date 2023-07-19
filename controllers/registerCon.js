const user = require('../model/user');
const bcrypt = require('bcryptjs');
//save register information in the mongoDB

exports.saveInfo = async (req,res)=>{
  try {
    const { name, email, address, password } = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new user({
      name,
      email,
      address,
      password : hashedPassword
    });
    await newUser.save();
    req.session.email = {
      email : newUser.email,
      name: newUser.name,
      cart : newUser.cart,
      _id :newUser._id
    };
    if(email==="koby0304@gmail.com"){
      res.render('admin',{user : newUser});
    }else{
      res.render('index' , {user: newUser}); 
    }
  } catch (err) {
    console.error('Error registering user:', err);
    res.redirect('/register'); 
  }
};