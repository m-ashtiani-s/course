const Controller = require("../../controller");
const { validationResult } = require("express-validator");

const Transform= require('../../../../transform/v1/transform')

module.exports = new (class CourseController extends Controller {
	async get(req, res) {
		try {
			const courses = await this.model.Courses.find({});
			console.log("courses");
			if(courses) {
                return res.json({
                    data : new Transform().courseCollection(courses),
                    success : true
                });
            }
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	}

	async getOne(req, res) {
		try {
			const course = await this.model.Courses.findById(req.params.id);
			if (!!course) {
				res.json(course);
			} else {
				res.status(500).json("yokhdi");
			}
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	}

	generate(req, res) {
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			let newCourse = new this.model.Courses({
				title: req.body.title,
				body: req.body.body,
				price: req.body.price,
				image: req.body.image,
			});

			newCourse
				.save()
				.then(() => {
					res.json("created");
				})
				.catch((err) => {
					throw err;
				});
		} else {
			const errorArray = [];
			for (const error of errors.errors) {
				errorArray.push({
					field: error.path,
					message: error.msg,
				});
			}
			res.status(500).json({
				message: errorArray,
			});
		}
	}

	edit(req, res) {
		this.model.Courses.findByIdAndUpdate(req.params.id, { title: req.body.title })
			.then(() => {
				res.json("update success");
			})
			.catch((err) => {
				res.status(500).json({ error: err.message });
			});
	}

	delete(req, res) {
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			this.model.Courses.findByIdAndDelete(req.params.id)
				.then(() => {
					res.json("remove success");
				})
				.catch((err) => {
					res.status(500).json({ error: err.message });
				});
		} else {
			res.status(500).json(errors);
		}
	}
})();
