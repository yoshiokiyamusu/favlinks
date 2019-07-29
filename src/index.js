const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars'); //motor de plantillas html
const path = require('path'); //para las rutas de los files
const bodyParser = require('body-parser');

const session = require('express-session');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const { database } = require('./keys');

const passport = require('passport');

// Intializations
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views')); //__dirname te devuelve el nombre de la carpeta (first parent)

app.engine('.hbs',exphbs({ //.hbs son los files que reemplaza al html para front end
  defaultLayout:'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs', //los archivos de handlebars
  helpers: require('./lib/handlebars') //para guardar las funciones que handlebars no puede procesar
}));
app.set('view engine', '.hbs'); // para autorizar las view frontend

// Middlewares
app.use(session({
  secret: 'faztmysqlnodemysql',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database) //para almacenarlas en BD
}));
app.use(flash()); //para mostrar mensajes al user desde cualquier vista
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})); //para procesar los datos del user q vienen por el usuario input
app.use(bodyParser.json()); // para enviar y recibir json
app.use(passport.initialize());
app.use(passport.session());


// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success'); //app.locals.success para hacerlo disponible en todas las vistas
  app.locals.user = req.user;
  next();
});

// Routes
app.use(require('./routes/index.js'));
app.use(require('./routes/authentication')); //get. cuando no hay la palabra 'links' en la url
app.use('/links', require('./routes/links'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});
