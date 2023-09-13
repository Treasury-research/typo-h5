import React, { useState } from "react";
import { useWalletStore } from "store/walletStore";
import { configureChains, createConfig } from "wagmi";
import { signMessage } from "@wagmi/core";

import { useConnectModalStore } from "store/modalStore";
import { useRouter } from "next/router";
import { useJwtStore } from "store/jwtStore";
import { useStore } from "store";
import { useUserInfoStore } from "store/userInfoStore";
import { useAiStore } from "store/aiStore";
import { mainnet } from "wagmi/chains";
import {
	EthereumClient,
	w3mConnectors,
	w3mProvider,
} from "@web3modal/ethereum";

import api from "api";

const chains = [mainnet];
const projectId = "c27e0568aa579f4d572246b7a2882010";
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const networkConfig = createConfig({
	autoConnect: true,
	connectors: w3mConnectors({ projectId, chains }),
	publicClient,
});

const ethereumClient = new EthereumClient(networkConfig, chains);

export default function useWallet() {
	const [signLoading, setSignLoading] = useState(false);
	const { setAutoConnect, setMessage, setSignature } = useWalletStore();
	const { clearConnectModalStore } = useConnectModalStore();

	const { setTotalCoupon, setUsedCoupon } = useAiStore();
	const {
		setUserId,
		clearUserInfo,
		account,
		setAccount,
		setEmail,
		setIsInvite,
	} = useUserInfoStore();
	const { jwt, setJwt } = useJwtStore();
	const router = useRouter();
	const { inviteId } = router?.query;
	const { showToast } = useStore();

	const getIsInvite = async () => {
		const res: any = await api.get(`/api/auth/isInvite`);
		if (res?.code === 200) {
			setIsInvite(res?.data || false);
		}
	};

	const loginGetJwt = async (nonce: string, address: string) => {
		const res: any = await api.post(`api/auth/login`, {
			nonce,
			address,
			inviter_user_id: inviteId,
		});

		if (res && res?.code == 200 && res?.data && res?.data?.token) {
			api.defaults.headers.authorization = `Bearer ${res.data.token}`;
			setJwt(res.data.token);
			setAccount(address);
			setTotalCoupon(res?.data?.totalCoupon);
			setUsedCoupon(res?.data?.usedCoupon);
			setUserId(res?.data?.user_id);
			setEmail(res?.data?.email);
			getIsInvite();
		} else {
			showToast("Authentication failed", "danger");
		}
	};

	const getNonce = async (
		challenge: string,
		signMsg: string,
		address: string
	) => {
		const res: any = await api.post(`/api/auth/getNonce`, {
			message: challenge,
			address,
			signature: signMsg,
		});
		if (res?.code === 200) {
			loginGetJwt(res.data, address);
		}
	};

	const onConnect = async (address: string) => {
		doLogout();
		if (address) {
			try {
				setSignLoading(true);
				const message = `Hello, welcome to TypoGraphy AI. Please sign this message to verify your wallet. Please make sure the URL is: https://app.typography.vip \nTime: ${Date.now()}`;
				setMessage(message);
				const signMsg = await signMessage({
					message,
				});
				await getNonce(message, signMsg, address);
				return true;
				setSignLoading(false);
			} catch (error) {
				setSignLoading(false);
				return false;
			}
		}
	};

	const doLogout = async () => {
		api.defaults.headers.authorization = "";
		setAutoConnect(false);
		clearUserInfo();
		setJwt("");

		clearConnectModalStore();
	};

	return {
		signLoading,
		projectId,
		ethereumClient,
		networkConfig,
		onConnect,
		doLogout,
	};
}
