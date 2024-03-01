const Courses = require("../../models/course");
const Episodes = require("../../models/episode");
const Users = require("../../models/user");

module.exports = class Controller {
	constructor() {
		this.model = { Courses,Episodes,Users};
	}

	//Show Errors For Validation Rules
	showValidationErrors(req, res, callback) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ message: errors.array(), success: false });
		}
	}
};
