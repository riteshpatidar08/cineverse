const app = require('./app.js');
const config = require('./config/config.js');

app.listen(config.app.port, () => {
  console.log(`Server is running on port ${config.app.port}`.cyan);
});


