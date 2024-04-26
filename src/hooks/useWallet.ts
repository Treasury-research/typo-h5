import { useBoolean, useToast } from "@chakra-ui/react";
import React, { useEffect, useState, useMemo } from "react";
import { signMessage } from "@wagmi/core";

import { useConnectModalStore } from "store/modalStore";
import { useRouter } from "next/router";
import { useJwtStore } from "store/jwtStore";
import { useUserInfoStore } from "store/userInfoStore";
import { useAiStore } from "store/aiStore";
import { mainnet, arbitrum, polygon, polygonMumbai } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";
// import {
// 	EthereumClient,
// 	w3mConnectors,
// 	w3mProvider,
// } from "@web3modal/wagmi/ethereum";
import { useWeb3Modal, createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { useAccount, WagmiProvider, http, createConfig, useSwitchChain, useChainId, useDisconnect, useSignMessage, useBalance, useWalletClient } from "wagmi";
import api from "api";
import { useNftStore } from "store/nftStore";
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
// import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { chainList } from "lib/chain";
import { ethers } from "ethers";

export const queryClient = new QueryClient()
const metadata = {
  name: 'TypoX',
  description: 'TypoX',
  url: 'https://mobile.typography.staging.knn3.xyz',
  icons: ['https://mobile.typography.staging.knn3.xyz/favicon.png']
}

const chains = [mainnet, arbitrum, polygon, polygonMumbai] as const;
const projectId = "0a3c7c8f9211d3b784345f0b824206df" // "c27e0568aa579f4d572246b7a2882010";

export const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
  ],
})
createWeb3Modal({
  wagmiConfig: config,
  projectId,
})

// const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

// const networkConfig = createConfig({
//     autoConnect: true,
//     connectors: [
//         ...w3mConnectors({ projectId, chains }),
//     ],
//     publicClient,
// });

// const ethereumClient = new EthereumClient(networkConfig, chains);

export default function useWallet() {
  const router = useRouter();
  const { inviteId } = router?.query;
  const showToast = useToast();
  const [signLoading, setSignLoading] = useState(false);
  const { setTotalCoupon } = useAiStore();
  const { setJwt } = useJwtStore();
  const { open } = useWeb3Modal();
  const [isSign, setIsSign] = useBoolean(false);
  const { clearConnectModalStore, setOpenConnectModal } =
    useConnectModalStore();
  const { setUserId, clearUserInfo, setAccount, setEmail, setIsInvite, setIsPassuser } =
    useUserInfoStore();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isLogin, setIsLogin] = useBoolean(false);
  const { address, status, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [provider, setProvider] = useState<any>();
  const { data: walletClient } = useWalletClient()

  const { setLogList } = useNftStore();

  const balanceResult = useBalance({
    address,
    chainId: chainId,
    token: chainList[chainId]?.UContract as any,
  });

  const balance = useMemo(() => {
    return Number(BigInt(balanceResult.data?.value || 0)) / 1000000;
  }, [balanceResult]);

  const onConnect = async (address: string) => {
    if (address) {
      try {
	setSignLoading(true);
	const message = `Hello, welcome to TypoGraphy AI. Please sign this message to verify your wallet. Please make sure the URL is: https://app.typography.vip \nTime: ${Date.now()}`;
	const signMsg = await signMessage(config, {
	  message,
	});
	await getNonce(message, signMsg);
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
    setIsLogin.on();
    setTimeout(() => {
      open();
    }, 300);
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

  const switchNetwork = (chainId: number) => {
    switchChain({ chainId: chainId });
    setIsLogin.off();
  };

  const getIsInvite = async () => {
    const res: any = await api.get(`/api/auth/isInvite`);
    if (res?.code === 200) {
      setIsInvite(res?.data || false);
    }
  };

  const loginGetJwt = async (nonce: string) => {
    const res: any = await api.post(`api/auth/login`, {
      nonce,
      address,
      inviter_user_id: inviteId,
    });

    if (res && res?.code == 200 && res?.data && res?.data?.token) {
      api.defaults.headers.authorization = `Bearer ${res.data.token}`;
      setJwt(res.data.token);
      setAccount(address);
      setIsPassuser(res?.data?.is_pass_user);
      setUserId(res?.data?.user_id);
      setEmail(res?.data?.email);
      getIsInvite();
    } else {
      showToast({
	position: "top",
	title: "toast.toast17",
	variant: "subtle",
	status: "error",
      });
    }
  };

  const getNonce = async (challenge: string, signMsg: string) => {
    const res: any = await api.post(`/api/auth/getNonce`, {
      message: challenge,
      address,
      signature: signMsg,
    });
    if (res?.code === 200) {
      return res.data;
    }
    return null;
  };

  const signAndGetJwt = async () => {
    if (address) {
      try {
	setSignLoading(true);
	const message = `Hello, welcome to TypoGraphy AI. Please sign this message to verify your wallet. Please make sure the URL is: https://app.typography.vip \nTime: ${Date.now()}`;
	const signMsg = await signMessageAsync({
	  message,
	});

	const nonce = await getNonce(message, signMsg);
	if (nonce) {
	  await loginGetJwt(nonce);
	  return true;
	}
	setSignLoading(false);
	return true;
      } catch (error) {
	setSignLoading(false);
	return false;
      }
    }
  };

  const handleLogin = async () => {
    try {
      const res = await signAndGetJwt();
      if (res) {
        showToast({
	  position: "top",
	  title: "Login Success!",
	  variant: "subtle",
	  status: "success",
        });
      } else {
        showToast({
	  position: "top",
	  title: "Login Failed!",
	  variant: "subtle",
	  status: "warning",
        });
      }
      setIsLogin.off();
      return !!res;
    } catch (error) {
      setIsLogin.off();
      return false;
    }
  };

  const doLogout = async () => {
    api.defaults.headers.authorization = "";
    setJwt("");
    clearUserInfo();
    disconnect();
  };

  useEffect(() => {
    if (isConnected) {
      const ethereum = (window && window.ethereum) || (walletClient && walletClient.transport)
      console.log('ethereumkkk', ethereum, walletClient)

      if (ethereum) {
        const ethersProvider = new ethers.providers.Web3Provider(ethereum);
        setProvider(ethersProvider);
      }
    }
  }, [isConnected, chainId, walletClient]);

  useEffect(() => {
    if (isConnected && isLogin) {
      handleLogin();
    }
  }, [isConnected]);

  return {
    signLoading,
    isSign,
    projectId,
    queryClient,
    wagmiConfig: config,
    openConnectWallet,
    handleSign,
    onConnect,
    doLogout,
    getTccLog,
    chainId,
    switchNetwork,
    address,
    balance,
    provider
  };
}
