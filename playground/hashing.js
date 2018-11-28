const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';
// bcrypt.genSalt(10, (err, salt)=>{
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// }); 

var hashedPassword = '$2a$10$R0AvnzVHYaubO1Ly1qtmVOWBTWAvcnAxhyOQCyuNqYbfCfgAfdRY2';
bcrypt.compare('xxx', hashedPassword, (err, res)=>{
    console.log(res);
});

/*
var data = {
    id: 10
};

var secret = '123abc';

var token = jwt.sign(data, secret);
console.log('token: ',token);

// Someone changes token or secret
//token += 'xyz';
//secret += 'xyz';

var decoded = jwt.verify(token, secret);
console.log('decoded: ',decoded);
*/

/* SIMULATION
var message = 'I am user number 3';
var hash = SHA256(message).toString();

console.log('Message: ', message);
console.log('Hash: ', hash);

var data = {
    id: 4
};

const salt = 'somesecret'; // salt is private on server
var token = {
    data,
    hash: SHA256(JSON.stringify(data)+salt).toString()
};

// If someone changes the data and token's hash
token.data.id = 5;
token.hash = SHA256(JSON.stringify(data)).toString();

var resultHash = SHA256(JSON.stringify(token.data)+salt).toString()
if(resultHash === token.hash){
    console.log('Data was not changed');
}else{
    console.log('Data was changed. Don\'t trust it.');
}*/
