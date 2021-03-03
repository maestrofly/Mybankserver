//import express
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const accountRoutes = require('./routes/account');
const bankRoutes = require('./routes/bank');
const userRoutes = require('./routes/user');



//create express server instance
const server = express();

//middlewares
server.use(bodyParser.json());


//routes
server.use(accountRoutes);
server.use(bankRoutes);
server.use(userRoutes)


//connect to database and start server

mongoose.connect("mongodb+srv://codetrainuser:natori18@cluster0.u3wkh.mongodb.net/codetrain?retryWrites=true&w=majority",
{ useNewUrlParser: true, useUnifiedTopology: true}
)
.then(result => {
    
server.listen(3000, () => console.log('server is ready'));

}).catch(err => console.log(err));