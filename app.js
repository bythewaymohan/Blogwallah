const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');// we setup morgan for login
const connectDB = require('./config/db');//import the db.js file
const passport = require('passport')//import the passport
const session = require('express-session')//import the express session
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const MongoStore = require('connect-mongo')


// Load config
dotenv.config({ path: './config/config.env' })

//passport config
require('./config/passport')(passport)

connectDB() //this function call the db

const app = express() //initilze our app

//Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Method Overriding
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

//logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
//Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helper/hbs')

//Handlebars tamplate engine
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,

    }, extname: '.hbs', defaultLayout: "main"
}));
app.set('view engine', '.hbs');

//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    // store: new MongoStore({mongooseConnection: mongoose.connection})
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://12345:12345@cluster0.r9yhpuv.mongodb.net/?retryWrites=true&w=majority' })
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Set  global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})


//Static Folder 
app.use(express.static(path.join(__dirname, 'public')));

//Routes linking here
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/blogss', require('./routes/blogss'));

const PORT = process.env.PORT || 3000

app.listen(
    PORT,
    console.log(`Server running on in ${process.env.NODE_ENV} mode on port ${PORT}`));