const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req,res,next) => {
    let token;
    try {
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');

            if(!user){
                return res.status(401).json({
                    success: false,
                    message: 'User not found',
                });
            }
            req.user = user;
            return next();
        } else{
            return res.status(401).json({
                success: false,
                message: 'No token provided',
            });
        }
    } catch (error) {
        console.error('Auth Middleware Error: ',error.message);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid or expired token',
            error: error.message,
        });
    }
};

module.exports = protect;