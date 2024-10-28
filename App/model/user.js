const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png'
    },
    first_school: {
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'user'
    }
},{
    timestamps: true
});

const userModel=mongoose.model('user',userSchema);
module.exports=userModel;