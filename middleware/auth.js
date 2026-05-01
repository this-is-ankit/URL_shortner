const {getUser} = require("../service/auth")
 
function checkforAuthentication(req, res, next) {
    // Corrected: Use square brackets to access the header
    const tokencookie = req.cookies?.token;
    req.user = null;

    // Corrected: startsWith instead of startWith
    if (!tokencookie) {
        return next();
    }

    const token = tokencookie;
    const user = getUser(token);
    req.user = user;
    return next();
}

function restrictto(roles = []){
    return function(req,res,next){
        if(!req.user) return res.redirect("/login");
        if(!roles.includes(req.user.role)) return res.end("Unathorized");
        return next();
    };
}

async function restrictToLoggedInUserOnly(req , res , next) {
    const userUid = req.headers["authorization"];
    
    if(!userUid) return res.redirect("/login");
    const token = userUid.split('Bearer ')[1]; 
    const user = getUser(token);

    if(!user) return res.redirect("/login");
    req.user = user;
    next();
}
async function checkAuth(req , res , next) {
    const userUid = req.headers["Authorization"];
    const token = userUid.split("Bearer ")[1];
    const user = getUser(token);

    req.user = user;
    next()
}
module.exports = {
    restrictto,
    checkforAuthentication
};