const ffirebase = require('firebase/app');


const firebase = require('firebase/auth');
ffirebase.initializeApp(config);
exports.login = ((req, rsp)=>{
    const email = "hamzarehman033@gmail.com";
    const password = "password";
    const key = "req.body.key";
    const _key = '_my_key_';
    let token = '';
    if(true){           
    firebase.signInWithEmailAndPassword(firebase.getAuth(),   email,password).then((user)=>{
        console.log(user);
//The promise sends me a user object, now I get the token, and refresh it by sending true (obviously another promise)            
user.getIdToken(true).then((token)=>{
    console.log(token);
            }).catch((err)=>{
                console.log(err);
            });
        }).catch((err)=>{
            console.log(err);
        });
    } else {
        console.log(rsp);
    }
});