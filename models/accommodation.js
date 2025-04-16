const mongoose = require('mongoose');
const Review = require("./review");
const Schema = mongoose.Schema;

const AccommodationSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

// (Query middleware) findOneAndDelete only triggered by findByIdAndDelete
// Can still access what was just deleted
AccommodationSchema.post('findOneAndDelete', async function(doc) {
  if(doc) {
    await Review.deleteMany({ 
      // id for each review in deleted campground's reviews array
      _id: {
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model('Accommodation', AccommodationSchema);