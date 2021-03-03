const UserModel = require('../models/user');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

const signupController = (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.json({message: errors.array()[0].msg});
    }

    const {name, email, password } = req.body;

    bcrypt.hash(password, 7).then( hashedPassword => {
        const user = new UserModel({name, email, password: hashedPassword});

        user.save().then( user => {
            res.json({"message": "Sign up successful", "data": {name: user.name, email: user.email}
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});
}


const signinController = (req, res) => {
     
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.json({message: errors.array()[0].msg});
    }
       
       const {email, password} = req.body;

       //find the user with email in our db;
       UserModel.findOne({email}).then( user => {
           if (user){
               //compare passwords
               bcrypt.compare(password, user.password).then( result => {
                 //
                 if (result){
                     return res.json({message: "User signed In"});
                 } 
                 return res.json({message: "Email and Password combination is Incorrect"});
            }).catch(err => {
                   console.log(err);
                   return res.json({message: "Failed to sign in. Please try again"});
                });
           } else{
                  return res.json({message: "User not found"});
           }
        }).catch(err => {
           console.log(err);
           res.json({message: "Server error. Please try again."});
        });

       //compare passwords
}

module.exports = {
    signupController,
    signinController,
}