const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

//para el signup pequeño
passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  const { fullname } = req.body;
  let newUser = {
    fullname,
    username,
    password
  };
  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const result = await pool.query('INSERT INTO users SET ? ', newUser);
  console.log(result);
  newUser.id = result.insertId;
  return done(null, newUser); //para almacenarlo en una session
   //console.log(req.body);
}));



passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  //console.log(req.body);console.log(username);console.log(password);

  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Welcome ' + user.username));
    } else {
      done(null, false, req.flash('message', 'Incorrect Password'));
    }
  } else { //cero rows
    return done(null, false, req.flash('message', 'The Username does not exists.'));
  }
  
}));



//para guardar el usuario dentro de la session
passport.serializeUser((user, done) => {
  done(null, user.id); //si hay error con null no pasa nada
});

//para obtener datos apartir del id guardado en serializeUser
passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);//await sirve para que el codigo espere hasta que termine de procesar la query
  done(null, rows[0]);//done quiere decir que terminas el proceso
});















/*
//para el signup grande
passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  const { nombre } = req.body;
  const { apellido } = req.body;
  const { edad } = req.body;
  const { dni } = req.body;

  let newUser = {
    nombre,apellido,edad,dni,
    username,
    password
  };
  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const result = await pool.query('INSERT INTO usuarios_prueba SET ? ', newUser);
  console.log(result);
  //newUser.id = result.insertId;
  //return done(null, newUser);

   console.log(req.body);
}));
*/
