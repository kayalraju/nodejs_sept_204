const express = require('express');
const ejs = require('ejs');



const app = express();

app.set('view engine','ejs');
app.set('views','views')
//app.use(express.static('public'));





const HomeRouter = require('./App/router/home.router');
app.use(HomeRouter);
const port =3001;

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})

