// const stripe = require('stripe')('sk_test_51MzxKnSEnuVPkBtQFSh1FUxNKLit64IogSfQhurakSUhTB1N3v86B3lvoKFk1sCqwzJhSgPyShlXDB0w9plIkZmy00pycHWDIM'); // replace with your own secret key
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/user.route');
const productRoutes = require('./routes/product.route');
const customerRoutes = require('./routes/customer.route');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/users', usersRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customer', customerRoutes);



mongoose
.connect('mongodb+srv://hetvi-45:hkp2002@cluster0.uy0iuao.mongodb.net/Retail?retryWrites=true&w=majority', { useNewUrlParser: true }, { useUnifiedTopology: true })
.then(() => {
  app.listen(3000);
})
.catch(err => {
    console.log(err);
  });
  
  // app.post('/api/checkout', async (req, res) => {
  //   try {
  //     const { amount, token, customer } = req.body;
  //     // const charge = await stripe.charges.create({
  //     //   amount: amount * 100,
  //     //   currency: 'usd',
  //     //   description: 'Thanks For Shopping with us!',
  //     //   source: token,
  //     //   metadata: { customer }
  //     // });
  //     // console.log(charge);
  //     // Store the order in your database or any other system you use
  //     // ...
  //     res.status(200);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).send({ error: { message: err.message } });
  //   }
  // });