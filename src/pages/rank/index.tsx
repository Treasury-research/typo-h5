import React, { useEffect, useMemo, useState } from "react";
import {
	Box,
	Icon,
	Flex,
	VStack,
	Container,
	useToast,
	UnorderedList,
	ListItem,
	Text,
	Button,
	HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import useChatContext from "hooks/useChatContext";
import { CgArrowTopRight } from "react-icons/cg";
import { useUserInfoStore } from "store/userInfoStore";
import ChatProvider from "components/chat/Context";
import { NavBar, Tabs, Badge, Overlay } from "react-vant";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import Logo from "components/icons/Logo";
import { NftCard } from "components/rank/NftCard";
import { ConnectModal } from "components";
import { useBoolean } from "react-use";
import { inWechat, isPhone } from "lib";

const Chat = () => {
	const router = useRouter();
	const { closeNav } = useChatContext();
	const { userId, score, nftLevel } = useUserInfoStore();
	const [isWechat, setIsWechat] = useState(false);
	// console.log("isWechat", isWechat);

	useEffect(() => {
		setIsWechat(inWechat());
	}, []);

	useEffect(() => {
		const isphone = isPhone();
		// console.log("isphone", isphone);
		if (!isphone && !location.host.includes("localhost")) {
			location.host.includes("staging")
				? router.push("https://typography.staging.knn3.xyz/rank")
				: router.push("https://app.typox.ai/rank");
		}
	}, [router]);

	return (
		<ChatProvider>
			<Container
				w="100vw"
				h="100vh"
				px={0}
				overflow="hidden"
				className="container no-scrollbar"
				position="relative"
			>
				<VStack
					w="full"
					h="full"
					pos="relative"
					overflow="hidden"
					alignItems="flex-start"
					bg="#f4f5f6"
					gap="0"
				>
					{/* <Box w="full" h="55px">
						<NavBar
							className="nav-bar"
							title={
								<Tabs type="jumbo" color="#000">
									<Tabs.TabPane title="TypoX AI Fans NFT" />
								</Tabs>
							}
							leftText={
								<Icon
									className="chat-menu"
									as={ChevronLeftIcon}
									boxSize={6}
									mr={3}
									ml={1}
									onClick={() => router.push("/")}
								/>
							}
						/>
					</Box> */}

					<VStack
						flex={1}
						pt="40px"
						w="full"
						h="100%"
						bg="#f4f5f6"
						overflowX="hidden"
						overflowY="auto"
					>
						<Box onClick={() => router.push("/")}>
							<Logo />
						</Box>

						<Box w="84%" minW="330px" pt="40px">
							<NftCard />
						</Box>
						<UnorderedList
							w="full"
							px={10}
							pt="30px"
							color="#575B66"
							fontSize="13px"
							lineHeight="18px"
							spacing={3}
						>
							<ListItem>
								<b style={{ color: "#000" }}>280K+</b> users are now eligible to
								claim the TypoX AI Fans NFT. You can also claim one by signing
								in now.
							</ListItem>
							<ListItem>
								For detailed insights into your loyalty score and ranking, we
								advise accessing the platform via a desktop or laptop computer.
							</ListItem>
							<ListItem>
								Elevate your NFT level by accumulating loyalty score through
								interactions with TypoX AI or pass redemption.{" "}
								<b style={{ color: "#000" }}>
									Check your profile via a computer for more details.
								</b>
							</ListItem>
						</UnorderedList>
					</VStack>
				</VStack>
				<ConnectModal />
			</Container>
			{isWechat && (
				<Flex
					zIndex={5}
					pos="absolute"
					bg="rgba(0,0,0,.7)"
					top="0"
					bottom={0}
					w="100vw"
					h="100vh"
					justify="center"
				>
					<Box
						shadow="md"
						borderRadius="md"
						w="88%"
						h="50px"
						bg="rgba(255,255,255,.65)"
						// border="solid 1px red"
						textAlign="center"
						lineHeight="50px"
						mt="40px"
					>
						<HStack
							color="#000"
							fontSize="17px"
							fontWeight="600"
							justify="center"
              whiteSpace="nowrap"
						>
							<Text>Please open in a browser</Text>
							<Icon as={CgArrowTopRight} color="#000" boxSize={5} />
						</HStack>
					</Box>
				</Flex>
			)}
		</ChatProvider>
	);
};

export default Chat;
