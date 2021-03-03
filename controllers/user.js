const UserModel = require('../models/user');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');

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


const signinController = async (req, res) => {
    
     try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json({message: errors.array()[0].msg});
        }  

        const {email, password} = req.body;

        //find User
       const user = await UserModel.findOne({email});

       if(!user){
        return res.json({message: "User not found"});
       }

        //compare passwords
       const isAuth = await  bcrypt.compare(password, user.password);
       if(!isAuth){
            return res.json({message: "Email and Password combination is Incorrect"});
       }
        const token = jwt.sign(
            {name: user.name, email: user.email, userId: user._id},
             'supersecretkeythatcannotbeeasilyguessed',
             {expiresIn: "1h"});   

       return res.json({message: "User signed In", token });

     } catch (error) {
        res.json({message: "Server error. Please try again."});
     }

}

module.exports = {
    signupController,
    signinController,
}