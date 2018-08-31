var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport')
var User = require('../models/user');

var csrfProtection = csrf();
router.use(csrfProtection);

var name;

router.get('/', function(req, res, next) {
  // if(!req.session.user){
  //   next(err);
  // }
  res.redirect('/user/signin');
});

router.get('/user/signup',function(req,res,next){
  var message = req.flash('error')
  // var hasErrors;
res.render('user/signup', {csrfToken: req.csrfToken(),message:message,hasErrors: message.length > 0});
})

router.post('/user/signup',passport.authenticate('local-signup',{
failureRedirect: '/user/signup',
failureFlash: true }),function(req,res){
  name = req.body.email
console.log("hello"+name);

  res.redirect('/production')
}
);

router.get('/user/signin',function(req,res){
  var message = req.flash('error')
res.render('user/signin', {csrfToken: req.csrfToken(),message:message,hasErrors: message.length > 0});
})


router.post('/user/signin',passport.authenticate('local-signin',{
failureRedirect: '/user/signin',
failureFlash: true }),function(req,res){
  name = req.body.email1
console.log("hello"+name);

  res.redirect('/production')
}
)


router.get('/production',function(req,res,next){
    if(!req.session.user){
    next(err);
  }
  User.findOne({'email':name},function(err,user){
        
    if(err){
        
      next(err);
    }
    if(user){
        var usernam=user.username;
        res.render('user/production/index',{usernam : usernam})
    }
  })
    
})

router.get('/cricket',function(req,res){
  res.render('user/production/cricket')
})
router.get('/football',function(req,res){
  res.render('user/production/football')
})
router.get('/profile',function(req,res){
  console.log("profile")
  res.render('user/production/profile')
})
router.get('/brokerpage',function(req,res){
  res.render('user/production/brokerpage')
})
router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect('user/signin')
})

module.exports = router;
