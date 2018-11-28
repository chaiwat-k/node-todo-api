var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

var config = require('./config/config');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
app.use(bodyParser.json());

// POST
app.post('/todos', (req, res)=>{
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save()
    .then((doc)=>{
        res.send(doc);
    })
    .catch((err)=>{
        res.status(400);
        res.send(err);
    });
});

// GET
app.get('/todos', (req, res)=>{
    Todo.find()
    .then((todos)=>{
        res.send({todos});
    })
    .catch((err)=>{
        res.status(400);
        res.send(err);
    });
});

// GET /todos/1234
app.get('/todos/:id', (req, res)=>{
    var id = req.params.id;
    // validate id using isValid
    if(!ObjectID.isValid(id)){
        //console.log('Invalid ID: ', id);
        res.status(404);
        res.send({});
        return;
    }
    // findById
    Todo.findById(id)
    .then((todo)=>{
        if(!todo){
            res.status(404);
            res.send({});
            return;
        }
        res.send({todo});
    })
    .catch((err)=>{
        res.status(400);
        res.send({});
    });
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res)=>{
    // get the id
    var id = req.params.id;
    // validate the ID, not valid send 404
    if(!ObjectID.isValid(id)){
        res.status(404);
        res.send();
        return;
    }
    
    // remove by ID using 
    Todo.findByIdAndRemove(id)
    .then((todo)=>{
    //  success
    //      no-doc send 404 with empty body
    //      if doc send it back with 200 
        if(!todo){
            res.status(404);
            res.send();
            return;
        }
        res.send({todo});
    })
    .catch((err)=>{
    //  error
    //      400 send empty body        
        res.status(400);
        res.send();
    });
});

// PATCH /todos/:id
app.patch('/todos/:id', (req, res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        res.status(404).send();
        return;
    }
    var body = _.pick(req.body,['text','completed']); // Filter only updatable properties
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id,{$set:body},{new:true})
    .then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    })
    .catch((err)=>{
        res.status(400).send();
    });

});

// USER =========================

// POST /users
app.post('/users', (req, res)=>{
    var body = _.pick(req.body,['email','password']);
    var user = new User(body);
    user.save()
    .then(()=>{
        return user.generateAuthToken();
    })
    .then((token)=>{
        res.header('x-auth',token);
        res.send(user);
    })
    .catch((err)=>{
        res.status(400).send(err);
    });   
});

// GET /users/me - to get token
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password)
    .then((user) => {
        return user.generateAuthToken()
        .then((token)=>{
            res.header('x-auth',token);
            res.send(user);            
        });
    })
    .catch((err)=>{
        res.status(400);
        res.send(err);
    });     
});

// DELETE /users/me/token
app.delete('/users/me/token', authenticate, (req, res)=>{
   req.user.removeToken(req.token)
   .then(()=>{
       res.status(200).send();
   })
   .catch((err)=>{
        res.status(400);
        res.send(err);
    });    
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log('Started on port ', port);
});

module.exports = {
    app
};