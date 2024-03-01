const { use } = require("../../../routs/api/api-v1");
const Controller = require("../controller");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Transform = require("../../../transform/v1/transform");
const config = require('../../../config')
const jwt = require('jsonwebtoken');

module.exports = new (class AuthController extends Controller {
	register(req, res) {
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
			this.model.Users.findOne({ email: req.body.email }).then((user) => {
				if (user) {
					return res.status(400).json({ message: "Email already exists" });
				}
				const newUser = new this.model.Users({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password,
				});

				newUser.save();
				return res.json("fff");
			}).catch;
		} catch {}
	}

	login(req, res) {
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

			this.model.Users.findOne({ email: req.body.email }).then((user) => {
				if (!user) {
					return res.status(400).json({ message: "اطلاعات وارد شده صحیح نیست" });
				}
				bcrypt
					.compare(req.body.password, user.password)
					.then((accepted) => {
						if (!accepted) {
							return res.json("login faild");
						}
                        const token=jwt.sign({ user_id : user._id } , config.secret , {
                            expiresIn :  '110h',
                        });
						return res.json({
							data: new Transform().userData(user,token),
							success: true,
						});
					})
					.catch((err) => {
						console.log(err);
					});
			}).catch;
		} catch {}
	}
})();
