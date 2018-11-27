const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const mockTodos = [
    {
        _id: new ObjectID(),
        text:'1st test todo'
    },
    {
        _id: new ObjectID(),
        text:'2nd test todo'
    }
];

beforeEach((done) => {
    Todo.remove({}) // Wipe out everything
    .then(()=>{
        return Todo.insertMany(mockTodos);
    })
    .then(()=>done());
});

describe('POST /todos', ()=>{

    it('should create a new todo', (done)=>{
        var text = 'Test todo text';
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err, res)=>{
            if(err){
                return done(err);
            }
            Todo.find({text})
            .then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            })
            .catch((err)=>{
                done(err);
            });
        });
    });

    it('should not create todo with invalid body data', (done)=>{
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err,res)=>{
            if(err) return done(err);
            Todo.find()
            .then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            })
            .catch((err) => done(err));
        });
    });
});

describe('GET /todos', ()=>{

   it('should get all todos', (done) => {
       request(app)
       .get('/todos')
       .expect(200)
       .expect((res)=>{
           expect(res.body.todos.length).toBe(2);
       })
       .end(done);
   }); 
});

describe('DELETE /todos/:id', ()=>{

    it('should delete a todo', (done) => {
        var hexId = mockTodos[1]._id.toHexString();
        request(app)
        .delete('/todos/'+hexId)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            // query database findById toNotExist
            // expect(null).toNotExist()
            Todo.findById(hexId)
            .then((todo)=>{
                expect(todo).toNotExist();
                done();
            })
            .catch((err)=>done(err));
        });
        
    });
    it('should return 404 if todo not found', (done) => {
        var hexId = mockTodos[1]._id.toHexString();
        request(app)
        .delete('/todos/'+hexId)
        .expect(404)
        .end(done);
    });
    it('should return 404 if object ID is invalid', (done) => {
        request(app)
        .delete('/todos/xxx')
        .expect(404)
        .end(done);        
    });
});