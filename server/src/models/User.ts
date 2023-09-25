// importing modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
  
/* 

Note: Here in this schema 
we did not add any field for password 
unlike we do normally. 
This is because passport-local-mongoose doesn’t need it. 
Here we did not add any methods to hash our password or to compare our 
passwords as we do normally for authentication 
because passport-local-mongoose will do all that for us. 

*/

export const ROLES = {
    Admin: "admin",
    Moderator: "moderator",
    Customer: "customer",
    Guest: "guest"
}

const UserSchema = new Schema({   
    email: {type: String, required:true, unique:true},
    username : {type: String, unique: true, required:true},
    hash: {type: String, required:true},
    salt: {type: String, required:true},
    role: {type: String, enum: Object.values(ROLES), default:ROLES.Guest},
    lastLogin: {type: Date, default:Date.now}
}, { timestamps:true });

// export userschema
module.exports = mongoose.model("User", UserSchema);