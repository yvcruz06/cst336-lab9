/* Require external APIs and start our application instance */
var express = require('express');
var mysql = require('mysql');
var app = express();

/* Configure our server to read public folder and ejs files */
app.use(express.static('public'));
app.set('view engine', 'ejs');

/* Configure MySQL DBMS */
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'yvcruz',
    password: 'yvcruz',
    database: 'quotes_db'
});
connection.connect();

/* The handler for the DEFAULT route */
app.get('/', function(req, res){
    res.render('home');
});

/* The handler for the /author route */
app.get('/quotes', function(req, res){
    var stmt = 'select * from l9_author join l9_quotes on ' + 
               'l9_author.authorId=l9_quotes.authorId ' +
               'where firstName=\'' + req.query.firstname + 
               '\' and lastName=\'' + req.query.lastname + '\' and ' +
               'category=\'' + req.query.category + '\' and ' +
               'sex=\'' + req.query.gender + '\' and ' + 
               'quote like \'%' + req.query.keyword + '%\';'
               
          
    connection.query(stmt, function(error, results){
        if(error) throw error;
        var name = results[0].firstName + ' ' + results[0].lastName;
        var info = results[0];
        info.dob = info.dob.toString().split(' ').slice(0,4).join(' ');
	    info.dod = info.dod.toString().split(' ').slice(0,4).join(' ');
	   
        res.render('quotes', {name: name, quotes: results, info: info});      
    });

});

/* The handler for undefined routes */
app.get('*', function(req, res){
   res.render('error'); 
});

//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running...");
});

