
const Controller = require("../../controller");

module.exports = new class CourseController extends Controller {
    
	async get(req, res) {
		try {
			const courses = await this.model.Courses.find({});
			res.json(courses);
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	}

	async getOne(req, res) {
		try {
			const course = await this.model.Courses.findById(req.params.id);
			res.json(course);
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	}

	generate(req, res) {
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
	}

    edit(req, res) {
        this.model.Courses.findByIdAndUpdate(req.params.id, { title: "course three" })
            .then(() => {
                res.json("update success");
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }

    delete(req, res) {
        this.model.Courses.findByIdAndDelete(req.params.id)
            .then(() => {
                res.json("remove success");
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
};
