const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {

   try {
        //extract the token from the authorization header
    const authorizationHeader = req.get('Authorizaton');
    if(!authorizationHeader)
       throw new Error('Unauthenticated');
    const token = authorizationHeader.split(' ')[1];
    //verify the token with jwt
    const decodedToken = jwt.verify(token, 'supersecretkeythatcannotbeeasilyguessed');
    
    if(!decodedToken)
       throw new Error('Unauthorized');

    req.userId = decodedToken.userId;
    
    next();
     
   } catch (error) {
       console.log(error);
       res.json({message: error.message});  
   }
}

module.exports = isAuth;