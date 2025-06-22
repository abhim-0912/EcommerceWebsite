
const adminOnly = async (req, res, next) => {
    try {
        if (req.user && req.user.isAdmin) {
            return next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Admins Only',
            });
        }
    } catch (error) {
        console.error('Admin Middleware Error: ', error.message);
        return res.status(500).json({
            success: false,
            message: 'Sever error in admin check',
            error: error.message,
        });
    }
};

module.exports = adminOnly;