const Newsletter = require ("../models/newsletter");

function suscribeEmail ( req, res ){
    const { email } = req.params;
    const newsletter = new Newsletter();
    newsletter.email = email;
    newsletter.save ( ( err, createdNewsletter ) =>{
        if ( err ) {
            res.status(500).send({ message: 'Error en el servidor.' });
        } else {
            if ( !createdNewsletter ) {
                res.status(404).send({ message: 'Error al crear newsletter.' });
            } else {
                res.status(200).send({ message: 'Newsletter creado correctamente.' });
            }
        }
    });
}

module.exports ={
    suscribeEmail
}