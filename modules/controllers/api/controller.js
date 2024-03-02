const Courses = require("../../models/course");
const Episodes = require("../../models/episode");
const Users = require("../../models/user");

module.exports = class Controller {
	constructor() {
		this.model = { Courses, Episodes, Users };
	}

	showValidationErrors(res,errors) {
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
	}
};
