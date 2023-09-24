// importing modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');
  
/* 

Note: Here in this schema 
we did not add any field for password 
unlike we do normally. 
This is because passport-local-mongoose doesn’t need it. 
Here we did not add any methods to hash our password or to compare our 
passwords as we do normally for authentication 
because passport-local-mongoose will do all that for us. 

*/

const UserSchema = new Schema({   
    email: {type: String, required:true, unique:true},
    username : {type: String, unique: true, required:true},
});
  
// plugin for passport-local-mongoose
UserSchema.plugin(passportLocalMongoose);
  
// export userschema
module.exports = mongoose.model("User", UserSchema);