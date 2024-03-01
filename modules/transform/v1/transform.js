module.exports = class Tranform {
	courseCollection(items) {
		return items.map((item) => {
			return { id: item._id, title: item.title, body: item.body, price: item.price };
		});
	}
	episodeCollection(items) {
		return items.map((item) => {
			return { id: item._id, title: item.title, body: item.body };
		});
	}
	episodeSingle(item) {
		return { id: item._id, title: item.title, body: item.body };
	}

	userData(item,token) {
		return { id: item._id, name: item.name, email: item.email, createdOn: item.createdAt,token };
	}
};
