require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')
// // play ground Validator
//  const validatorRoutes = require('./playground/validator')
// Import Routes 
const setMiddleware = require('./middleware/middleware')
const setRoutes = require('./routes/routes')
const MONGODB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@new-project-rtp3t.mongodb.net/blog-page`
const app = express()

// Setup View Engine

app.set('view engine', 'ejs')
app.set('views', 'views')

//Test Validator
//  app.use('/playground',validatorRoutes)
//Using middleware from middleware directory
setMiddleware(app)
setRoutes(app)

app.use((req,res,next) => {
    let error = new Error('404 Page not Found')
    error.status = 404
    next(error)
})
app.use((error, req,res,next)=>{
    if(error.status === 404){
        return res.render('pages/error/404', {flashMessage: {}})
    }
    console.log(chalk.red.inverse(error.message))
    return res.render('pages/error/500', {flashMessage: {}})
}) 



const PORT = process.env.PORT || 8080
mongoose.connect(MONGODB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
    
})
.then(()=>{
    console.log(chalk.red('Database Connected'))
    app.listen(PORT,()=>{
        console.log(`Server is running on PORT ${PORT}`)
    })
})
.catch(e =>{
   return console.log(e)
})
