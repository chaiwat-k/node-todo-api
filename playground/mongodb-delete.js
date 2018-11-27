const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if(err){
        console.log('Unable to connect to MongoDB server');
        return;
    }
    console.log('Connected MongoDB server');

    // deleteMany
    // db.collection('Todos').deleteMany({text:'Having lunch'})
    // .then((result)=>{
    //     console.log(result);
    // })
    // .catch((err)=>{
    //     console.log('Unable to delete: ', err);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text:'Having lunch'})
    // .then((result)=>{
    //     console.log(result);
    // })
    // .catch((err)=>{
    //     console.log('Unable to delete: ', err);
    // });    

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed:true})
    // .then((result)=>{
    //     console.log(result);
    // })
    // .catch((err)=>{
    //     console.log('Unable to delete: ', err);
    // });

    // db.close();
});