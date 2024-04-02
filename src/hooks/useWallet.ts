import { useBoolean, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { configureChains, createConfig } from "wagmi";
import { signMessage } from "@wagmi/core";

import { useConnectModalStore } from "store/modalStore";
import { useRouter } from "next/router";
import { useJwtStore } from "store/jwtStore";
import { useUserInfoStore } from "store/userInfoStore";
import { useAiStore } from "store/aiStore";
import { mainnet, arbitrum, polygon } from "wagmi/chains";
import {
	EthereumClient,
	w3mConnectors,
	w3mProvider,
} from "@web3modal/ethereum";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount } from "wagmi";
import api from "api";
import { useNftStore } from "store/nftStore";
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

const chains = [mainnet, arbitrum, polygon];
const projectId = "c27e0568aa579f4d572246b7a2882010";
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const networkConfig = createConfig({
    autoConnect: true,
    connectors: [
        ...w3mConnectors({ projectId, chains }),
    ],
    publicClient,
});

const ethereumClient = new EthereumClient(networkConfig, chains);

export default function useWallet() {
	const router = useRouter();
	const { inviteId } = router?.query;
	const showToast = useToast();
	const [signLoading, setSignLoading] = useState(false);
	const { setTotalCoupon } = useAiStore();
	const { setJwt } = useJwtStore();
	const { open, close } = useWeb3Modal();
	const [isSign, setIsSign] = useBoolean(false);
	const { clearConnectModalStore, setOpenConnectModal } =
		useConnectModalStore();
	const { setUserId, clearUserInfo, setAccount, setEmail, setIsInvite } =
		useUserInfoStore();

	const { setLogList } = useNftStore();

	const doLogout = async () => {
		api.defaults.headers.authorization = "";
		setJwt("");
		clearUserInfo();
		clearConnectModalStore();
	};

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
			setUserId(res?.data?.user_id);
			setEmail(res?.data?.email);
			getIsInvite();
		} else {
			showToast({
				position: "top",
				title: "Authentication failed",
				variant: "subtle",
				status: "error",
			});
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
				console.log("error", error);
				setSignLoading(false);
				return false;
			}
		}
	};

	const handleSign = async (address: string) => {
		console.log("address", address);
		const res = await onConnect(address);

		if (res) {
			showToast({
				position: "top",
				title: "Login Success!",
				variant: "subtle",
			});
		} else {
			showToast({
				position: "top",
				title: "Login Failed!",
				variant: "subtle",
				status: "warning",
			});
		}

		setIsSign.off();
		setOpenConnectModal(false);
	};

	const openConnectWallet = () => {
		doLogout();
		open();
		setIsSign.on();
	};

	const getTccLog = async () => {
		const res: any = await api.get(`/api/incentive/log`, {
			params: {
				pageNumber: 0,
				pageSize: 100,
			},
		});
		if (res?.code === 200 && res.data && res.data.data) {
			setLogList(res.data.data);
		} else {
			setLogList([]);
		}
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
		getTccLog,
	};
}
