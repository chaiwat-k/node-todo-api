const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if(err){
        console.log('Unable to connect to MongoDB server');
        return;
    }
    console.log('Connected MongoDB server');

    // findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5bfcd6de90a30855fb5c45e9')
    // },{
    //     $set:{
    //         completed: false
    //     }
    // },{
    //     returnOriginal: false
    // })
    // .then((result)=>{
    //     console.log(result);
    // })
    // .catch((err)=>{
    //     console.log('Unable to update: ', err);
    // });

    db.collection('Users')
    .findOneAndUpdate(
        {_id: new ObjectID('5bfccc2990a30855fb5c4471')}, // filter
        {
            $set:{
                name: 'Franky'
            },
            $inc:{
                age: 1
            }
        },{
            returnOriginal: false
        }
    )
    .then((result)=>{
        console.log(result);
    })
    .catch((err)=>{
        console.log('Unable to update: ', err);
    });    

    // db.close();
});