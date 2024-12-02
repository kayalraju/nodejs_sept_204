const express = require('express');
const ejs = require('ejs');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors=require('cors');
const connectDb = require('./App/config/db');


dotenv.config();
const app = express();
connectDb()




/**session setup */
app.use(session({
    cookie: { maxAge: 60000 },
    secret: process.env.JWT_SECRET,
    resave:false,
    saveUninitialized:false,
}))
//**cookie setup */
app.use(cookieParser());

app.use(cors());
app.set('view engine','ejs');
app.set('views','views')
app.use(express.static('public'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/uploads',express.static('uploads'));
app.use('/uploads',express.static(__dirname +'/uploads'));


const HomeRouter = require('./App/router/home.router');
const csvRouter=require('./App/router/csvRouter')
const userRouter=require('./App/router/userRouter') 

app.use(HomeRouter);
app.use('/csv',csvRouter);
app.use(userRouter);    
const port =3001;

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})

