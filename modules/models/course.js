const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timeStamps = require("mongoose-timestamp");

const CourseSchema = new Schema({
	user: [{ type: Schema.Types.ObjectId, ref: "User" }],
	title: { type: String, required: true },
	body: { type: String, required: true },
	price: { type: String, required: true },
	image: { type: String, required: true },
	episodes: [{ type: Schema.Types.ObjectId, ref: "Episode" }],
});

CourseSchema.plugin(timeStamps, {
	createdOn: "created_at",
	updatedOn: "updated_at",
});

module.exports = mongoose.model("Course", CourseSchema);
