const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5bfd16a7bffa11f82a3e0bec11';
// if(!ObjectID.isValid(id)){
//     console.log('ID not valid');
// }

// Todo.find({_id: id})
// .then((todos)=>{
//     console.log('Todos: ', todos);
// });

// Todo.findOne({_id:id})
// .then((todo)=>{
//     console.log('Todo: ', todo);
// });

// Todo.findById(id)
// .then((todo)=>{
//     if(!todo) return console.log('ID not found!');
//     console.log('Todo by ID: ', todo);
// })
// .catch((err)=>console.log(err));

id = '5bfcf1019e97c84413616766';
User.findById(id)
.then((user)=>{
    if(!user){
        console.log('User not found by ID: ', id);
        return;
    }
    console.log('Found one with email: ', user.email);
})
.catch((err)=>console.log(err));
