var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // Tell mongoose which promise impl to use
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};