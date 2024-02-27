const app = require("express")();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
global.config = require("./modules/config.js");

//db
mongoose.connect('mongodb://127.0.0.1:27017/roocket')
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/json" }));

const webRouter = require("./modules/routs/web.js");
const apiRouter = require("./modules/routs/api");

app.use("/api", apiRouter);
app.use("/", webRouter);

app.listen(config.port, () => {
	console.log(`server running on port ${config.port}`);
});
