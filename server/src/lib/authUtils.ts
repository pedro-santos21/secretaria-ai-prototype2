const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const pathToKey = path.join(__dirname, '..', '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

/*----- UTIL FUNCTIONS----

  A lot from https://youtu.be/Ne0tLHm1juE => https://github.com/zachgoll/express-jwt-authentication-starter/blob/final/lib/utils.js

  1. genPassword: Generates a salt and a hash for a password.
  2. validPassword: Compares password to hash.
  3. issueJWT: Issues new JWT

*/

interface SaltHash {
    salt: string;
    hash: string;
}

/**
 * 
 * @param {*} password - The password string that the user inputs to the password field in the register form
 * 
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 * 
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
export function genPassword(password: string) : SaltHash {
    var salt:string = crypto.randomBytes(32).toString('hex');
    var genHash:string = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')

    return {
        salt: salt,
        hash: genHash
    };
}

/**
 * 
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 * 
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
export function validatePassword(password:string, hash:string, salt:string) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

const defaultJWTExpiresIn: string = '1d'

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 * @param {*} expiresIn - In how much time the issued token expires (example: '1d'), the default is defaultJWTExpiresIn
 */
export function issueJWT(user: any, expiresIn: string = defaultJWTExpiresIn) { 
    const _id = user._id;
    const payload = {
      sub: _id,
      iat: Date.now()
    };
  
    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
  
    return {
      token: "Bearer " + signedToken,
      expires: expiresIn
    }
}

const privileged_roles:any = process.env.PRIVILEGED_ROLES;

// Middleware function to check user role
export const checkIfPrivilegedRole = (user:any) => {
  const userRole = user.role;

  console.log("@ Checking if user has privileged role...")
  
  if (Object.values(privileged_roles).includes(userRole)) {
    console.log("@ User is privileged!")
    return true;
  } else {
    console.log("@ User is not privileged!")
    return false;
  }
};

module.exports = {
    genPassword,
    validatePassword,
    issueJWT,
    checkIfPrivilegedRole
};