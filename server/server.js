var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

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

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log('Started on port ', port);
});

module.exports = {
    app
};