module.exports = {
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/signin");
  },
  isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()){
      return next();
    }
    return res.redirect("/links");
  },
  isAdm(req,res,next){
    const admin = req.user.rol;
    if(admin=='admin'){
      return next();
    }
    return res.redirect("/links/ventas/list") 
    },
};
