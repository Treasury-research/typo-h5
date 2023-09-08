import { useState, createContext, useCallback, useEffect } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import { useBindEmailStore, useConnectModalStore } from "store/modalStore";
import { useWalletStore } from "store/walletStore";
import { useUserInfoStore } from "store/userInfoStore";
import { useJwtStore } from "store/jwtStore";
import { useAiStore } from "store/aiStore";
import { useStore } from "store";
import { useRouter } from "next/router"
import api from 'api'

const errorMsg = `Metamask plugin not found or not active. Please check your browser's plugin list.`

export const Web3Context = createContext({
  web3: null,
  signer: null,
  chainId: null,
  networkId: null,
  blockNumber: null,
  account: '',
  message: null,
  signature: null,
  connector: null,
  connectWallet: async (walletName) => {
    return "";
  },
  resetWallet: async () => { },
  estimateGas: async () => { },
  signMessage: async (message) => {
    return "";
  },
  doLogin: async (address) => { },
  doLogout: async () => { },

});

export const Web3ContextProvider = ({ children }) => {
  // const web3Modal = useWeb3Modal();
  const { openBindEmail, setOpenBindEmail, setType, clearGitHubInfo } = useBindEmailStore();
  const { openConnectModal, setOpenConnectModal, clearConnectModalStore } = useConnectModalStore();
  const { autoConnect, setAutoConnect, setMessage, setSignature } = useWalletStore();
  const { setTotalCoupon, setUsedCoupon } = useAiStore();
  const { jwt, setJwt } = useJwtStore();
  const { setUserId, clearUserInfo, account, setAccount, setEmail, setIsInvite } = useUserInfoStore();
  const router = useRouter();
  const { inviteId } = router?.query;

  const { showToast } = useStore();
  const [web3, setWeb3] = useState("");
  const [signer, setSigner] = useState("");
  const [chainId, setChainId] = useState("");
  const [networkId, setnetworkId] = useState("");
  const [blockNumber, setBlockNumber] = useState("");
  const [wcProvider, setWcProvider] = useState("");
  const [connector, setConnector] = useState("");

  const listenProvider = () => {
    if (!window.ethereum) {
      return;
    }
    window.ethereum.on("close", () => {
      resetWallet();
    });
    window.ethereum.on("accountsChanged", async (accounts) => {
      setAccount(accounts[0]);
      setJwt('');
      api.defaults.headers.authorization = ''
      clearUserInfo();
      clearGitHubInfo();
    });
    window.ethereum.on("chainChanged", (chainId) => {
      setChainId(parseInt(chainId, 16));
    });
  };

  const connectWallet = useCallback(async () => {

    if (!window.ethereum) {
      // toast.info(errorMsg)
      // showToast(errorMsg)
      return
    }
    try {

      let web3Raw = null;

      await window.ethereum.enable();
      setConnector("injected");
      web3Raw = new Web3(window.ethereum);

      console.log('connected',)

      setWeb3(web3Raw);

      // get account, use this variable to detech if user is connected
      const accounts = await web3Raw.eth.getAccounts();
      setAccount(accounts[0]);
      setAutoConnect(true);

      // get signer object
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);

      const signerRaw = ethersProvider.getSigner();

      setSigner(signerRaw);

      // get network id
      setnetworkId(await web3Raw.eth.net.getId());

      // get chain id
      setChainId(await web3Raw.eth.getChainId());

      // init block number
      setBlockNumber(await web3Raw.eth.getBlockNumber());

      // switchChain(config.chainId);

      return accounts[0];
    } catch (error) {
      // setWeb3(new Web3(config.provider));
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetWallet = useCallback(async () => {
    console.log("ready to reset", connector, wcProvider);

    if (wcProvider) {
      setWcProvider(null);
      setConnector(null)
    } else {
      // wallet.reset();
    }

    setConnector("");
    setAccount("");
  }, []);

  useEffect(() => {
    listenProvider();
  }, [])

  const estimateGas = async (func, value = 0) => {
    try {
      const gas = await func.estimateGas({
        from: account,
        value,
      });
      return Math.floor(gas * 1.5);
    } catch (error) {
      console.log("eee", error);
      const objStartIndex = error.message.indexOf("{");
      const obj = JSON.parse(error.message.slice(objStartIndex));
      // toast.error(obj.message);
      showToast(obj.message)
    }
  };

  const getNonce = async (challenge, signMsg, address) => {
    const res = await api.post(`/api/auth/getNonce`, {
      message: challenge,
      address,
      signature: signMsg,
    });
    if (res?.code === 200) {
      loginGetJwt(res.data, address)
    } else {
      setOpenConnectModal(false)
    }
  };

  const getIsInvite = async () => {
    const res = await api.get(`/api/auth/isInvite`)
    if (res?.code === 200) {
      setIsInvite(res?.data || false)
    }
  }

  const loginGetJwt = async (nonce, address) => {
    const res = await api.post(`api/auth/login`, {
      nonce,
      address,
      inviter_user_id: inviteId,
    });
    setOpenConnectModal(false)
    if (res && res?.code == 200 && res?.data && res?.data?.token) {
      api.defaults.headers.authorization = `Bearer ${res.data.token}`;
      setJwt(res.data.token);
      setTotalCoupon(res?.data?.totalCoupon);
      setUsedCoupon(res?.data?.usedCoupon);
      setUserId(res?.data?.user_id);
      setEmail(res?.data?.email)
      getIsInvite();
    } else {
      showToast('Authentication failed', "danger")
    }
  }

  const doLogin = async (address) => {
    const challenge = `Hello, welcome to TypoGraphy AI. Please sign this message to verify your wallet. Please make sure the URL is: https://app.typography.vip \nTime: ${Date.now()}`;
    setMessage(challenge)
    const signMsg = await signMessage(challenge);
    if (signMsg) {
      setSignature(signMsg)
      getNonce(challenge, signMsg, address)
    }
  };

  const doLogout = async () => {
    api.defaults.headers.authorization = "";
    resetWallet();
    setAutoConnect(false);
    clearUserInfo();
    setJwt('');
    clearGitHubInfo();
    clearConnectModalStore();
  };

  /**
   *
   * @param {*} func , required
   * @param {*} actionType , required
   * @param {*} value , default 0
   * @returns
   */

  /**
   * Sign message
   */

  const signMessage = async (message) => {
    await window.ethereum.enable();
    const web3Raw = new Web3(window.ethereum);
    const signAccount = await web3Raw.eth.getAccounts();
    return await web3Raw.eth.personal.sign(message, signAccount[0]);
  };

  useEffect(() => {
    if (autoConnect) {
      connectWallet();
    }
  }, [autoConnect]);

  return (
    <Web3Context.Provider
      value={{
        web3,
        signer,
        chainId,
        networkId,
        account,
        message: null,
        signature: null,
        connector,
        blockNumber,
        connectWallet,
        resetWallet,
        estimateGas,
        signMessage,
        doLogin,
        doLogout,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const Web3ContextConsumer = Web3Context.Consumer;
