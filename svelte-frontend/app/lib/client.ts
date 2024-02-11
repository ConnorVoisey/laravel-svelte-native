import { EventEmitter } from "~/utils/eventEmitter";
import { userToken } from "~/stores/user";
import { config } from "~/../config";

type ValidationErrors = { [index: string]: string[] };

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
class ApiError {
	constructor(message: string, errorCode: null | number = null) {
		this.message = message;
		this.errorCode = errorCode;
	}
	errors: ValidationErrors = {};
	errorCode: number | null = 0;
	message = "Api Error";
}

class ApiClient {
	onError: EventEmitter<ApiError>;

	constructor() {
		this.onError = new EventEmitter<ApiError>();
	}

	async sendRequest<T>(
		relativeUrl: string,
		method: HttpMethod = "GET",
		payload: Record<string, unknown> | null = null,
	): Promise<T> {
		console.log("fetching ", `${config.apiUrl}${relativeUrl}`, method);
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			Accept: "application/json",
		};
		let token: string | null = null;
		userToken.subscribe((val) => {
			token = val;
		});
		console.log({ token });
		if (token !== null) {
			headers.Authorization = `Bearer ${token}`;
		}
		let res: Response;
		try {
			res = await fetch(`${config.apiUrl}${relativeUrl}`, {
				method: method,
				mode: "cors",
				headers: headers,
				body: payload ? JSON.stringify(payload) : null,
			});
			console.log({ res });
		} catch (e) {
			console.log("error running fetch", e);
			throw e;
		}

		if (!res.ok) {
			const err = new ApiError(res.statusText, res.status);
			if (res.status === 422) {
				try {
					err.errors = await res.json();
				} catch {}
			}
			this.onError.fire(err);
			throw err;
		}

		try {
			return await res.json();
		} catch {
			const err = new ApiError("Error parsing server response");
			this.onError.fire(err);
			throw err;
		}
	}
}

export const client = new ApiClient();
