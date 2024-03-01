const express = require("express");
const router = express.Router();
const Courses = require("../../models/course");
const adminRouter = express.Router();
const { check } = require("express-validator");
const authHandler=require('./middleware/authMiddlewae')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const HomeController = require("../../controllers/api/v1/homeController");
const AdminCourseController = require("../../controllers/api/v1/admin/courseController");
const AdminEpisodsController = require("../../controllers/api/v1/admin/episodeController");
const AuthController = require("../../controllers/api/v1/authController");
const ShopController = require("../../controllers/api/v1/shopController");
const { uploadImage } = require("./middleware/UploadMiddleware");

router.get("/", HomeController.index);

const getCourseValidation = [check("id").exists().withMessage("آیدی نمیتواند خالی باشد").isMongoId().withMessage("آیدی کورس اشتباه است")];
const generateValidation = [check("title").notEmpty().withMessage("عنوان دوره الزامی است")];
const updateCourseValidation = [check("id").exists().withMessage("آیدی نمیتواند خالی باشد").isMongoId().withMessage("آیدی کورس اشتباه است"), check("title").notEmpty().withMessage("عنوان دوره الزامی است")];
const deleteValidation = [check("id").exists().withMessage("آیدی نمیتواند خالی باشد").isMongoId().withMessage("آیدی کورس اشتباه است")];

const getEpisodeValidation = [check("id").exists().withMessage("آیدی نمیتواند خالی باشد").isMongoId().withMessage("آیدی اپیزود اشتباه است")];
const generateEpisodeValidation = [check("title").notEmpty().withMessage("عنوان اپیزود الزامی است")];
const updateEpisodeValidation = [check("id").exists().withMessage("آیدی نمیتواند خالی باشد").isMongoId().withMessage("آیدی اپیزود اشتباه است"), check("title").notEmpty().withMessage("عنوان اپیزود الزامی است")];
const deleteEpisodeValidation = [check("id").exists().withMessage("آیدی نمیتواند خالی باشد").isMongoId().withMessage("آیدی اپیزود اشتباه است")];

router.post("/register", AuthController.register.bind(AuthController));
router.post("/login", AuthController.login.bind(AuthController));
router.post("/profile",uploadImage.single('image'), (req,res)=>{
    console.log(req.body.mm)
    console.log(req.file)
    return res.json('ddd')
});
router.post("/shop", authHandler,ShopController.shop.bind(ShopController));

adminRouter.get("/courses", AdminCourseController.get.bind(AdminCourseController));
adminRouter.get("/courses/:id", getCourseValidation, AdminCourseController.getOne.bind(AdminCourseController));
adminRouter.post("/courses",authHandler, generateValidation, AdminCourseController.generate.bind(AdminCourseController));
adminRouter.put("/courses/:id", updateCourseValidation, AdminCourseController.edit.bind(AdminCourseController));
adminRouter.delete("/courses/:id", deleteValidation, AdminCourseController.delete.bind(AdminCourseController));

adminRouter.get("/episodes", AdminEpisodsController.get.bind(AdminEpisodsController));
adminRouter.get("/episodes/:id", getEpisodeValidation, AdminEpisodsController.getOne.bind(AdminEpisodsController));
adminRouter.post("/episodes", generateEpisodeValidation, AdminEpisodsController.generate.bind(AdminEpisodsController));
adminRouter.put("/episodes/:id", updateEpisodeValidation, AdminEpisodsController.edit.bind(AdminEpisodsController));
adminRouter.delete("/episodes/:id", deleteEpisodeValidation, AdminEpisodsController.delete.bind(AdminEpisodsController));

router.use("/admin", adminRouter);


module.exports = router;
