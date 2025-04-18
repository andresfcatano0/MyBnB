const mongoose = require("mongoose");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers");
const Accommodation = require("../models/accommodation");

mongoose.connect("mongodb://127.0.0.1:27017/mybnb")
  .then(() => {
    console.log("MONGO CONNECTION OPEN");
  })
  .catch(err => {
    console.log("MONGO CONNECTION ERROR");
    console.log(err);
  })

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Accommodation.deleteMany({});
  for (let i = 0; i < 20; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const accommodation = new Accommodation({
      author: '6801996264463400ea520cbf',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://picsum.photos/400?random=${Math.random()}`,
      description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus vero laboriosam sint quisquam adipisci veritatis minus architecto. Laudantium voluptates veniam culpa enim quaerat recusandae consectetur ea soluta! Ipsam, iure quas.",
      price
    });
    await accommodation.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});