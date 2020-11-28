const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = Schema( {
    idCourse:{
        type    : Number,
        unique  : true,
        required: true
    },
    link    : String,
    cupon   : String,
    price   : Number,
    order   :Number
} );

module.exports = mongoose.model( "Course", CourseSchema );