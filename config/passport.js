var passport = require('passport');
var User= require("../models/user");
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs')

passport.serializeUser(function(user,done){
done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(null,user);
    });
    });

passport.use('local-signup',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:'true'
},function(req,email,password,done) {
    req.checkBody('email','Invalid email').notEmpty().isEmail();
    req.checkBody('password','Invalid password').notEmpty().isLength({min:5});
    var errors = req.validationErrors();
    if(errors){
        var messages=[];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false, req.flash('error',messages));
    }
    User.findOne({'email':email},function(err,user){
        if(err){
            return done(err);
        }
        if(user){
            console.log('Email is already in use.');
            
            return done(null,false,{message:'Email is already in use.'});
        }
        User.findOne({'username':req.body.username},function(errr,userr){
            if(errr){
                return done(errr);
            }
            if(userr){
                console.log('username is already in use.');
                
                return done(null,false,{message:'username is already in use.'});
            }
        var newUser = new User();
        newUser.email= email;
        newUser.username= req.body.username;
        newUser.publickey= req.body.publickey;
        newUser.password=newUser.encryptPassword(password);
        console.log("new");
        
        newUser.save(function(err,result){
            if(err){
                return done(err);
            }
         console.log("store");
         req.session.user=email;
                return done(null, newUser);
            
        })
    })//
    })
}))    

passport.use('local-signin',new LocalStrategy({
    usernameField:'email1',
    passwordField:'password1',
    passReqToCallback:'true'
},function(req,email1,password1,done) {
    req.checkBody('email1','Invalid email').notEmpty().isEmail();
    req.checkBody('password1','Invalid password').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var messages=[];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false, req.flash('error',messages));
       
        
    }    
    // var newUser = new User();  
    User.findOne({'email':email1},function(err,user){
        
        if(err){
            
            return done(err);
        }
        if(!user){
            return done(null,false,{message:'No user found.'});
        }
        if(!user.validPassword(password1)){      
            // if(! bcrypt.compareSync(password1,user.password)){                                          
            return done(null,false,{message:'Wrong Password.'});
        }

        if(user.publickey != req.body.publickkey){
            return done(null,false,{message:'Wrong privatekey.'});
        }       
       req.session.user=user;
        return done(null,user);
    })
}))