var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // Tell mongoose which promise impl to use
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose
};