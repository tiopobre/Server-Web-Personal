const fs = require("fs");
const path = require('path');

const bcrypt =  require("bcrypt");
const User  = require("../models/user");
const jwt =  require("../services/jwt");
const { param } = require("../routers/user");
const { exists } = require("../models/user");


function signUp( req, res ){
    const user = new User();
    const { name, lastname, email, password, repeatPassword } = req.body;
    user.name       = name;
    user.lastname    = lastname;
    user.email      = email.toLowerCase();
    user.role       = "admin";
    user.active      = false;

    if ( !password || !repeatPassword ){
        res.status(404).send({ message: "las contraseñas son obligatorias" });
    }else{
        if( password != repeatPassword ){
            res.status(404).send({ message: "las contraseñas no son iguales" });
        }else{
            bcrypt.hash(password, 10, function(err, hash) {
                // Store hash in your password DB.
                if(err){
                    res.status(500).send({ message: "error al encriptar la contraseña" });
                }else{
                    user.password = hash;
                    // guardar en la BD
                    user.save( ( err, userStored) => {
                        if (err) {
                            res.status(500).send({message: "Error el Usuario ya esta registrado" });
                        }else{
                            if ( !userStored ) {
                                res.status(404).send({message: "Error al crear usuario" });
                            }else{
                                res.status(200).send({ user: userStored });
                            }
                        }
                    })
                }
            });
        }
    }
}

function signIn( req, res ){
    const { email, password } =  req.body;
    const emailLower =  email.toLowerCase();

    User.findOne ( {email: emailLower}, ( err, userStored ) => {
        if (err) {
            res.status(500).send( {message: "error del servidor."});
        }else{
            if ( !userStored ) { //si no se encuentra usuario
                res.status(404).send( {message: "usuario no hencontrado."} );
            }else{
                bcrypt.compare( password, userStored.password, ( err, check )=>{
                    if (err) { // si ocurre erro del servidor
                        res.status(500).send( {message:'error del servidor.'} );
                    }else if ( !check ){
                        res.status(404).send( {message:'La contraseña no es correcta.'} );
                    } else { 
                        if ( !userStored.active ) {  // si el usuario no esta activo
                            res.status(200).send( {message:'El usuario no esta activo.'} );
                        }else{
                            res.status(200).send( { 
                                accessToken  : jwt.createAccessToken( userStored ),
                                refreshToken: jwt.createRefreshToken( userStored )
                             } );
                        }
                    }
                } );
            }
        }
    });
}

function getUsers ( req, res ){
    User.find().then(users =>{
        if ( !users ) {
            res.status(404).send({ message: "no se han encontrado usuarios"});
        } else {
            res.status(200).send({ users });
        }
    })
}

function getUsersActive ( req, res ){
    const query = req.query;
    User.find({ active: query.active }).then(users =>{
        if ( !users ) {
            res.status(404).send({ message: "no se han encontrado usuarios"});
        } else {
            res.status(200).send({ users });
        }
    })
}

function uploadAvatar ( req, res ){
    const params = req.params;

   User.findById({ _id: params.id }, (err, userData ) => {
        if ( err ) {
            res.status(500).send({ message: 'Error en el servidor' });
        }else{
            if ( !userData ) {
                res.status(404).send({ message: 'No se ha encontrado el usuario' });
            }else{
                let user = userData;
                if ( req.files ) {
                    let filepath = req.files.avatar.path;
                    let fileSplit = filepath.split('\\');
                    let fileName =  fileSplit[2];
                    let extSplit = fileName.split(".");
                    let fileExt = extSplit[1];
                    if ( fileExt !== 'png' && fileExt !== 'jpg' ) {
                        res.status(400).send({ message : 'extension de imagen invalida (debe ser .jpg o .png)'});
                    }else{
                        user.avatar = fileName;
                        User.findByIdAndUpdate( { _id: params.id}, user,( err, userResult ) =>{
                            if( err ){
                                res.status(500).send({ message : 'Error del servidor'});
                            }else{
                                if( !userResult ){
                                    res.status(404).send({ message : 'Nose ha encontrado usuario'});
                                }else{
                                    res.status(200).send({ avatarName: fileName});
                                }
                            }
    
                        } );
                    }
                }
            }
        }
   });
}

function getAvatar ( req, res ){
    const avatarName = req.params.avatarName;
    const filePath = "./uploads/avatar/"+avatarName;

    fs.exists( filePath, exists => {
        if( !exists ){
            res.status(404).send({ message: "El avatar que buscas no existe" });
        }else{
            res.sendFile( path.resolve( filePath ) );
        }
    });
}

async function updateUser ( req, res ){
    let userData = req.body;
    userData.email = req.body.email.toLowerCase();
    const params = req.params;

    if ( userData.password ) {
        try {
            await bcrypt.hash(userData.password, 10, (err, hash) => {
                if ( err ) {
                    res.status(500).sen({ message: 'error al encriptar la contraseña' });
                } else {
                    userData.password = hash;
                }
            })
        }catch (err){
            res.status(500).sen({ message: 'error al encriptar la contraseña' });
        }
    };
    User.findByIdAndUpdate({ _id: params.id }, userData, ( err, userUpdate ) =>{
       if ( err ) {
        res.status(500).send({ message: 'Error del servidor.' })
       }else{
           if ( !userUpdate ) {
                res.status(404).send({ message: 'No se ha encontrado el usuario.' });
           } else {
            res.status(200).send({ message: 'usuario actualizado correctamenre.' });
           }
       }
    });
}

function activateUser ( req, res ){
    const { id } = req.params;
    const { active } = req.body;
    
    User.findByIdAndUpdate( id, { active }, ( err, userStored )=>{
        if ( err ) {
            res.status(500).send({ message: 'error de servidor' });
        } else {
            if ( !userStored ) {
                res.status(404).send({ message: 'no se ha encontrado el usuario' });
            } else {
                if ( active === true) {
                    res.status(200).send({ message: 'ussuario activado' });
                } else {
                    res.status(200).send({ message: 'ussuario desactivado' });
                }
            }
        }
    } );
}

function deleteUser ( req, res ){
    const { id } = req.params;
    
    User.findByIdAndRemove( id, ( err, userDeleated ) => {
        if ( err ) {
            res.status(500).send({ message: 'error de servidor' });
        } else {
            if ( userDeleated ) {
                res.status(404).send({ message: 'no se ha encontrado el usuario' });
            } else {
                res.status(200).send({ message: 'ussuario eliminado correctamente!' });
            }
        }
    });

    console.log ('delete user... ');
}


function signUpAdmin( req, res ){
    const user = new User();
    const { name, lastname, email, role, password } = req.body;
    user.name       = name;
    user.lastname   = lastname;
    user.email      = email.toLowerCase();
    user.role       = role;
    user.active     = true;

    if ( !password ) {
        res.status(500).send({ message: "La contraseña es obligatoria" });
    }else{
        bcrypt.hash(password, 10, function(err, hash) {
            if(err){
                res.status(500).send({ message: "error al encriptar la contraseña" });
            }else{
                user.password = hash;
                // Guardar usuario en BD
                user.save( ( err, userStored) => {
                    if (err) {
                        res.status(500).send({message: "Error el Usuario ya esta registrado" });
                    }else{
                        if ( !userStored ) {
                            res.status(500).send({message: "Error al crear usuario" });
                        }else{
                            res.status(200).send({ message: "Usuario creado correctamente" });
                        }
                    }
                });
            }
        });
    }

}

module.exports ={
    signUp, 
    signIn,
    getUsers,
    getUsersActive,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser,
    deleteUser,
    signUpAdmin
}