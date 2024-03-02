const { json } = require("body-parser");
const Controller = require("../../controller");
const { validationResult } = require("express-validator");
const Transform = require("../../../../transform/v1/transform");

module.exports = new (class EpisodeController extends Controller {
	get(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		this.model.Episodes.find({})
			.populate("course")
			.exec()
			.then((episodes) => {
				return res.json({
					data: new Transform().episodeCollection(episodes, req.query.withCourse == "true"),
					success: true,
				});
			})
			.catch((err) => {
				res.status(500).json({ error: err.message });
			});
	}

	getOne(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		this.model.Episodes.findById(req.params.id)
			.populate("course")
			.exec()
			.then((episode) => {
				if (!!episode) {
					return res.json({
						data: new Transform().episodeCollection(episode, req.query.withCourse == "true"),
						success: true,
					});
				} else {
					res.status(500).json({ data: [{ fields: "episode", message: "اپیزودی یافت نشد" }], success: false });
				}
			})
			.catch((err) => {
				res.status(500).json({ data: [{ fields: "episode", message: err.message }], success: false });
			});
	}

	generate(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		this.model.Courses.findById(req.body.course_id)
			.then((course) => {
				let episode = new this.model.Episodes({
					course: course._id,
					title: req.body.title,
					body: req.body.body,
					videoUrl: req.body.videoUrl,
					number: req.body.number,
				});

				episode
					.save()
					.then(() => {
						course.episodes.push(episode._id);
						course.save();
						res.json({ data: [{ fields: "episode", message: "اپیزود با موفقیت ایجاد شد" }], success: true });
					})
					.catch((err) => {
						res.status(500).json({ data: [{ fields: "episode", message: "اپیزود ایجاد نشد" }], success: false });
					});
			})
			.catch((err) => {
				res.status(500).json({ data: [{ fields: "episode", message: err.message }], success: false });
			});
	}

	edit(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		const episodeUpdated = {
			title: req.body.title,
			body: req.body.body,
			number: req.body.number,
			videoUrl: req.body.videoUrl,
		};
		this.model.Episodes.findByIdAndUpdate(req.params.id, episodeUpdated)
			.then((episode) => {
				if (!!episode) {
					return res.json({ data: [{ fields: "episode", message: "اپیزود با موفقیت به روز شد" }], success: true });
				} else {
					res.status(400).json({ data: [{ fields: "episode", message: "اپیزود با این شناسه وجود ندارد" }], success: false });
				}
			})
			.catch((err) => {
				res.status(500).json({ data: [{ fields: "episode", message: err.message }], success: false });
			});
	}

	delete(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(500).json(errors);
		}
		this.model.Episodes.findById(req.params.id)
			.populate("course")
			.then((episode) => {
				if (!!episode) {
					let course = episode.course;
					const pos = course.episodes.indexOf(req.params.id);
					course.episodes.splice(pos, 1);
					course.save();
					this.model.Episodes.findByIdAndDelete(req.params.id)
						.then(() => {
							return res.json({ data: [{ fields: "episode", message: "اپیزود با موفقیت حذف شد" }], success: true });
						})
						.catch((err) => {
							res.status(500).json({ data: [{ fields: "episode", message: err.message }], success: false });
						});
				} else {
					res.status(400).json({ data: [{ fields: "episode", message: "اپیزود با این شناسه وجود ندارد" }], success: false });
				}
			})
			.catch((err) => {
				res.status(500).json({ data: [{ fields: "episode", message: err.message }], success: false });
			});
	}
})();
