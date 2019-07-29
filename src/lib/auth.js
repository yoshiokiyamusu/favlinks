const pool = require('../database');

module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    },
    //si ya estas logeado te envia defrente a profile
    isNotLoggedIn(req, res, next){
      if (!req.isAuthenticated()) {
          return next();
      }
      return res.redirect('/profile');
    },

    isPerfilUser (req, res, next) {
      console.log(req.user.perfil);
      if (req.user.perfil == 'admin') {
          return next();
      }
      return res.redirect('/profile');
    }
};
