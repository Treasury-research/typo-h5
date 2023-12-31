import { useBoolean } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
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
import { useWeb3Modal } from "@web3modal/react";
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
	const router = useRouter();
	const { inviteId } = router?.query;
	const { showToast } = useStore();
	const [signLoading, setSignLoading] = useState(false);
	const { setTotalCoupon, setUsedCoupon } = useAiStore();
	const { setJwt } = useJwtStore();
	const { open } = useWeb3Modal();
	const [isSign, setIsSign] = useBoolean(false);
	const { clearConnectModalStore, setOpenConnectModal } =
		useConnectModalStore();
	const { setUserId, clearUserInfo, setAccount, setEmail, setIsInvite } =
		useUserInfoStore();

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
		if (address) {
			try {
				setSignLoading(true);
				const message = `Hello, welcome to TypoGraphy AI. Please sign this message to verify your wallet. Please make sure the URL is: https://app.typography.vip \nTime: ${Date.now()}`;
				const signMsg = await signMessage({
					message,
				});
				await getNonce(message, signMsg, address);
				setSignLoading(false);
				return true;
			} catch (error) {
				setSignLoading(false);
				return false;
			}
		}
	};

	const handleSign = async (address: string) => {
		const res = await onConnect(address);
		if (res) {
			showToast("Login Success!", "success");
		} else {
			showToast("Login Failed!", "warning");
		}
		setIsSign.off();
		setOpenConnectModal(false);
	};

	const doLogout = async () => {
		api.defaults.headers.authorization = "";
		setJwt("");
		clearUserInfo();
		clearConnectModalStore();
	};

	const openConnectWallet = () => {
		open();
		doLogout();
		setIsSign.on();
	};

	return {
		signLoading,
		isSign,
		projectId,
		ethereumClient,
		networkConfig,
		openConnectWallet,
		handleSign,
		onConnect,
		doLogout,
	};
}
