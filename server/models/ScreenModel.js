const mongoose = require('mongoose');


const screenSchema = new mongoose.Schema({
    theater : {type : mongoose.Types.ObjectId , ref : " Theater" , requred : true} ,
    name : {type : String , required : true},
     rows : [{
        label : String ,
        category : String ,
        seats : [{number : Number}  ]
     }]
})

const ScreenSchema = mongoose.model('ScreenSchema' , screenSchema)

module.exports = ScreenSchema ; 