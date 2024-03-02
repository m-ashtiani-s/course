const express = require("express");
const router = express.Router();
const adminRouter = express.Router();
const authHandler = require("./middleware/authMiddlewae");
const Validations=require('./middleware/validations')
const { uploadImage } = require("./middleware/UploadMiddleware");
const HomeController = require("../../controllers/api/v1/homeController");
const AdminCourseController = require("../../controllers/api/v1/admin/courseController");
const AdminEpisodsController = require("../../controllers/api/v1/admin/episodeController");
const AuthController = require("../../controllers/api/v1/authController");
const ShopController = require("../../controllers/api/v1/shopController");


router.get("/", HomeController.index);



router.post("/register", Validations.registerValidation, AuthController.register.bind(AuthController));
router.post("/login", Validations.loginValidation,AuthController.login.bind(AuthController));
// router.post("/profile", uploadImage.single("image"), (req, res) => {
// 	console.log(req.body.mm);
// 	console.log(req.file);
// 	return res.json("ddd");
// });
router.post("/shop", authHandler, ShopController.shop.bind(ShopController));

adminRouter.get("/courses",authHandler, AdminCourseController.get.bind(AdminCourseController));
adminRouter.get("/courses/:id", Validations.getCourseValidation, AdminCourseController.getOne.bind(AdminCourseController));
adminRouter.post("/courses", authHandler, Validations.generateValidation, AdminCourseController.generate.bind(AdminCourseController));
adminRouter.put("/courses/:id", Validations.updateCourseValidation, AdminCourseController.edit.bind(AdminCourseController));
adminRouter.delete("/courses/:id", Validations.deleteValidation, AdminCourseController.delete.bind(AdminCourseController));

adminRouter.get("/episodes", AdminEpisodsController.get.bind(AdminEpisodsController));
adminRouter.get("/episodes/:id", Validations.getEpisodeValidation, AdminEpisodsController.getOne.bind(AdminEpisodsController));
adminRouter.post("/episodes", Validations.generateEpisodeValidation, AdminEpisodsController.generate.bind(AdminEpisodsController));
adminRouter.put("/episodes/:id", Validations.updateEpisodeValidation, AdminEpisodsController.edit.bind(AdminEpisodsController));
adminRouter.delete("/episodes/:id", Validations.deleteEpisodeValidation, AdminEpisodsController.delete.bind(AdminEpisodsController));

router.use("/admin", adminRouter);

module.exports = router;
