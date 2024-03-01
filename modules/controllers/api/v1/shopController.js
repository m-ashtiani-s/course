const Controller = require("../controller");
const { validationResult } = require("express-validator");


module.exports = new (class ShopController extends Controller {
	shop(req,res){
        
        this.model.Users.findById(req.user._id).then(user=>{
            if(!!user){
                
                this.model.Courses.findById(req.body.course).then(course=>{
                    if(!!course){
                        user.courses.push(req.body.course)
                        course.user.push(req.user._id)
                        user.save()
                        course.save()

                    }
                })

            }
            res.json(req.body.course)
        })

    }
})();
