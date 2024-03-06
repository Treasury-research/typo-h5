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
} from "@chakra-ui/react";
import api from "api";
import { getHash, isProduction, toShortAddress } from "lib";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useUserInfoStore } from "store/userInfoStore";
import { useStore } from "store";
import { useNetwork, useSwitchNetwork } from "wagmi";
import useChatContext from "hooks/useChatContext";
import { TbArrowsExchange } from "react-icons/tb";
import { ethers } from "ethers";
import { BaseModal } from "components";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { useConnectModalStore } from "store/modalStore";
import { Popup } from "react-vant";

const chainConfig = {
	dev: {
		chainId: 80001,
		contract: "0x0b14ff34ccea03c2ffb7b6194c0fe5d0788041d0",
		abi: [
			"function publicMint(address to, uint256 key, bytes signedMsg)",
			"function setLevel(uint256 tokenId, uint256 key, bytes signedMsg)",
		],
	},
	pro: {
		chainId: 42161,
		contract: "0x6ca3AE33c818Ce9B2be40333f9D2d3639cBc1135",
		abi: [
			"function publicMint(address to, uint256 key, bytes signedMsg)",
			"function setLevel(uint256 tokenId, uint256 key, bytes signedMsg)",
		],
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
	const { chain } = useNetwork();
	const showToast = useToast();
	const { switchNetwork } = useSwitchNetwork();
	const [isModalOpen, setIsModalOpen] = useBoolean(false);
	const [isLoading, setIsLoading] = useBoolean(false);
	const [isSign, setIsSign] = useBoolean(false);
	const [isSuccess, setIsSuccess] = useState<string>("ready");
	const { setOpenConnectModal } = useConnectModalStore();

	const mintText = useMemo(() => {
		if (score < 10) {
			return nftLevel === 1 ? "Claim Lv2" : "Claim Lv1";
		} else if (score >= 10 && score < 30) {
			return nftLevel === 2 ? "Claim Lv3" : "Claim Lv2";
		} else {
			return nftLevel === 3 ? "Claimed" : "Claim Lv3";
		}
	}, [nftLevel, score]);

	const chainInfo = useMemo(() => {
		return isProduction ? chainConfig.pro : chainConfig.pro;
	}, [chainConfig]);

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
			setIsSign.off();
		} else {
			setTimeout(() => {
				getMintStatus(tx_hash);
			}, 3000);
		}
	};

	const mint = async () => {
		if (chain?.id !== chainInfo.chainId) {
			showToast({
				position: "top",
				title: "Please switch to the Arbitrum network!",
				variant: "subtle",
			});
			switchNetwork?.(chainInfo.chainId);
			return;
		}

		setIsLoading.on();
		const signMsg = await getSignMsg();

		if (signMsg) {
			try {
				const ethersProvider = new ethers.providers.Web3Provider(
					window?.ethereum
				);
				const signer = await ethersProvider.getSigner();

				const contract = new ethers.Contract(
					chainInfo.contract,
					chainInfo.abi,
					signer
				);

				let result: any;
				if (token_id) {
					result = await contract.setLevel(token_id, level, signMsg);
				} else {
					result = await contract.publicMint(account, level, signMsg);
				}

				setIsSign.on();
				if (result && result.hash) {
					getMintStatus(result.hash);
				}
			} catch (err: any) {
				console.log("err", err);
				setIsLoading.off();
				setIsSign.off();
				setIsSuccess("fail");
				showToast({
					position: "top",
					title: err?.message || "Unknown Error",
					variant: "subtle",
				});
			}
		}

		// setIsLoading.off();
	};

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
							value={(score / 30) * 100}
							colorScheme="teal"
							size="lg"
						>
							<SliderTrack>
								<SliderFilledTrack />
							</SliderTrack>
						</Slider>
						<Flex w="full" justify="space-between" fontSize="xs" pb={2}>
							<Text>{score || 0}/30</Text>
							<Text cursor="pointer" onClick={() => router.push("/profile")}>
								My Rank: #{rank || "--"}
							</Text>
						</Flex>
					</VStack>
				</Box>
			</VStack>

			<Button
				marginTop="25px"
				leftIcon={<BsFillLightningChargeFill />}
				size="md"
				w="100%"
				minHeight="44px"
				fontWeight="600"
				borderRadius={8}
				background="#357E7F"
				color="white"
				padding="10px 20px"
				isDisabled={
					(nftLevel === 1 && score < 10) ||
					(nftLevel === 2 && score < 30) ||
					(nftLevel === 3 && score > 30)
				}
				onClick={() => {
					if (!userId) {
						setOpenConnectModal(true);
						return;
					}
					setIsSign.off();
					setIsLoading.off();
					setIsModalOpen.on();
					setIsSuccess("ready");
				}}
			>
				{mintText}
			</Button>
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

						<Text className="text-[20px] font-bold mb-2">
							You are claiming the badge of LV{level}{" "}
						</Text>

						{(level === 1 || level === 2) && (
							<Text
								className="text-[#FFA047] w-[350px] text-[13px] pb-8"
								lineHeight="18px"
							>
								Notice: You can upgrade to higher level after claiming，or
								directly claim higher level later.
							</Text>
						)}

						{isSign && (
							<Text fontSize="xs" color="gray.500">
								The transaction is expected to take about 1 minutes.
							</Text>
						)}
						<Button
							size="md"
							w="80%"
							marginBottom={"40px"}
							borderRadius="md"
							isLoading={isLoading}
							loadingText={isSign ? "Transaction Submitted" : "Please sign"}
							minHeight="44px"
							fontWeight="600"
							background="#357E7F"
							color="white"
							onClick={mint}
						>
							Confirm
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
							loadingText={isSign ? "Transaction Submitted" : "Please sign"}
							minHeight="44px"
							fontWeight="600"
							background="#357E7F"
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
