const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }        
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access:{
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// To override default toJSON
// thus prevent it from returnin password and token
UserSchema.methods.toJSON = function(){
    var user = this;
    var userObj = user.toObject();
    return _.pick(userObj, ['_id','email']);
};

UserSchema.methods.generateAuthToken = function(){
    var user = this; // Need to use this
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'abc123');

    //user.tokens.push({access, token}); // HAVE ISSUE
    // Use this one instead
    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(()=>token);
};

UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;
    
    try{
        decoded = jwt.verify(token, 'abc123');
    }catch(e){
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        // access nested properties
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')){
        next();
        return;
    }
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
        });
    });     
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};