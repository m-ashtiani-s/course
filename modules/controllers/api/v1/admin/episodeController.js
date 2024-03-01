const { json } = require("body-parser");
const Controller = require("../../controller");
const { validationResult } = require("express-validator");
const Transform = require("../../../../transform/v1/transform");
const episode = require("../../../../models/episode");

module.exports = new (class EpisodeController extends Controller {
	get(req, res) {
		try {
			this.model.Episodes.find({})
				.then((episodes) => {
					return res.json({
						data: new Transform().episodeCollection(episodes),
						success: true,
					});
				})
				.catch((err) => {
					res.status(500).json({ error: err.message });
				});
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	}

	getOne(req, res) {
		try {
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
					message: errorArray,
				});
			}
			this.model.Episodes.findById(req.params.id)
				.then((episode) => {
					if (!!episode) {
						return res.json({
							data: new Transform().episodeSingle(episode),
							success: true,
						});
					} else {
						res.status(404).json("episode not found");
					}
				})
				.catch((err) => {
					res.status(500).json({ error: err.message });
				});
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	}

	generate(req, res) {
		try {
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
					message: errorArray,
				});
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
							res.json("episode created");
						})
						.catch((err) => {
							throw err;
						});
				})
				.catch((err) => {
					res.status(500).json({ error: err.message });
				});
		} catch {
			res.status(500).json({ error: err.message });
		}
	}

	edit(req, res) {
		try {
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
					message: errorArray,
				});
			}
			this.model.Episodes.findByIdAndUpdate(req.params.id, { title: req.body.title })
				.then((episode) => {
					if (!episode) {
						return res.status(404).json("episode not found");
					}
					res.json("updated success");
				})
				.catch((err) => {
					res.status(500).json({ error: err.message });
				});
		} catch {
			res.status(500).json({ error: err.message });
		}
	}

	delete(req, res) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(500).json(errors);
			}
			this.model.Episodes.findById(req.params.id)
				.populate("course")
				.then((episode) => {
					if (!episode) {
						return res.status(404).json("episode not found");
					}
					let course = episode.course;
					const pos = course.episodes.indexOf(req.params.id);
					course.episodes.splice(pos, 1);
					course.save()
					this.model.Episodes.findByIdAndDelete(req.params.id).then((cc)=>{
                        res.json("remove success");
                    }).catch((err) => {
                        res.status(500).json({ error: err.message });
                    });
					
				})
				.catch((err) => {
					res.status(500).json({ error: err.message });
				});
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	}
})();
