import Constants from 'expo-constants';
import { NativeModules, Platform } from 'react-native';

const KNOWN_LAN_FALLBACKS = ['http://192.168.137.215:5000'];

const resolveWebBaseUrl = () => {
	if (typeof window !== 'undefined' && window.location?.hostname) {
		return `http://${window.location.hostname}:5000`;
	}
	return 'http://localhost:5000';
};

const resolveDevHost = () => {
	const scriptURL = NativeModules?.SourceCode?.scriptURL || '';
	if (!scriptURL) return '';

	try {
		return new URL(scriptURL).hostname || '';
	} catch (error) {
		const match = scriptURL.match(/https?:\/\/([^/:]+)/i);
		return match?.[1] || '';
	}
};

const resolveExpoHost = () => {
	const hostUri =
		Constants?.expoConfig?.hostUri ||
		Constants?.manifest2?.extra?.expoClient?.hostUri ||
		Constants?.manifest?.debuggerHost ||
		'';

	if (!hostUri) return '';
	return String(hostUri).split(':')[0] || '';
};

export const getApiBaseUrls = () => {
	const urls = [];
	const add = (url) => {
		if (url && !urls.includes(url)) {
			urls.push(url);
		}
	};

	const expoHost = resolveExpoHost();
	const devHost = resolveDevHost();

	if (Platform.OS === 'web') {
		add(resolveWebBaseUrl());
		add('http://localhost:5000');
		add('http://127.0.0.1:5000');
		return urls;
	}

	if (expoHost && expoHost !== 'localhost' && expoHost !== '127.0.0.1') {
		add(`http://${expoHost}:5000`);
	}

	if (devHost && devHost !== 'localhost' && devHost !== '127.0.0.1') {
		add(`http://${devHost}:5000`);
	}

	if (Platform.OS === 'android') {
		add('http://10.0.2.2:5000');
	}

	KNOWN_LAN_FALLBACKS.forEach(add);
	add('http://localhost:5000');
	add('http://127.0.0.1:5000');
	return urls;
};

export const API_BASE_URLS = getApiBaseUrls();

export const fetchWithBaseUrlFallback = async (path, options = {}) => {
	let lastError;

	for (const baseUrl of API_BASE_URLS) {
		try {
			const response = await fetch(`${baseUrl}${path}`, options);
			return { response, baseUrl };
		} catch (error) {
			lastError = error;
		}
	}

	throw lastError || new Error('Could not reach backend server');
};

