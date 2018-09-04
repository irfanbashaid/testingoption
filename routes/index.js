var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport')
var User = require('../models/user');
var Game = require('../models/game')
// var test = require('../public/javascripts/app')
var csrfProtection = csrf();
router.use(csrfProtection);

var name;
var privatekey;
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
  name = req.body.email;
  privatekey = req.body.publickey;
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
  privatekey = req.body.public_kkey;
console.log("hello"+name);

  res.redirect('/production');
}
)


router.get('/user/password',function(req,res){
  // console.log("hlo");
  // var message = req.flash('error')
res.render('user/password',{csrfToken: req.csrfToken()});
})

router.post('/user/forgotpassword',function(req,res,next){
   User.findOne({"email": req.body.emailch},function(err,user){
    if(err){

      next(err);
    }
    if(!user){

     next(err)
    }
    if(user.publickey != req.body.publickkey){
      next(err);
    }
  //   if(!user.validPassword(req.body.passwordold)){

  //   next(err);
  // }
  var _User = new User();
  User.findOneAndUpdate({"email":user.email},{$set:{"password":_User.encryptPassword(req.body.passwordnew)}},function(errr,userr){
    if(errr){

      next(err);
    }
  console.log(userr);
  res.redirect("/user/signin");
  })

})
  })



  router.post('/user/changepassword',function(req,res,next){
    console.log("enter");
    User.findOne({"email":name},function(err,user){
      if(err){
        console.log("enter1");
        next(err);
      }
      if(!user){
        console.log("enter2");
        next(err);
      }
      if(user.publickey != req.body.publickkey){
        console.log(user.publickey)
        console.log(req.body.publickkey)
        console.log("enter3");
        next(err);
      }
var _user = new User();
      User.findOneAndUpdate({"email":user.email},{$set:{"password":_user.encryptPassword(req.body.passwordnew)}},function(errr,userr){
        if(errr){
    
          next(errr);
        }
      console.log(userr);      
      })
    })
    res.redirect("/user/signin");
  })


router.get('/production',function(req,res,next){
    if(!req.session.user){
    res.redirect('/user/signin');
  }
  User.findOne({'email':name},function(err,user){
        
    if(err){
        
      next(err);
    }
    if(user){
        var usernam=user.username;
        res.render('user/production/index',{usernam : usernam,privatekey:privatekey})
    }
  })
  
})

router.get('/deposit_withdraw',function(req,res){
  res.render('user/production/deposit_withdraw')
})
router.get('/overall_bets',function(req,res){
  res.render('user/production/overall_bets')
})
router.get('/my_bets',function(req,res){
  res.render('user/production/my_bets')
})
// 
// router.get('/password',function(req,res){
//   res.render('/user/password')
// })

router.get('/change_ownership',function(req,res){
  res.render('user/production/change_ownership')
})

router.get('/create_option',function(req,res){
  res.render('user/production/create_option')
})

router.get('/set_result_page',function(req,res){
  res.render('user/production/set_result_page')
})

router.post('/user/brokerpage',function(req,res){
var Teams = new Game();
Teams.team1 = req.body.Team1;
Teams.team2 = req.body.Team2;
Teams.selectTeam = req.body.Selected;
Teams.save(function(err,user){
  if(err){
    next(err);    
  }
  res.redirect('/brokerpage');
  // return user
})

})



router.get('/cricket',function(req,res){
  res.render('user/production/cricket')
})
router.get('/football',function(req,res){
  res.render('user/production/football')
})
router.get('/profile',function(req,res){
  User.findOne({"email":name},function(err,data){  
    if(err){
      next(err);
    }
  res.render('user/production/profile',{csrfToken: req.csrfToken(),emailid:data.email,username:data.username,publickey:data.publickey})
})
})

router.get('/brokerpage',function(req,res){
  res.render('user/production/brokerpage',{csrfToken: req.csrfToken()})
})
router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect('user/signin')
})

module.exports = router;
