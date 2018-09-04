var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var game = new Schema({
  team1:{
    type:String,required:true
  },
  team2:{
    type:String,required:true
  },
  selectTeam:{
    type:String,required:true
  }
});

module.exports=mongoose.model('gamedetails',game)