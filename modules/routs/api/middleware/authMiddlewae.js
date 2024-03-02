const jwt = require('jsonwebtoken');
const User=require('./../../../models/user')

module.exports = (req, res, next) => {
	const token = req.headers["token"];
	if(token) {
        return jwt.verify(token , config.secret , (err , decode ) => {
            if(err) {
                return res.json({
                    success : false ,
                    data : 'Failed to authenticate token.'
                })
            } 
            
            User.findById(decode.user_id).then(user=>{
                if(user) {
                    user.token = token;
                    req.user = user;
                    next();
                } else {
                    return res.json({
                        success : false ,
                        data : 'User not found'
                    });
                }
            }).catch(err=>{
                if(err) throw err;
            }) 

                
            }) 

            // next();
            // return;
    }

    return res.status(401).json({
        data : {field:"",message:'شما اجازه دسترسی به این بخش را ندارید'},
        success : false
    })
};
