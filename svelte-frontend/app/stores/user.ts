import { writable, derived, get, Writable } from "svelte/store";
import { client } from "../lib/client";
import * as appSettings from "@nativescript/core/application-settings";
import { User } from "~/types";
import { navigate } from "svelte-native";

interface UserResponse {
	user: User;
}

function buildUserTokenStore() {
	const stored_token: string | null = appSettings.getString("user_token");
	const user_token: Writable<string | null> = writable(stored_token);
	return {
		subscribe: user_token.subscribe,
		set(value: string | null) {
			if (value) {
				appSettings.setString("user_token", value);
			} else {
				appSettings.remove("user_token");
			}
			user_token.set(value);
		},
	};
}
function buildUserProfileStore() {
	const appSettingsKey = "user_profile";
	const userProfileVal: string | null = appSettings.getString(appSettingsKey);
	const userProfile: Writable<User | null> = writable(
		userProfileVal ? JSON.parse(userProfileVal) : userProfileVal,
	);
	return {
		subscribe: userProfile.subscribe,
		set(value: User | null) {
			if (value) {
				appSettings.setString(appSettingsKey, JSON.stringify(value));
			} else {
				appSettings.remove(appSettingsKey);
			}
			userProfile.set(value);
		},
	};
}

export const userToken = buildUserTokenStore();
export const userProfile = buildUserProfileStore();

export function logout() {
	userProfile.set(null);
	userToken.set(null);
}

export async function login(email: string, password: string): Promise<User> {
	console.log({ email, password });
	const { token } = await client.sendRequest<{ token: string }>(
		"/sanctum/token",
		"POST",
		{
			email,
			password,
			device_name: "TestDevice",
		},
	);
	userToken.set(token);
	console.log({ token });
	const user = await client.sendRequest<User>("/api/user", "GET");
	userProfile.set(user);

	return user;
}

interface ProfileUpdate {
	avatar_url: string;
	bio: string;
	email: string;
	username: string;
	new_password: string;
}

// export function update(update: ProfileUpdate): Promise<User> {
// 	let payload: any = {
// 		image: update.avatar_url,
// 		bio: update.bio,
// 		username: update.username,
// 		email: update.email,
// 	};
// 	if (update.new_password) {
// 		payload.new_password = update.new_password;
// 	}
//
// 	return client
// 		.sendRequest<UserResponse>("/user", "PUT", get(userToken), {
// 			user: payload,
// 		})
// 		.then((userResponse) => {
// 			let user = userResponse.user;
// 			userToken.set(user.token);
// 			user_profile.set(user);
// 			return user;
// 		});
// }
//
// export function register(
// 	username: string,
// 	email: string,
// 	password: string,
// ): Promise<User> {
// 	return client
// 		.sendRequest<UserResponse>("/users", "POST", null, {
// 			user: {
// 				username: username,
// 				email: email,
// 				password: password,
// 			},
// 		})
// 		.then((userResponse) => {
// 			let user = userResponse.user;
// 			userToken.set(user.token);
// 			user_profile.set(user);
// 			return user;
// 		});
// }
