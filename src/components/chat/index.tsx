import React, { useEffect } from "react";
import { Box, Flex, VStack, Container, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import useChatContext from "hooks/useChatContext";
import { Menu } from "components/chat/menu";
import ChatContent from "components/chat/content";
import { ChatInput } from "components/chat/ChatInput";
import { useAccount } from "wagmi";
import { ChatTitle } from "components/chat/ChatTitle";
import { useUserInfoStore } from "store/userInfoStore";
import { Quest } from "components/chat/Quest";
import { Operate } from "./Operate";

const Chat = () => {
	const router = useRouter();
	const {
		setSection,
		setActiveChatId,
		getChat,
		loadChat,
		isLoading,
		showNav,
		closeNav,
		activeChat,
		closeQuest,
	} = useChatContext();
	const chatKey: any = router?.query?.chatKey || [];
	const [section, chatId] = chatKey;
	const { isConnected, address } = useAccount();
	const { userId } = useUserInfoStore();
	const showChat = activeChat?.messages?.length > 0;

	// console.log("chatKey", section, chatId);
	useEffect(() => {
		if (section) {
			setSection(section);
		}
	}, [section]);

	useEffect(() => {
		if (chatId) {
			if (getChat(chatId) && getChat(chatId).userId === userId) {
				setActiveChatId(chatId);
			} else {
				loadChat(chatId);
			}
		} else {
			setActiveChatId("");
		}
	}, [chatId]);

	useEffect(() => {
		if (!isConnected) {
			setActiveChatId("");
		}
	}, [isConnected]);

	return (
		<>
			<Operate>
				<Container
					w="100vw"
					pr={0}
					pl={0}
					overflow="hidden"
					h="calc(100vh - 55px)"
					className="container no-scrollbar"
					position="relative"
				>
					<Flex w="280vw" className={showNav ? "move-left" : "move-center"}>
						<Menu />
						<VStack
							w="100vw"
							h="full"
							pos="relative"
							className="chat-panel"
							overflow="hidden"
							alignItems="flex-start"
							bg="#f4f5f6"
							onClick={() => {
								showNav && closeNav();
							}}
							gap="0"
						>
							<ChatTitle />
							<VStack
								pt="60px"
								pb="5px"
								w="full"
								h="100%"
								mt="0!"
								bg="#f4f5f6"
								pointerEvents={showNav ? "none" : "auto"}
								alignItems="flex-start"
							>
								<ChatContent />
								<ChatInput />
							</VStack>
						</VStack>
						<Quest />
					</Flex>
				</Container>
			</Operate>
		</>
	);
};

export default Chat;
