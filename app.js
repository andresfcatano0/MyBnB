const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");


const Accommodation = require("./models/accommodation");

mongoose.connect("mongodb://127.0.0.1:27017/mybnb")
  .then(() => {
    console.log("MONGO CONNECTION OPEN");
  })
  .catch(err => {
    console.log("MONGO CONNECTION ERROR");
    console.log(err);
  })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/accommodations', async(req, res) => {
  const accommodations = await Accommodation.find({});
  res.render('accommodations/index', { accommodations });
})





app.listen(3000, () => {
  console.log('Serving on port 3000')
})