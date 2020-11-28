const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const UserSchema= Schema ({
   name     : String,
   lastname : String,
   password : String,
   role     : String,
   active   : Boolean, 
   avatar   : String,  
   email    :{
       type     :String,
       unique   : true
   }

});

module.exports = mongoose.model( "User", UserSchema );
