

module.exports = (req, res, next) => {
	if (req.user.role == "admin") {
		return next();
	} else {
		return res.status(403).json({
			data: { field: "", message: "شما اجازه دسترسی به این بخش را ندارید" },
			success: false,
		});
	}
};
