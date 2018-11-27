var express = require('express');
var bodyParser = require('body-parser');

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
        res.status(400)
        res.send(err);
    });
});

// GET

app.listen(3000, ()=>{
    console.log('Started on port 3000');
});