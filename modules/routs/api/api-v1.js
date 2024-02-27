const express = require("express");
const router = express.Router();
const Courses = require("../../models/course");
const adminRouter = express.Router();

const HomeController = require("../../controllers/api/v1/homeController");
const AdminCourseController = require("../../controllers/api/v1/admin/courseController");

router.get("/", HomeController.index);

adminRouter.get("/courses", AdminCourseController.get.bind(AdminCourseController));
adminRouter.get("/courses/:id", AdminCourseController.getOne.bind(AdminCourseController));
adminRouter.post("/courses", AdminCourseController.generate.bind(AdminCourseController));
adminRouter.put("/courses/:id", AdminCourseController.edit.bind(AdminCourseController));
adminRouter.delete("/courses/:id", AdminCourseController.delete.bind(AdminCourseController));

router.use("/admin", adminRouter);

module.exports = router;
