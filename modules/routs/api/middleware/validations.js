const { check } = require("express-validator");

module.exports = {
	getCourseValidation: [check("id").exists().withMessage("آیدی نمیتواند خالی باشد").isMongoId().withMessage("آیدی کورس اشتباه است")],
	generateValidation: [check("title").notEmpty().withMessage("عنوان دوره الزامی است")],
	updateCourseValidation: [
		check("id").exists().withMessage("آیدی نمیتواند خالی باشد").isMongoId().withMessage("آیدی کورس اشتباه است"),
		check("title").notEmpty().withMessage("عنوان دوره الزامی است"),
	],
	deleteValidation: [check("id").exists().withMessage("آیدی نمیتواند خالی باشد").isMongoId().withMessage("آیدی کورس اشتباه است")],

	getEpisodeValidation: [check("id").exists().withMessage("آیدی نمیتواند خالی باشد").isMongoId().withMessage("آیدی اپیزود اشتباه است")],
	generateEpisodeValidation: [
		check("course_id").exists().withMessage("آیدی نمیتواند خالی باشد").isMongoId().withMessage("آیدی کورس اشتباه است"),
		check("title").notEmpty().withMessage("عنوان اپیزود الزامی است"),
		check("number").notEmpty().withMessage("شماره اپیزود الزامی است"),
		check("videoUrl").notEmpty().withMessage("لینک اپیزود الزامی است"),
	],
	updateEpisodeValidation: [
		check("id").exists().withMessage("آیدی نمیتواند خالی باشد").isMongoId().withMessage("آیدی کورس اشتباه است"),
		check("title").notEmpty().withMessage("عنوان اپیزود الزامی است"),
		check("number").notEmpty().withMessage("شماره اپیزود الزامی است"),
		check("videoUrl").notEmpty().withMessage("لینک اپیزود الزامی است"),
	],
	deleteEpisodeValidation: [check("id").exists().withMessage("آیدی نمیتواند خالی باشد").isMongoId().withMessage("آیدی اپیزود اشتباه است")],

	registerValidation: [
		check("name").notEmpty().withMessage("نام الزامی است"),
		check("email").notEmpty().withMessage("ایمیل الزامی است").isEmail().withMessage("فرمت وارد شده برای ایمیل صحیح نیست"),
		check("password")
			.notEmpty()
			.withMessage("رمز عبور الزامی است")
			.isLength({ min: 8 })
			.withMessage("رمز عبور باید بیشتر از 8 کاراکتر باشد")
			.matches(/[a-z]/)
			.withMessage("رمز عبور باید شامل حروف کوچک باشد")
			.matches(/[A-Z]/)
			.withMessage("رمز عبور باید شامل حروف بزرگ باشد")
			.matches(/[0-9]/)
			.withMessage("رمز عبور باید شامل اعداد باشد")
			.matches(/[!@#$%^&*(),.?":{}|<>]/)
			.withMessage("پسوورد باید شامل کاراکتر های خاصی باشد"),
	],
loginValidation: [
		check("email").notEmpty().withMessage("ایمیل الزامی است").isEmail().withMessage("فرمت وارد شده برای ایمیل صحیح نیست"),
		check("password")
			.notEmpty()
			.withMessage("رمز عبور الزامی است")
	],
};
