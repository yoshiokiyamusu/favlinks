const bcrypt = require('bcryptjs');

const helpers = {};
//para convertir el password en texto plano a simbolos encriptado
//sirve para el proceso signIn
helpers.encryptPassword = async (password) => { //recibes password en texto plano
  const salt = await bcrypt.genSalt(10); //10 digitos de patron encriptado
  const hash = await bcrypt.hash(password, salt); //******
  return hash;
};

//para convertir el password de encriptado a texto plano
//para comparar en el proceso isLoggedIn
helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (e) {
    console.log(e)
  }
};

module.exports = helpers;
