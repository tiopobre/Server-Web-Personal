const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const PostSchema = Schema( {
    title       : String,
    description : String,
    date        : Date,
    url:{
        type    : String,
        unique  : true
    }
} );
PostSchema.plugin( mongoosePaginate );

module.exports = mongoose.model( "Post", PostSchema );