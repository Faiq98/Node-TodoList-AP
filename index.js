const mysql = require('mysql');
const express = require('express');

var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs-todolistapi',
});

mysqlConnection.connect((err) => {
    if (!err) {
        console.log('Database connection success');
    } else {
        console.log('Database connection fail \n Error ' + JSON.stringify(err, undefined, 2));
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));

app.get('/list', (req, res) => {
    mysqlConnection.query('select * from todo', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
            console.log(rows);
        } else {
            console.log(err);
        }
    });
});

app.get('/list/:id', (req, res) => {
    mysqlConnection.query('select * from todo where todoID = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
            console.log(rows);
        } else {
            console.log(err);
        }
    });
});

app.post('/list', (req, res)=>{
    let todo = req.body;
    var sql = "insert into todo (todoName, todoDesc, todoStatus) values(?,?,?)";
    mysqlConnection.query(sql, [todo.todoName, todo.todoDesc, todo.todoStatus], (err, rows, fields)=>{
        if(!err){
            res.send('Todo List successfuly create');
        }else{
            console.log(err);
        }
    });
});

app.put('/list', (req, res)=>{
    let todo = req.body;
    var sql="update todo set todoName = ?, todoDesc = ?, todoStatus = ? where todoID = ?";
    mysqlConnection.query(sql, [todo.todoName, todo.todoDesc, todo.todoStatus, todo.todoID], (err,rows, fields)=>{
        if(!err){
            console.log(todo.todoID);
            res.send('Todo successfully update');
            console.log(rows);
        }else{
            console.log(err);
        }
    });
});

app.delete('/list/:id', (req, res)=>{
    mysqlConnection.query('delete from todo where todoID = ?', [req.params.id], (err, rows, fields)=>{
        if(!err){
            res.send('User successfully delete');
            console.log(rows);
        }else{
            console.log(err);
        }
    });
});