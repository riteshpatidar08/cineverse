const app = require('./app.js');
const config = require('./config/config.js')



app.listen(config.app.port , ()=>{
console.log(`Server is running on the port  ${process.env.PORT}`.rainbow)
})

//environment variables : 

