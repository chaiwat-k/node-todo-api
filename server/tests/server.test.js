const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {mockTodos, populateTodos, mockUsers, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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
        request(app)
        .delete('/todos/xxx')
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

describe('PATCH /todos/:id', ()=>{

    it('should update a todo with given ID', (done)=>{
        // Grab id if first item
        // update text
        // set completed = true
        // assert 200
        // assert text has been changed
        // assert completedAt is a number and toBe the given   
        var newText =  "Something did yesterday...";    
        var hexId = mockTodos[0]._id.toHexString();
        request(app)
        .patch('/todos/'+hexId)
        .send({text: newText, completed: true})
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(newText);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
    });
    it('should clear complatedAt when todo is not completed', (done)=>{
        // Grab id if 2nd item
        // update text
        // set completed = false
        // assert 200
        // assert text has been changed
        // assert completedAt is null    
        var newText =  "Something todo tomorrow...";    
        var hexId = mockTodos[1]._id.toHexString();
        request(app)
        .patch('/todos/'+hexId)
        .send({text: newText, completed: false})
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(newText);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);            
    });
});

describe('GET /users/me', () => {
    
    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', mockUsers[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(mockUsers[0]._id.toHexString());
            expect(res.body.email).toBe(mockUsers[0].email)            
        })
        .end(done);
    });

    it('should return a 401 if not authenticated.', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'exaple@example.com';
        var password = '123mnb';
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if(err) return done(err);
            User.findOne({email})
            .then((user)=>{
                expect(user).toExist()
                expect(user.password).toNotBe(password)
                done();
            })
            .catch((err)=>done(err));
        });
    });
    it('should return validation errors if request is invalid', (done) => {
        var email = 'invalid_email';
        var password = '';
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
    });
    it('should not create user if email in use', (done)=>{
        var email = mockUsers[0].email;
        var password = 'hello_world';
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
    });
});

describe('POST /users/login', ()=>{
    it('should login user and return auth token', (done)=>{
        request(app)
        .post('/users/login')
        .send({
            email: mockUsers[1].email,
            password: mockUsers[1].password
        })
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist();
        })
        .end((err, res)=>{
            if(err) return done(err);
            User.findById(mockUsers[1]._id)
            .then((user)=>{
                // expect(user.tokens[0]).toInclude({
                //     access: 'auth',
                //     token: res.headers['x-auth']
                // });
                expect(user.tokens[user.tokens.length - 1].access).toBe('auth');
                expect(user.tokens[user.tokens.length - 1].token).toBe(res.headers['x-auth']);
                done();
            })
            .catch((err)=>done(err));
        });
    });
    it('should reject invalid login', (done)=>{
        request(app)
        .post('/users/login')
        .send({
            email: mockUsers[1].email,
            password: 'hello'
        })
        .expect(400)
        .end(done);        
    });
});

describe('DELETE /users/me/token', ()=>{
    it('should delete token', (done) => {
        request(app)
        .delete('/users/me/token')
        .set('x-auth', mockUsers[1].tokens[1].token)
        .expect(200)
        .end(done);
    });
});