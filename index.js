const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser:true }, ()=>{
    console.log('Connected to DB')
})
//Importing Routes
const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')


//Route Middlewares
app.use("/api/user",authRoute)
app.use("/api",postsRoute)



const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`serving on port:${port}`)
})