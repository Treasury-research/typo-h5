import {
	Box,
	Text,
	Flex,
	HStack,
	Icon,
	Button,
	Input,
	VStack,
	useToast,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef, useCallback } from "react";
import { ChatList } from "lib/types";
import { AiOutlineClear } from "react-icons/ai";
import PlusIcon from "components/icons/Plus";
import { RiCopperCoinLine, RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { useUserInfoStore } from "store/userInfoStore";
import { useStore } from "store";
import { Cell, Dialog, Popover } from "react-vant";
import useChatContext from "hooks/useChatContext";

export function Tabs() {
	const myTab = useRef<any>(null);
	const {
		isLoading,
		addChat,
		closeNav,
		allChatList,
		activeChat,
		setActiveChatId,
		removeChat,
		clearMessage,
		channel,
		section,
		isGenerate,
		updateChat,
	} = useChatContext();
	const showToast = useToast();
	const { userId } = useUserInfoStore();
	// console.log("allChatList", allChatList);

	const onScroll = () => {
		setTimeout(() => {
			myTab?.current &&
				myTab?.current?.scrollTo({
					top: 500,
					behavior: "smooth",
				});
		}, 100);
	};

	const addNewChat = useCallback(() => {
		if (isLoading || isGenerate) {
			showToast({
				position: "top",
				title: "Content is loading, please wait.",
				variant: "subtle",
			});
			return;
		}

		const timestamp = new Date().getTime();
		const time = new Date(timestamp).toLocaleTimeString();
		const newChatId = uuidv4();

		const newChat: any = {
			id: newChatId,
			timestamp: timestamp,
			type: "general",
			isSandBox: false,
			channel,
			messages: [],
			userId,
			section,
		};

		newChat.name = `New Chat ${time}`;

		addChat(newChat);
		setActiveChatId(newChat.id);
	}, [channel, userId, section]);

	return (
		<VStack w="full" h="full" pos="relative" spacing={0}>
			<HStack w="full" justify="space-between" px={4} my={3}>
				<Text w="full" fontSize="md" fontWeight="semibold">
					Chat
				</Text>
			</HStack>

			<VStack w="full" maxH="calc(100% - 50px)" alignItems="center">
				<Box
					w="full"
					ref={myTab}
					overflowY="scroll"
					className="no-scrollbar"
					alignItems="flex-start"
					px={4}
				>
					{allChatList?.length > 0 &&
						allChatList?.map((item: any, index: number) => {
							return (
								<Cell
									center
									key={index}
									title={
										<Flex id={`cell${index}`}>
											<Text fontSize="md" pl={1} pr={2}>
												#
											</Text>
											<Text
												flex={1}
												whiteSpace="nowrap"
												overflow="hidden"
												textOverflow="ellipsis"
												onClick={() => {
													setActiveChatId(item.id);
													closeNav();
												}}
											>
												{item.name}
											</Text>
										</Flex>
									}
									isLink
									border={false}
									style={{
										background:
											item?.id === activeChat?.id
												? "rgba(255, 255, 255, 0.4)"
												: "rgba(255, 255, 255, 0.15)",
										borderRadius: "5px",
										height: "42px",
										color: "#fff",
										marginBottom: "12px",
									}}
									rightIcon={
										<HStack color="#fff" fontSize="sm" pl={3}>
											<Icon
												as={FiEdit}
												boxSize={4}
												onClick={() => {
													if (isLoading || isGenerate) {
														showToast({
															position: "top",
															title: "Content is loading, please wait.",
															variant: "subtle",
														});
														return;
													}
													let channelName = "";
													Dialog.confirm({
														title: "Edit Title",
														closeable: true,
														confirmButtonText: "Confirm",
														cancelButtonText: "Cancel",
														message: (
															<Input
																w="100%"
																textAlign="left"
																placeholder={item.name}
																autoFocus
																onChange={(e: any) =>
																	(channelName = e.target.value)
																}
															/>
														),
														onConfirm: () => {
															updateChat(item.id, { name: channelName.trim() });
														},
													});
												}}
											/>

											<Icon
												as={AiOutlineClear}
												boxSize={4}
												onClick={() => {
													if (isLoading || isGenerate) {
														showToast({
															position: "top",
															title: "Content is loading, please wait.",
															variant: "subtle",
														});
														return;
													}
													Dialog.confirm({
														title: "Clear",
														confirmButtonText: "Confirm",
														cancelButtonText: "Cancel",
														message: "Are you sure to clear this chat?",
													}).then(() => {
														clearMessage(item.id);
														showToast({
															position: "top",
															title: "Cleared successfully",
															variant: "subtle",
														});
													});
												}}
											/>

											<Icon
												as={RiDeleteBinLine}
												boxSize={4}
												onClick={() => {
													if (isLoading || isGenerate) {
														showToast({
															position: "top",
															title: "Content is loading, please wait.",
															variant: "subtle",
														});
														return;
													}
													Dialog.confirm({
														title: "Delete",
														confirmButtonText: "Confirm",
														cancelButtonText: "Cancel",
														message: "Are you sure to delete this chat?",
													}).then(() => {
														// if (activeChat.id === item.id) {
														const leftChats = allChatList.map(
															(chat: any) => item.id === chat.id
														);
														if (leftChats && leftChats.length) {
															console.log("leftChats", leftChats);
															setActiveChatId(leftChats[0].id);
														}
														// }

														removeChat(item.id);
													});
												}}
											/>
										</HStack>
									}
								/>
							);
						})}
				</Box>
				<Button
					width="90%"
					mt="12px"
					borderRadius="8px"
					color="#487C7E"
					background="#FFE3AC"
					height="44px"
					display="flex"
					alignItems="center"
					justifyContent="center"
					fontWeight="500"
					marginBottom="20px"
					onClick={addNewChat}
				>
					<Box marginRight="8px">
						<PlusIcon />
					</Box>
					<Box>New Chat</Box>
				</Button>
			</VStack>
		</VStack>
	);
}
