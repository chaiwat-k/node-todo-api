//const MongoClient = require('mongodb').MongoClient;
// Using ES2015 object destructuring to get MongoClient, ObjectID properties
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        console.log('Unable to connect to MongoDB server');
        return;
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos')
    // .find({})
    // .count()
    // .then((count)=>{
    //     console.log('Todos('+count+')');
    //     //console.log(JSON.stringify(docs, undefined, 2));
    // })
    // .catch((err)=>{
    //     console.log('Unable to fetch todos',err);
    // });

    db.collection('Users')
    .find({name:'Stephen'})
    .toArray()
    .then((docs)=>{
        console.log('Users ('+docs.length+')');
        console.log(JSON.stringify(docs,undefined,2));
    })
    .catch((err)=>{
        console.log('Unable to fetch users', err);
    });

    //db.close();
});