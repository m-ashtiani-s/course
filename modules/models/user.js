const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const Schema= mongoose.Schema;
const timeStamps=require('mongoose-timestamp')


const UserSchema=new Schema({
    name: {type: String,required:true},
    email : { type : String , required : true , unique : true} ,
    password: {type: String,required:true},
    courses: [{type: Schema.Types.ObjectId,ref: 'Course'}]
})

UserSchema.pre('save' , function(next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
})
UserSchema.plugin(timeStamps,{
    createdOn: 'created_at',
    updatedOn: 'updated_at'
})

module.exports = mongoose.model('User', UserSchema)