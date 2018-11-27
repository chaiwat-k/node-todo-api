const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

Todo.remove({})
.then((result)=>{
    console.log(result);
});

//Todo.findOneAndRemove
var id = '5bfd485790a30855fb5c5143';
Todo.findByIdAndRemove(id)
.then((todo)=>{
    console.log(todo);
});