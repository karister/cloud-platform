const formatUrl = (url) => {
	try {
		return new URL(url)
	} catch (e) {
		console.error('无效的URL地址', url);
	}
	return {}
}

class Publisher {
	subscribers = {}
	constructor() {}
	subscribe(subscriber) {
		const url = formatUrl(subscriber?.url);
		if (!this.subscribers[url.origin]) {
			this.subscribers[url.origin] = []
		}
		this.subscribers[url.origin].push(subscriber);
	}
	unsubscribe(subscriber) {
		const url = formatUrl(subscriber?.url);
		if (this.subscribers[url.origin]) {
			this.subscribers[url.origin] = this.subscribers[url.origin].filter((sub) => sub !== subscriber);
		}
	}
	publish(data) {
		const url = formatUrl(data?.url);
		if (this.subscribers[url.origin]) {
			this.subscribers[url.origin].forEach((subscriber) => {
				subscriber.notify(data)
			});
		}
	}
	findSubscriberByUrl(url) {
		const originUrl = formatUrl(url);
		return this.subscribers[originUrl.origin]
	}
}
module.exports = {
	formatUrl,
	Publisher
}