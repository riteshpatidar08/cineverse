const asyncHandler = require('express-async-handler')
const City = require('../models/cityModel')
const geoip = require('geoip-lite');



exports.getLocation = async(req,res)=>{
 try {
    const {s} = req.query  ;
    const cities = City.find({cityName : {$regex : s , $options : 'i' }}) ;
    console.log(cities)
    console.log(req.ip)
    const geo = geoip.lookup('207.97.227.239');
    // ::
    console.log(geo)
    
 } catch (error) {
    res.send(error.message)
 }


}

// currentlocaiton , top citities list 