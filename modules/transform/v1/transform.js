module.exports = class Tranform {
	courseCollection(items, withEpisodes = false) {
		if (Array.isArray(items)) {
			if (withEpisodes) {
				return items.map((item) => {
					return { id: item._id, title: item.title, body: item.body, price: item.price, episodes: this.episodeCollection(item.episodes) };
				});
			} else {
				return items.map((item) => {
					return { id: item._id, title: item.title, body: item.body, price: item.price };
				});
			}
		} else {
			if (withEpisodes) {
				return { id: items._id, title: items.title, body: items.body, price: items.price, episodes: this.episodeCollection(items.episodes) };
			} else {
				return { id: items._id, title: items.title, body: items.body, price: items.price };
			}
		}
	}

	episodeCollection(items, withCourse = false) {
		console.log(items)
		if (Array.isArray(items)) {
			if (withCourse) {
				return items.map((item) => {
					return { id: item._id, title: item.title, body: item.body, course: this.courseCollection(item.course) };
				});
			} else {
				return items.map((item) => {
					return { id: item._id, title: item.title, body: item.body };
				});
			}
		} else {
			if (withCourse) {
					return { id: items._id, title: items.title, body: items.body, course: this.courseCollection(items.course) };
			} else {
					return { id: items._id, title: items.title, body: items.body };
			}
		}
	}

	episodeSingle(item) {
		return { id: item._id, title: item.title, body: item.body };
	}

	userData(item, token) {
		return { id: item._id, name: item.name, email: item.email, createdOn: item.createdAt, token };
	}
};
