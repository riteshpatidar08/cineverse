const mongoose = require('mongoose');

const config = require('./config');


const dbConnect = async () => {
    try {
       const connnection = await mongoose.connect(config.db.mongodbURI);
       console.log("mongodb is UP".gray)
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = dbConnect ;