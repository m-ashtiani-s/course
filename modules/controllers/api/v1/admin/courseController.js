const Controller = require("../../controller");
const { validationResult } = require("express-validator");
const Transform = require("../../../../transform/v1/transform");

module.exports = new (class CourseController extends Controller {
	get(req, res) {
		try {
			this.model.Courses.find({})
				.populate("episodes")
				.exec()
				.then((courses) => {
					if (!!courses) {
						return res.json({
							data: new Transform().courseCollection(courses, req.query.withEpisodes == "true"),
							success: true,
						});
					}
				})
				.catch((err) => {
					res.status(500).json({ data: [{ fields: "courses", message: err.message }], success: false });
				});
		} catch (err) {
			res.status(500).json({ data: [{ fields: "courses", message: err.message }], success: false });
		}
	}

	getOne(req, res) {
		try {
			this.model.Courses.findById(req.params.id)
				.populate("episodes")
				.exec()
				.then((course) => {
					if (!!course) {
						return res.json({
							data: new Transform().courseCollection(course, req.query.withEpisodes == "true"),
							success: true,
						});
					}
				})
				.catch((err) => {
					res.status(500).json({ data: [{ fields: "course", message: err.message }], success: false });
				});
		} catch (err) {
			res.status(500).json({ data: [{ fields: "course", message: err.message }], success: false });
		}
	}

	generate(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorArray = [];
			for (const error of errors.errors) {
				errorArray.push({
					field: error.path,
					message: error.msg,
				});
			}
			return res.status(500).json({
				data: errorArray,
				success: false,
			});
		}

		this.model.Courses.findOne({ title: req.body.title })
			.then((course) => {
				if (course) {
					return res.status(400).json({ data: [{ fields: "course", message: "دوره ای با این عنوان وجود دارد" }], success: false });
				}
				let newCourse = new this.model.Courses({
					title: req.body.title,
					body: req.body.body,
					price: req.body.price,
					image: req.body.image,
				});

				newCourse
					.save()
					.then(() => {
						res.json({ data: [{ fields: "course", message: "دوره با موفقیت ایجاد شد" }], success: true });
					})
					.catch((err) => {
						res.status(500).json({ data: [{ fields: "course", message: err.message }], success: false });
					});
			})
			.catch((err) => {
				res.status(500).json({ data: [{ fields: "course", message: err.message }], success: false });
			});
	}

	edit(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorArray = [];
			for (const error of errors.errors) {
				errorArray.push({
					field: error.path,
					message: error.msg,
				});
			}
			return res.status(500).json({
				data: errorArray,
				success: false,
			});
		}

		const updatedData = {
			title: req.body.title,
			body: req.body.body,
			price: req.body.price,
			image: req.body.image,
		};

		this.model.Courses.findByIdAndUpdate(req.params.id, updatedData)
			.then((course) => {
				if (!!course) {
					res.json("دوره با موفقیت به روز شد");
				} else {
					res.status(400).json({ data: [{ fields: "course", message: "دوره ای با این شناسه وجود ندارد" }], success: false });
				}
			})
			.catch((err) => {
				res.status(500).json({ data: [{ fields: "course", message: err.message }], success: false });
			});
	}

	delete(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorArray = [];
			for (const error of errors.errors) {
				errorArray.push({
					field: error.path,
					message: error.msg,
				});
			}
			return res.status(500).json({
				data: errorArray,
				success: false,
			});
		}
		this.model.Courses.findByIdAndDelete(req.params.id)
			.then((course) => {
				if (!!course) {
					res.json("دوره با موفقیت حذف شد");
				} else {
					res.status(400).json({ data: [{ fields: "course", message: "دوره ای با این شناسه وجود ندارد" }], success: false });
				}
			})
			.catch((err) => {
				res.status(500).json({ data: [{ fields: "course", message: err.message }], success: false });
			});
	}
})();
