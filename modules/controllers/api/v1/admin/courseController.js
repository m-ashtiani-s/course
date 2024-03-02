const Controller = require("../../controller");
const { validationResult } = require("express-validator");
const Transform = require("../../../../transform/v1/transform");

module.exports = new (class CourseController extends Controller {
	get(req, res) {
		const paginationSetup = {
			limit: req.query.limit || 10,
			page: req.query.page || 1,
		};
		this.model.Courses.paginate({}, { limit: paginationSetup.limit, page: paginationSetup.page, populate: "episodes" })
			.then((courses) => {
				if (!!courses) {
					return res.json({
						data: new Transform().paginate(req,courses),
						success: true,
					});
				}
			})
			.catch((err) => {
				res.status(500).json({ data: [{ fields: "courses", message: err.message }], success: false });
			});
	}

	getOne(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
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
	}

	generate(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
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
			return this.showValidationErrors(res, errors);
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
					return res.json({ data: [{ fields: "course", message: "دوره با موفقیت به روز شد" }], success: true });
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
			return this.showValidationErrors(res, errors);
		}
		this.model.Courses.findByIdAndDelete(req.params.id)
			.then((course) => {
				if (!!course) {
					this.model.Episodes.deleteMany({ course: course._id }).then(() => {
						return res.json({ data: [{ fields: "course", message: "دوره با موفقیت حذف شد" }], success: true });
					});
				} else {
					res.status(400).json({ data: [{ fields: "course", message: "دوره ای با این شناسه وجود ندارد" }], success: false });
				}
			})
			.catch((err) => {
				res.status(500).json({ data: [{ fields: "course", message: err.message }], success: false });
			});
	}
})();
