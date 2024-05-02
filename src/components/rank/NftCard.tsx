import { useCallback } from "react";
import {
	VStack,
	Image,
	Text,
	HStack,
	Flex,
	Button,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	useBoolean,
	Box,
	Icon,
	useToast,
	useClipboard,
} from "@chakra-ui/react";
import SignInIcon from "components/icons/SignIn";
import api from "api";
import { getHash, isProduction, toShortAddress } from "lib";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useUserInfoStore } from "store/userInfoStore";
import { useStore } from "store";
import useChatContext from "hooks/useChatContext";
import { TbArrowsExchange } from "react-icons/tb";
import { ethers } from "ethers";
import { BaseModal } from "components";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { MdLaptopWindows } from "react-icons/md";
import { Popup } from "react-vant";
import useWallet from "hooks/useWallet";
import { useAccount, useConnect, useDisconnect, useWriteContract } from "wagmi";
import { Toast, Cell } from "react-vant";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { getAccount } from "@wagmi/core";
// import { useSDK } from '@metamask/sdk-react'
import { useWalletClient } from "wagmi";
import { Address } from "viem";
import AIFX_ABI from "lib/AIFX.json";

const chainConfig = {
	dev: {
		chainId: 80001,
		contract: "0x0b14ff34ccea03c2ffb7b6194c0fe5d0788041d0",
		abi: [
			"function publicMint(address to, uint256 key, bytes signedMsg)",
			"function setLevel(uint256 tokenId, uint256 key, bytes signedMsg)",
		],
		networkInfo: {
			chainId: "0x13881",
			chainName: "Mumbai",
			rpcUrls: ["https://polygon-mumbai-pokt.nodies.app"],
			currencySymbol: "MATIC",
			currencyDecimal: 18,
			tokenList: [
				{
					isNative: true,
					contractAddress: "0x0000000000000000000000000000000000000000",
					decimal: 18,
					symbol: "MATIC",
					name: "Matic",
				},
				{
					contractAddress: "0xC666283f0A53C46141f509ed9241129622013d95",
					decimal: 6,
					symbol: "TEST",
					name: "Test",
				},
			],
		},
	},
	pro: {
		chainId: 42161,
		contract: "0x6ca3AE33c818Ce9B2be40333f9D2d3639cBc1135",
		abi: [
			"function publicMint(address to, uint256 key, bytes signedMsg)",
			"function setLevel(uint256 tokenId, uint256 key, bytes signedMsg)",
		],
		networkInfo: {
			chainId: "0xa4b1",
			chainName: "Arbitrum LlamaNodes",
			rpcUrls: ["https://arbitrum.llamarpc.com"],
			currencySymbol: "ETH",
			currencyDecimal: 18,
			tokenList: [],
		},
	},
};

export const NftCard = ({}) => {
	const router = useRouter();
	const { getAuth } = useChatContext();
	const {
		account,
		userId,
		level,
		nftLevel,
		token_id,
		score,
		setNftLevel,
		rank,
	} = useUserInfoStore();
	const { chain } = useAccount();
	const showToast = useToast();
	const { isConnected, address } = useAccount();
	// const { switchNetwork } = useSwitchNetwork();
	const [isModalOpen, setIsModalOpen] = useBoolean(false);
	const [isLoading, setIsLoading] = useBoolean(false);
	const [isSignd, setIsSignd] = useBoolean(false);
	const [isSuccess, setIsSuccess] = useState<string>("ready");
	const [client, setClient] = useState<any>(null);
	const { handleSign, openConnectWallet } = useWallet();
	const { onCopy, value, setValue, hasCopied } = useClipboard(
		"https://app.typox.ai/rank?utm_source=h5&utm_medium=loyalty_rank&utm_campaign=AIFX_NFT_Claim&utm_content=Mobile_login_user"
	);
	const { connectAsync } = useConnect();
	const { disconnectAsync } = useDisconnect();
	const { data: walletClient } = useWalletClient();
	const { writeContractAsync } = useWriteContract();

	const connectWallet = async () => {
		if (!walletClient) return;
		const { transport } = walletClient;
		setClient(transport);
	};

	useEffect(() => {
		isConnected && walletClient && connectWallet();
	}, [isConnected, walletClient]);

	const mintText = useMemo(() => {
		if (score < 1000) {
			return nftLevel === 1 ? "Claim Lv2" : "Claim Lv1";
		} else if (score >= 1000 && score < 50000) {
			return nftLevel === 2 ? "Claim Lv3" : "Claim Lv2";
		} else {
			return nftLevel === 3 ? "Claimed" : "Claim Lv3";
		}
	}, [nftLevel, score]);

	const chainInfo = useMemo(() => {
		return isProduction ? chainConfig.pro : chainConfig.dev;
	}, [chainConfig]);

	console.log("chain", chain && chain.id, chainInfo.chainId);
	const getSignMsg = async () => {
		try {
			const res: any = await api.post(`api/sign`, {
				level: level,
			});
			if (res && res?.code == 200 && res?.data) {
				return res?.data;
			} else {
				setIsLoading.off();
				setIsSuccess("fail");
				showToast({
					position: "top",
					title: res?.data?.errorMsg || "Get server sign message error!",
					variant: "subtle",
				});

				return null;
			}
		} catch (error) {
			setIsLoading.off();
			setIsSuccess("fail");
			showToast({
				position: "top",
				title: "Get server sign message error!",
				variant: "subtle",
			});
		}
	};

	const getMintStatus = async (tx_hash: string) => {
		const res = await getHash(tx_hash);
		// console.log("mint blockHash", res?.blockHash);
		if (res && res.blockHash) {
			showToast({
				position: "top",
				title: "Congratulations, NFT minted successfully",
				variant: "subtle",
			});

			setIsSuccess("done");
			setTimeout(() => {
				getAuth();
			}, 5000);

			setNftLevel(level);
			setIsLoading.off();
			setIsSignd.off();
		} else {
			setTimeout(() => {
				getMintStatus(tx_hash);
			}, 3000);
		}
	};

	const switchNetwork = useCallback(
		async (networkInfo: any) => {
			const { chainId, chainName, rpcUrls, currencySymbol, currencyDecimal } =
				networkInfo;

			const ethereum = window.ethereum || client;

			console.log("chain000", chainId);
			try {
				await ethereum.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId }],
				});
			} catch (switchError: any) {
				if (
					switchError.code === 4902 ||
					switchError.message.indexOf("Try add") !== -1
				) {
					try {
						await ethereum.request({
							method: "wallet_addEthereumChain",
							params: [
								{
									chainId: networkInfo.chainId,
									chainName: networkInfo.chainName,
									rpcUrls: networkInfo.rpcUrls,
									nativeCurrency: {
										name: networkInfo.currencySymbol,
										symbol: networkInfo.currencySymbol,
										decimals: networkInfo.currencyDecimal,
									},
								},
							],
						});
					} catch (error: any) {
						showToast({
							position: "top",
							title: error.message,
							variant: "subtle",
						});
					}
				} else {
					showToast({
						position: "top",
						title: switchError.message,
						variant: "subtle",
					});
				}
			}
		},
		[client]
	);

	const mint = useCallback(async () => {
		try {
			setIsLoading.on();
			const ethereum = window.ethereum || client;
			const networkInfo = chainInfo.networkInfo;
			const currentChainId: any = chain && chain.id;

			if (currentChainId !== networkInfo.chainId) {
				await switchNetwork(networkInfo);
			}

			const signMsg = await getSignMsg();
			console.log(
				"chainInfo",
				token_id,
				chainInfo,
				chainInfo.contract,
				account
			);

			if (signMsg) {
				try {
					const result = await writeContractAsync({
						abi: AIFX_ABI,
						address: chainInfo.contract as Address,
						functionName: token_id ? "setLevel" : "publicMint",
						args: token_id
							? [token_id, BigInt(level), signMsg]
							: [account, BigInt(level), signMsg],
					});

					setIsSignd.on();
					if (result) {
						getMintStatus(result);
					}
				} catch (err: any) {
					console.log("err", err);
					setIsLoading.off();
					setIsSignd.off();
					setIsSuccess("fail");
					showToast({
						position: "top",
						title: err?.message || "Unknown Error",
						variant: "subtle",
					});
				}
			}
		} catch (error: any) {
			console.log("error 111", error.message);
		}

		// setIsLoading.off();
	}, [client, token_id, level, chainInfo, account]);

	useEffect(() => {
		if (userId) {
			getAuth();
		}
	}, [userId]);

	return (
		<Box w="full">
			<VStack
				w="full"
				px={3}
				py={3}
				borderRadius="8px"
				alignItems="center"
				bg="url('/images/rank/nftCard.svg')"
				bgSize="cover"
				shadow="md"
				color="#fff"
				fontSize="14px"
				spacing={0}
			>
				<Flex w="full" justify="space-between">
					<Image
						src={`/images/rank/LV${level || 1}.svg`}
						objectFit="contain"
						w="65px"
					/>
				</Flex>

				<Box w="full" px={3} mt={1}>
					<VStack flex={1} alignItems="flex-start">
						<Flex
							w="full"
							fontWeight="semibold"
							justify="space-between"
							fontSize="16px"
						>
							<Text mb="3px">
								Lv{level}{" "}
								{level === 1
									? "Rookie"
									: level === 2
									? "Supporter"
									: "Champion"}
							</Text>
							<Text pr={2}>{account ? toShortAddress(account, 10) : "--"}</Text>
						</Flex>
						<Slider
							aria-label="slider-ex-1"
							value={(score / 50000) * 100}
							colorScheme="teal"
							size="lg"
						>
							<SliderTrack>
								<SliderFilledTrack />
							</SliderTrack>
						</Slider>
						<Flex w="full" justify="space-between" fontSize="xs" pb={2}>
							<Text>{score || 0}/50k</Text>
							<Text cursor="pointer" onClick={() => router.push("/profile")}>
								My Rank: #{rank || "--"}
							</Text>
						</Flex>
					</VStack>
				</Box>
			</VStack>

			<Button
				marginTop="15px"
				variant="bluePrimary"
				leftIcon={userId ? <BsFillLightningChargeFill /> : <SignInIcon />}
				size="md"
				w="100%"
				minHeight="44px"
				fontWeight="600"
				borderRadius={8}
				color="white"
				padding="10px 20px"
				onClick={() => {
					if (!userId) {
						openConnectWallet();
					}
					setIsSignd.off();
					setIsLoading.off();
					setIsModalOpen.on();
					setIsSuccess("ready");
				}}
			>
				{"Connect Wallet"}
			</Button>
			<HStack
				mt={6}
				w="full"
				alignItems="center"
				justify="center"
				color="#000"
				onClick={() => {
					onCopy();
					showToast({
						position: "top",
						title: "Link copied. Please access it via PC.",
						variant: "subtle",
					});
				}}
			>
				<Icon as={MdLaptopWindows} boxSize={4} />
				<Text fontSize="16px" fontWeight="500">
					Claim Loyalty NFT on PC
				</Text>
				<Flex w="25px">
					<Icon className="moveArr" as={ArrowForwardIcon} boxSize={4} />
				</Flex>
			</HStack>

			<Popup
				visible={isModalOpen}
				position="bottom"
				onClose={setIsModalOpen.off}
			>
				{isSuccess === "ready" ? (
					<VStack className="text-center" mb="8">
						<HStack spacing={5} className="mt-6 mb-3" alignItems="center">
							<Image
								src={`/images/rank/LV${level}.svg`}
								objectFit="contain"
								w="75px"
								mt={4}
							/>

							<Icon as={TbArrowsExchange} color="bg.green" boxSize={6} />

							<Image
								src={`/images/rank/NFT${level}.svg`}
								objectFit="contain"
								w="58px"
							/>
						</HStack>

						<Text className="text-[20px] font-bold mb-2 px-5">
							{/* You are claiming the badge of LV{level}{" "} */}
							Please access TypoX AI via a computer to mint the NFT
						</Text>

						{/* {(level === 1 || level === 2) && (
                <Text
                className="text-[#FFA047] w-[350px] text-[13px] pb-8"
                lineHeight="18px"
                >
                Notice: You can upgrade to higher level after claiming，or
                directly claim higher level later.
                </Text>
                )} */}

						{isSignd && (
							<Text fontSize="xs" color="gray.500">
								The transaction is expected to take about 1 minutes.
							</Text>
						)}
						<Button
							size="md"
							w="80%"
							mt={5}
							marginBottom={"40px"}
							borderRadius="md"
							minHeight="44px"
							fontWeight="600"
							variant="bluePrimary"
							color="white"
							onClick={mint}
						>
							Mint
						</Button>
					</VStack>
				) : (
					<VStack className="text-center" mb="8">
						<Image
							src={`/images/rank/${isSuccess}.svg`}
							objectFit="contain"
							w="80px"
							h="88px"
							className="mx-auto mt-10 mb-3"
						/>

						<Text className="text-[24px] font-bold mb-2">
							{isSuccess === "done" ? "Mint Success" : "Mint failed"}
						</Text>

						<Text
							className="text-[#575B66] w-[300px] text-[13px] pb-8"
							lineHeight="18px"
						>
							{isSuccess === "done"
								? "The badge has been issued to your account, please check it!"
								: "Please try again later"}
						</Text>

						<Button
							size="md"
							w="80%"
							marginBottom={"40px"}
							borderRadius="md"
							isLoading={isLoading}
							loadingText={isSignd ? "Transaction Submitted" : "Please sign"}
							minHeight="44px"
							fontWeight="600"
							variant="bluePrimary"
							color="white"
							onClick={setIsModalOpen.off}
						>
							OK
						</Button>
					</VStack>
				)}
			</Popup>
		</Box>
	);
};
