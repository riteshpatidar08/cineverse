const multer = require('multer')

const crypto = require('crypto')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// const upload = multer({ storage: storage })

module.exports = upload