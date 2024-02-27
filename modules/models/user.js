const mongoose=require('mongoose')

const Schema= mongoose.Schema;
const timeStamps=require('mongoose-timestamp')


const UserSchema=new Schema({
    name: {type: String,required:true},
    email: {type: String,required:true},
    password: {type: String,required:true},
    courses: [{rype: Schema.Types.ObjectId,ref: 'Course'}]
})

UserSchem.plugin(timeStamps,{
    createdOn: 'created_at',
    updatedOn: 'updated_at'
})

module.exports = mongoose.model('User', UserSchema)