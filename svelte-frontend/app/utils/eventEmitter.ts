export class EventEmitter<T> {
	listeners: ((t: T) => unknown)[] = [];

	subscribe(callback: (t: T) => unknown) {
		this.listeners.push(callback);
		return () => {
			const idx = this.listeners.indexOf(callback);
			if (idx >= 0) this.listeners.splice(idx, 1);
		};
	}

	fire(event: T) {
		for (const cb of this.listeners) {
			try {
				cb(event);
			} catch {
				//ignore
			}
		}
	}
}
