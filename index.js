const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db.js')

const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

//Load Config
dotenv.config({ path: './config/config.env'})

//Load Passport
require('./config/passport')(passport)

connectDB()

const app = express()


//Set Public Directory
app.use(express.static(path.join(__dirname,'public')))

//Body Parser
app.use(express.urlencoded({extended: true}))

//Handlebars
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    },
    defaultLayout:'main', 
    extname: '.hbs'
}))
app.set('view engine', '.hbs')

//Express Session
app.use(session({
    secret: 'neutronStar',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection})
}))

app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

//Passport Innitialize
app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/hama', require('./routes/hama'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))