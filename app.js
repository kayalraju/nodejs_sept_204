const express = require('express');
const ejs = require('ejs');
const dotenv = require('dotenv');
const connectDb = require('./App/config/db');

dotenv.config();
const app = express();
connectDb()

app.set('view engine','ejs');
app.set('views','views')
app.use(express.static('public'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/uploads',express.static('uploads'));
app.use('/uploads',express.static(__dirname +'/uploads'));


const HomeRouter = require('./App/router/home.router');

app.use(HomeRouter);
const port =3001;

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})

