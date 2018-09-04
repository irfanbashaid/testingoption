var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var user = new Schema({
  email:{type:String,required:true},
  username:{type:String,required:true},
  publickey:{type:String,required:true},
  password:{type:String,required:true}
});

user.methods.encryptPassword = function(password){
return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
};

user.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
    };
   
    

module.exports=mongoose.model('userdetails',user)