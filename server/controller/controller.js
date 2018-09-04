const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

//USER ROUTER FOR SPECIFIC ROUTES
const router = express.Router();

//CREATE A MONGOOSE,USER OBJ
var {mongoose} = require('.././db/mongoose');
var {User} = require('.././models/user');
var {authenticate} = require('.././middleware/authenticate');
var {authenticateCookie} = require('.././middleware/authenticateCookie');
var {loggedInCheck} = require('.././middleware/loggedInCheck');
const {UserChats} = require('./../models/userchat');

var urlEncodedParser = bodyParser.urlencoded({extended: false});
const cookieParser = require('cookie-parser');

router.use(cookieParser());


//ACCESS THE MIDDLEWARE
router.use(bodyParser.json());




    //RENDER PAGES
router.get('/login',loggedInCheck,(req, res) =>{
  res.render("login",{});
})

router.get('/',loggedInCheck,(req, res) =>{
  res.render("login",{});
})



//RENDER PAGES
// router.get('/user/chat',(req, res) =>{
// res.render("chat");
// })

// router.get('/user/joingroup',(req, res) =>{
//   res.render("joingroup",{});
// })

//USER SCHEMA
router.post('/users', urlEncodedParser, (req, res) =>{
    //PICK ONLY EMAIL AND PASSWORD FROM THE REQ SINCE REST ARE NOT MODIFIABLE BY USER
    var body = _.pick(req.body, ['username', 'email', 'password']);
//    var user = new User({
//        email: body.email,
//        password: body.password
//    });
    var user = new User(body);

    user.save().then(() =>{
        //RETURN A PROMISE AND TOKEN IS OBTAINED
        return user.generateAuthToken();
//        res.status(200).send(user);
    }).then((token) =>{
        //HEADER (KEY:VALUE)
        //X-AUTH MEANS WE ARE CREATING A CUSTOM HEADER
        res.header('x-auth', token).send(user);

    }).catch((error) =>{
        res.status(400).send(error);

    });

    var emptyArray = [];
    var userChats = new UserChats({userId: user._id, userName: user.username, chatIds: emptyArray});

    userChats.save().then(() =>{
      console.log('user saved');
    }).catch((error) =>{
        console.log(error);
    });

});



//CREATE PRIVATE ROUTE
//WITH AUTH
router.get('/users/me', authenticateCookie, (req, res) =>{
   //THIS CODE WILL GO INTO THE MIDDLEWARE
//    //GET THE AUTH TOKEN FROM THE REQ
//    var token = req.header('x-auth');
//    //STATICS MODEL METHOD TO GET THE USER WITH THE TOKEN
//    User.findByToken(token).then((user) =>{
//        if(!user){
//            //THERE IS A VALID TOKEN BY QUERY CANNOT FIND THE USER
//            //CAN ALSO SEND RES.STATUS(401).SEND()
//            return Promise.reject();
//        }
//        res.status(200).send(user);
//    }).catch(() => {
//        //401 MEANS AUTH IS REQUIRED
//        res.status(401).send();
//    });

    res.status(200).send(req.user);
});

//LOGIN USER
router.post('/users/login', urlEncodedParser, (req, res) =>{

    var body = _.pick(req.body, ['username','email', 'password']);

    console.log('LOGIN API OUTOUT:');
    console.log(body);

    //CALL THE MODEL METHOD
    var usernameOrEmail;
    if (body.email) {
        usernameOrEmail = body.email;
    } else if (body.username){
        usernameOrEmail = body.username;
    }

    User.findByCredentials(usernameOrEmail, body.password).then((user) =>{
        return user.generateAuthToken().then((token) =>{
            res.header('x-auth', token).send(user);
        });
    }).catch((err) =>{
        res.status(400).send(err);
    });

});


//LOGOUT USER
router.delete('/api/logout', authenticateCookie,  (req, res) =>{
    req.user.removeToken(req.token).then(() =>{
       res.status(200)
       res.clearCookie('x-auth')
       // res.redirect('/')
       res.send();
    }, () =>{
        res.sendStatus(400).send();
    });
});



module.exports = router;
