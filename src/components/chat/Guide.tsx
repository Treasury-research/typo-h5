import { Stack, VStack, Button, Box, Skeleton } from "@chakra-ui/react";
import { BsCommand } from "react-icons/bs";
import { BiWallet } from "react-icons/bi";

import { useEffect, useMemo, useState, useCallback } from "react";

import { useUserInfoStore } from "store/userInfoStore";
import useWallet from "hooks/useWallet";
import { useAccount } from "wagmi";
import { useStore } from "store";
import Logo from "components/icons/Logo";
import SignInIcon from "components/icons/SignIn";
import api from "api";
import useChatContext from "hooks/useChatContext";

const slides = [
	{
		url: "/images/moledao.png",
		link: "https://rewards.taskon.xyz/campaign/detail/13081",
	},
	{
		url: "/images/aisql/driver.png",
	},
	{
		url: "/images/aisql/knexus.webp",
		link: "https://knexus.xyz/create?utm_source=typo+quest&utm_campaign=kn+mbti",
	},
];

const sandboxSlides = [
	{
		url: "/images/aisql/driver.png",
	},
	{
		url: "/images/aisql/knexus.webp",
		link: "https://knexus.xyz/create?utm_source=typo+quest&utm_campaign=kn+mbti",
	},
];

export function Guide() {
	const { submitMessage } = useChatContext();
	const [commands, setCommands] = useState([]);
	const { userId } = useUserInfoStore();
	const { isConnected, address } = useAccount();
	const { openInviteModal, setOpenInviteModal } = useStore();
	const { handleSign, openConnectWallet, isSign } = useWallet();

	const needSign = isConnected && !userId;
	const list = slides;

	const cmds = commands.filter((item: any) => item?.type === "normal");

	// console.log(cmds);

	const getCommands = async () => {
		const result: any = await api.get("api/shortcut/questions");
		if (result?.code === 200) {
			setCommands(result?.data as any);
		}
	};

	const signUp = useCallback(() => {
		handleSign(address as string);
	}, [address]);

	useEffect(() => {
		if (needSign && isSign) {
			handleSign(address as string);
		}
	}, [needSign, isSign]);

	useEffect(() => {
		getCommands();
	}, [userId]);

	const runCommand = useCallback((text: any) => {
		submitMessage({
			question: text,
		});
	}, []);

	console.log("needSign", needSign, isConnected, userId);

	return (
		<VStack
			className="guide"
			w="full"
			h="full"
			justify="flex-start"
			alignItems="center"
		>
			<VStack
				w="full"
				justify="center"
				flexDir="column"
				spacing={5}
				mt="40px!"
				padding="0 30px"
			>
				<Box marginBottom="24px">
					<Logo />
				</Box>
				{cmds.length == 0 ? (
					<Stack width="full">
						<Skeleton
							h="40px"
							w="100%"
							startColor="#F3F3F3"
							endColor="#DFDFDF"
							borderRadius="8px"
						/>
						<Skeleton
							h="40px"
							w="100%"
							startColor="#F3F3F3"
							endColor="#DFDFDF"
							borderRadius="8px"
						/>
						<Skeleton
							h="40px"
							w="100%"
							startColor="#F3F3F3"
							endColor="#DFDFDF"
							borderRadius="8px"
						/>
					</Stack>
				) : (
					cmds.map((item: any, index) => {
						return (
							<Box
								key={index}
								background="white"
								minHeight="40px"
								whiteSpace="nowrap"
								display="flex"
								alignItems="center"
								width="100%"
								fontSize="14px"
								padding="10px 15px"
								onClick={() => runCommand(item.question)}
							>
								<Box>{item.question}</Box>
							</Box>
						);
					})
				)}

				{!userId && (
					<Box marginTop="20px" width="100%">
						<Button
							leftIcon={<SignInIcon />}
							size="md"
							w="100%"
							minHeight="44px"
							fontWeight="600"
							borderRadius={8}
							background="#357E7F"
							color="white"
							padding="10px 20px"
							onClick={() => {
								needSign ? handleSign(address as string) : openConnectWallet();
							}}
						>
							Sign in
						</Button>
					</Box>
				)}
				{!isConnected && !!userId && (
					<Box marginTop="20px" width="100%">
						<Button
							leftIcon={<SignInIcon />}
							size="md"
							w="100%"
							minHeight="44px"
							fontWeight="600"
							borderRadius={8}
							background="#357E7F"
							color="white"
							padding="10px 20px"
							onClick={() => {
								needSign ? handleSign(address as string) : openConnectWallet();
							}}
						>
							Connect Wallet
						</Button>
					</Box>
				)}
			</VStack>
		</VStack>
	);
}
