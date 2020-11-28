const Course = require ('../models/course');
const { deleteMenu } = require('./menu');

function addCourse( req, res ){
    const body = req.body;
    const course = new Course(body);
    course.order =1000;  

    course.save( ( err, createdCourse ) =>{
        if ( err ) {
            res.status(400).send({ code: 400, message: 'Error en el servidor.' });
        } else {    
            if ( !createdCourse ) {
                res.status(400).send({ message: 'Error al crear curso.' });    
            } else {
                res.status(200).send({ message: 'Curso creado correctamente.' }); 
            }
        }
    } );
}

function getCourses( req, res ){
    Course.find ().
        sort({ order : "asc" })
        .exec( ( error, coursesStored ) =>{
            if ( error ) {
                res.status(500).send({ message: 'Error en el servido r.' });
            } else {
                if ( !coursesStored ) {
                    res.status(404).send({ message: 'No se han encontrado cursos.' });
                } else {
                    res.status(200).send({ courses : coursesStored });
                }
            }
        } );
}

function deleteCourse( req, res ){
    const { id } = req.params;
    Course.findByIdAndDelete( id, ( error, deletedCourse ) =>{
        if ( error ) {
            res.status(500).send({ code : 500, message: 'Error del servidor.'});
        } else {
            if ( !deletedCourse ) {
                res.status(404).send({ code : 404, message: 'Curso no encontrado .'});
            } else {
                res.status(200).send({ code : 200, message: 'Curso eliminado.'});
            }
        }
    } );
}

function updateCourse( req, res ){
    const { id } = req.params;
    const  courseData  = req.body;
    Course.findByIdAndUpdate( id, courseData, ( error, updatedCourse ) =>{
        if ( error ) {
            res.status(500).send({ message: 'Error en el servidor.' });
        } else {
            if ( !updatedCourse ) {
                res.status(404).send({ message: 'No se encontro el Curso.' });
            } else {
                res.status(404).send({ message: 'Curso acutalizado.' });
            }
        }
    }  );
}

module.exports = {
    addCourse,
    getCourses,
    deleteCourse,
    updateCourse
}