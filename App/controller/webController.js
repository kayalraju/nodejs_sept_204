const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
class webController {
    //auth check
    async AuthUser(req, res, next) {
        if (req.user) {
            console.log('after auth check', req.user);
            next();
        } else {
            console.log('error while auth check');
            res.redirect('/login');
        }

    }

    async register(req, res) {
        res.render('register', {
            title: "register page"
        });
    }

    async login(req, res) {
        res.render('login', {
            title: "register page"
        });
    }
    async dashboard(req, res) {
        res.render('dashboard', {
            title: "register page",
            data: req.user
        });
    }



    async registerCreatre(req, res) {

        try {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
                first_school: req.body.first_school
            })
            const result = await user.save();
            if (result) {
                //req.flash('success','you are register successfully');
                res.redirect('/login');
            } else {
                //req.flash('error','something went wrong');
                res.redirect('/register');
            }
        } catch (err) {
            console.log(err);
        }

    }


    async loginCreatre(req, res) {

        try {
            const { email, password } = req.body;

            if (!email && password) {
                console.log("all input are required");
                res.redirect('/login');
            }

            const user = await User.findOne({ email });
            // if(!user){
            //     console.log("user not found");
            //     res.redirect('/login');
            // }
            if (user && (bcrypt.compare(password, user.password))) {

                const token = jwt.sign({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });

                if (token) {
                    res.cookie("userToken", token, { httpOnly: true });
                    return res.redirect('/dashboard');
                } else {
                    console.log("token not created");

                }
            }

            else {
                console.log("login failed");
                return res.redirect('/login');
            }
        }

        catch (err) {
            console.log(err);


        }
    }

    async logout(req, res) {
        res.clearCookie('userToken');
        res.redirect('/login');
    }

}
module.exports = new webController();