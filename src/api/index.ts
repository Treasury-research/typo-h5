import axios from "axios";
import { useWalletStore } from "store/walletStore";
import { useUserInfoStore } from "store/userInfoStore";
import { useConnectModalStore } from 'store/modalStore';
import { useJwtStore } from "store/jwtStore";

const baseURL = process.env.NEXT_PUBLIC_TYPOGRAPH_API_DOMAIN

const modalStore = useConnectModalStore.getState();

function logOut() {
	const walletStore = useWalletStore.getState();
	const userInfoStore = useUserInfoStore.getState();
	const jwtStore = useJwtStore.getState();
	userInfoStore.clearUserInfo();
	walletStore.clearWallet();
	jwtStore.setJwt("");
	api.defaults.headers.authorization = "";
}

const api = axios.create({
	baseURL,
});

api.interceptors.request.use(
	(config) => {
		const jwt = useJwtStore.getState().jwt;
		config.headers.authorization = `Bearer ${jwt ? jwt : 123}`;
		return config;
	},
	(err) => {
		return Promise.reject(err);
	}
);

api.interceptors.response.use(
	(res: any) => {
		if (res.data.code === 200) {
			return res.data;
		} else {
			if(res.data.code === 1006) {
				modalStore.setOpenConnectModal(true);
				logOut();
			}
			return res;
		}
	},
	(error: any) => {
		if (error && error.response && error.response.status === 403) {
			logOut();
		}
		return error.response;
	}
);

export default api;
