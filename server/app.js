if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){
    require('dotenv').config()
}

const express = require("express")
const app = express()
const cors = require('cors')
const port = 3000
const route = require('./routes')
const mongoose = require('mongoose')
const errorHandler = require('./middlewares/errorhandler')

mongoose.connect('mongodb://localhost/fort-list',{useNewUrlParser : true})

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

app.use('/',route)
app.use(errorHandler)

app.listen(port, ()=>{
    console.log(`listening to port: ${port}`);
})