const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {User} = require('./../../models/user');
const {Todo} = require('./../../models/todo');

const mockUserIDs = [
    new ObjectID(),
    new ObjectID()
];
const mockUsers = [
    {
        _id: mockUserIDs[0],
        email: 'aj.styles@wwe.com',
        password: 'ajrock',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: mockUserIDs[0],access:'auth'},'abc123').toString()
        }]
    },
    {
        _id: mockUserIDs[1],
        email: 'ricochet@wwe.com',
        password: 'prince_puma',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: mockUserIDs[1],access:'auth'},'abc123').toString()
        }]
    }
];

const mockTodos = [
    {
        _id: new ObjectID(),
        text:'1st test todo',
        _creator: mockUserIDs[0]
    },
    {
        _id: new ObjectID(),
        text:'2nd test todo',
        completed:true,
        completedAt: 222,
        _creator: mockUserIDs[1]
    }
];

const populateTodos = (done) => {
    Todo.remove({}) // Wipe out everything
    .then(()=>{
        return Todo.insertMany(mockTodos);
    })
    .then(()=>done())
    .catch((err)=>done(err));
};

const populateUsers = (done) => {
    User.remove({})
    .then(()=>{
        return Promise.all([
            new User(mockUsers[0]).save(),
            new User(mockUsers[1]).save(),
        ]);
    })
    .then(()=>done())
    .catch((err)=>done(err));
};

module.exports = {
    mockTodos,
    populateTodos,
    mockUsers,
    populateUsers
};