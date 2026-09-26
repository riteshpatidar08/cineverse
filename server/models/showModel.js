const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
  required: true,
  },
  screenName: { type: String },
  showDate: { type: Date },
  startTime: { type: Date },
  categoryPricing : [{
    category : {type : String , required : true},
    price : {type: Number , required : true}
  }]
   // seatStatus: [
  //   {
  //     seatRow: { type: String },
  //     seatNumber: { type: String },
  //     seatPrice : {type :Number},
  //     seatCategory: { type: String },
  //     isBooked: { type: Boolean },
  //   },
  // ],
});

const Show = mongoose.model('Show' , showSchema) ;
module.exports = Show;




// [{'name' : "ritesh" , course : "cse"} , {name : "ayushman" , course :"me" , }, {name : devendra , course : cse}]

// User.distinc('course');

// ['cse' , 'me']