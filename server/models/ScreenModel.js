const mongoose = require('mongoose');


const screenSchema = new mongoose.Schema({
    theater : {type : mongoose.Types.ObjectId , ref : " Theater" , requred : true} ,
    name : {type : String , required : true},
     rows : [{
        label : String ,
        category : String ,
        layout : {type : String , required : true},
        start : {type :Number , default : 1} ,
        spaceAfter : {type : Number  , default : 0} ,
        seats : [{number : Number}  ]
     }]
})

const ScreenSchema = mongoose.model('ScreenSchema' , screenSchema)

module.exports = ScreenSchema ; 