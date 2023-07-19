const user = require('../model/user');
const Cake = require('../model/cake');
const bcrypt = require('bcryptjs');
//removes the session cookies
exports.logout = (req,res)=>{
  req.session.destroy(() => {
    res.redirect('/');
  });
}
//returns all of the cakes 
exports.show = async (req, res) => {
  const foundCakes = await Cake.find({});
  res.json(foundCakes);
};
//checks the passwoed when login
exports.checkPass = async (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = await user.findOne({ email: email });
    if (!newUser) {
      return res.status(401).redirect('/login.html');
    }
    const passwordMatch = await bcrypt.compare(password, newUser.password);
    if (!passwordMatch) {
      return res.status(401).redirect('/login.html');
    }
    req.session.email = {
      email : newUser.email,
      name: newUser.name,
      cart : newUser.cart,
      _id :newUser._id
    };
    if (email === 'koby0304@gmail.com') {
      res.render('admin' , {user: newUser});
    }
    else {
      res.render('index' , {user: newUser});
    }
  } catch (err) {
    console.error('Error occurred during login:', err);
    res.status(500).send('Internal Server Error');
  }
};