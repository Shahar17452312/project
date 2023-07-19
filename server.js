const express = require('express');
const app = express();
const port = 3000;
const { default: mongoose } = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const cakeController = require('./controllers/home');
const WebSocket = require('ws');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
//cookies
app.use(
  session({
    secret: 'admin',
    saveUninitialized: false,
    resave: false,
  })
);
app.use(express.json());
mongoose
  .connect('mongodb://0.0.0.0:27017/onlineShop', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');

    var server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    //webSocket
    const wss = new WebSocket.Server({ server });
    wss.on('connection', async (ws) => {
      console.log('WebSocket connected');
      const timer = setTimeout(async () => {
        const specialCake = await cakeController.generateRandomCake(); 
        const cakeData = {
          image: specialCake.image,
          message: 'Special Cake Sale!',
        };
        ws.send(JSON.stringify({ event: 'specialCakePopup', data: cakeData }));
      }, 5000);
      ws.on('close', () => {
        clearTimeout(timer); 
      });
    });
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });
app.use(express.static('views'));
const home = require('./routs/homeR');
const login = require('./routs/login');
const register = require('./routs/register');
const edit = require('./routs/editR');
const cartRouter = require('./routs/cartR');

//routs
app.use('/',home);
app.use('/',register);
app.use('/', login);
app.use('/', edit);
app.use('/',cartRouter);
app.get('/admin',login)
app.set('view engine','ejs')