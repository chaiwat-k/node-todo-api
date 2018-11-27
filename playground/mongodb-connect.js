//const MongoClient = require('mongodb').MongoClient;
// Using ES2015 object destructuring to get MongoClient, ObjectID properties
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        console.log('Unable to connect to MongoDB server');
        return;
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text:'Something to do...',
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         console.log('Unable to insert: ',err);
    //         return;
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name:'Stephen',
    //     age: 40,
    //     location:'Bangrood'
    // },(err,result)=>{
    //     if(err){
    //         console.log('Unable to insert: ', err);
    //         return;
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.close();
});