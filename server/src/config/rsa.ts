
/* CONFIG TO PROPERLY SETUP RSA KEYS 

   Author: Pedro Henrique Rincon Santos
*/

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Could later replace this with a search algorithm... seems overkill though

/* Should improve the logic later to:

   1. Search for RSA key file location using search algorithm
   2. Search for .env file location using search algorithm
   3. Check if RSA key locations are correct
   4. Possibly read some variables here (like placeholder) from a cfg file

   Other:
   - Have a function to reset the files to the placeholder
   - Have a function to generate new key pair automatically if no key pairs are found in search

 */

export function setupRSAKeyPaths() {

    console.log("* Setting up RSA_KEY paths in .env ...")

    const envFilePath = path.resolve(__dirname, '../../.env');

    console.log("** env file path: " + envFilePath);
    const envFile = fs.readFileSync(envFilePath, 'utf8');

    // RSA 
    const rsa_pub_path = '../../id_rsa_pub.pem'
    const rsa_priv_path = '../../id_rsa_priv.pem'
    console.log("** RSA key paths: " + rsa_pub_path + '  +  ' + rsa_priv_path)

    // Thing to find and replace
    const rsa_pub_env = 'pub_placeholder'
    const rsa_priv_env = 'priv_placeholder'

    var updatedEnv = envFile.replace(rsa_pub_env, rsa_pub_path);
    updatedEnv = updatedEnv.replace(rsa_priv_env, rsa_priv_path);

    fs.writeFileSync(envFilePath, updatedEnv);
}

function genKeyPair() {
    
    // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // bits - standard for RSA keys
        publicKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1" 
            format: 'pem' // Most common formatting choice
        },
        privateKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1"
            format: 'pem' // Most common formatting choice
        }
    });

    // Create the public key file
    fs.writeFileSync(__dirname + '/id_rsa_pub.pem', keyPair.publicKey); 
    
    // Create the private key file
    fs.writeFileSync(__dirname + '/id_rsa_priv.pem', keyPair.privateKey);

}

module.exports = { setupRSAKeyPaths, genKeyPair };