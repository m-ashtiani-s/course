const Controller = require("../controller");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Transform = require("../../../transform/v1/transform");
const config = require("../../../config");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

module.exports = new (class AuthController extends Controller {
	register(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		this.model.Users.findOne({ email: req.body.email })
			.then((user) => {
				if (user) {
					return res.status(400).json({ data: [{ fields: "email", message: "ایمیل تکراری است" }], success: false });
				}
				const newUser = new this.model.Users({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password,
				});

				newUser.save();
				res.json({ data: [{ fields: "user", message: "کاربر با موفقیت ایجاد شد" }], success: true });
			})
			.catch((err) => {
				res.status(500).json({ data: [{ fields: "user", message: err.message }], success: false });
			});
	}

	login(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		// Saving reference to 'this' to use inside LocalStrategy
		const self = this;

		passport.use(
			new LocalStrategy({ usernameField: "email" }, function (email, password, done) {
				self.model.Users.findOne({ email: email })
					.then((user) => {
						if (!user) {
							return res.status(400).json({ data: [{ fields: "email", message: "اطلاعات وارد شده صحیح نیست" }], success: false });
						}
						bcrypt.compare(password, user.password, function (err, isMatch) {
							if (err) {
								return res.status(500).json({ data: [{ fields: "user", message: err.message }], success: false });
							}
							if (!isMatch) {
								return res.status(400).json({ data: [{ fields: "email", message: "اطلاعات وارد شده صحیح نیست" }], success: false });
							}
							return done(null, user);
						});
					})
					.catch((err) => {
						return res.status(500).json({ data: [{ fields: "user", message: err.message }], success: false });
					});
			})
		);

		passport.authenticate("local", function (err, user) {
			if (err) {
				return res.status(500).json({ data: [{ fields: "user", message: err.message }], success: false });
			}
			if (!user) {
				return res.status(400).json({ data: [{ fields: "user", message: "اطلاعات وارد شده صحیح نیست" }], success: false });
			}
			const token = jwt.sign({ user_id: user._id }, config.secret, {
				expiresIn: "110h",
			});
			return res.json({
				data: new Transform().userData(user, token),
				success: true,
			});
		})(req, res, next);
	}
})();
