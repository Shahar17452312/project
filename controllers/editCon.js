const Cake = require('../model/cake');
const mongoose = require('mongoose');

//update (admin)
exports.update = async (req, res) => {
    try {
        const { _id } = req.params;
        const { name, price , image , description } = req.body;
        const cake = await Cake.findById(_id);
        if (!cake) {
          return res.status(404).send('Cake not found');
        }
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).send('Invalid cake ID');
        }
        cake.name = name;
        cake.description = description;
        cake.price = price;
        cake.image = image;
        await cake.save();
        res.json(cake);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
  };
//add - admin
  exports.add = async (req, res) => {
    try {
        const name = req.body.name;
        const price = req.body.price;
        const image = req.body.image;
        const description = req.body.description;
        const type = req.body.type;
        const category = req.body.category;
        const newCake = new Cake({
          name,
          price,
          image,
          description,
          type, 
          category
        });
        await newCake.save();
        res.json(newCake);
      } catch (err) {
        console.error('Error adding cake:', err);
        res.status(500).json({ error: 'Failed to add cake' });
      }
  };
//remove -  admin
  exports.remove = async (req, res) => {
    const { _id } = req.params;

    try {
      const deletedCake = await Cake.findByIdAndDelete(_id);
      if (!deletedCake) {
        console.log('Cake not found');
      }
      res.json(deletedCake);
      console.log('Cake deleted:', deletedCake);
    } catch (error) {
      console.error('Error deleting cake:', error);

    }
    };
    //show - admin
exports.show = async (req,res)=>{
    const foundCakes = await Cake.find({});
    res.render('admin', { index: foundCakes });
}
  