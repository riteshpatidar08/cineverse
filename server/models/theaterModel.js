const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: { type: String },
  city: { type: String }, //pvr cinema  //jaipur  //geojson ppoint polyogon
location : {
    type : {
        type : String ,
        required : true
    },
    coordinates : {
        type :  [Number] ,
        required  :true
    }
},
  screens: [
    {
      screenName: { type: String },
      totalSeats: { type: Number },
      seatLayout: [
        {
          row: { type: String }, 
          seatCategory: { type: String },
          seatPrice: { type: Number },
          seats: [{ type: String }],
        },
      ],
    },
  ],
});

const Theater = mongoose.model("Theater" , theaterSchema);
module.exports = Theater;
// [
//   {
//     screenName: 1,
//     totalSeats: 200,
//     seatLayout: [
//       {
//         row: 'G',
//         seatCategory: 'premium',
//         seatPrice: 500,
//         seats: ['1', '2', '4', '5', '6', '7', '8', '9', '10'],
//       },
//     ],
//   },
// ];


// theater - screen - seatLayout / used embedded data model because data is not going to grow unbounded . 