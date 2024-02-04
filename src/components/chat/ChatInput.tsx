import { Box, Icon, Flex, HStack, Button, useToast } from "@chakra-ui/react";
import api from "api";
import {
	useImperativeHandle,
	forwardRef,
	useRef,
	useState,
	useEffect,
	useMemo,
} from "react";
import { useConnectModalStore } from "store/modalStore";
import { Search2Icon } from "@chakra-ui/icons";
import { Input } from "react-vant";
import { BeatLoader } from "react-spinners";
import { commands } from "components/chat/TextAreaTips";
import { useChatStore } from "store/chatStore";
import { useJwtStore } from "store/jwtStore";
import { useUserInfoStore } from "store/userInfoStore";
import useChatContext from "hooks/useChatContext";
import { useQuoteStore } from "store/quoteStore";
import { QuoteTem } from "./QuoteTem";
import { useRouter } from "next/router";
import { FiSend } from "react-icons/fi";

const { TextArea } = Input;

export const ChatInput = () => {
	const {
		input,
		isLoading,
		setIsLoading,
		allChatList,
		setInput,
		onScroll,
		submitMessage,
		setIsFocus,
		activeChat,
		section,
		addChat,
		setActiveChatId,
	} = useChatContext();
	const router = useRouter();
	// console.log(activeChat);

	const {
		isShowInputQuote,
		quoteContent,
		quoteType,
		setIsShowInputQuote,
		setQuoteContent,
		setQuoteType,
		isCopilot,
		setIsCopilot,
		setClickList,
		clickList,
	} = useQuoteStore();

	const showToast = useToast();
	const { userId, account } = useUserInfoStore();
	const { jwt, setJwt } = useJwtStore();
	const myInput = useRef<any>(null);
	const myTip = useRef<any>(null);
	const [isComposition, setIsComposition] = useState(false);
	const { searchLimit, setSearchLimit } = useChatStore();
	const { setOpenRemindModal, setOpenConnectModal } = useConnectModalStore();

	const onPressEnter = (e: any) => {
		console.log("onPressEnter", e);
		if (!e.shiftKey && e.key === "Enter") {
			e.preventDefault();

			if (!isComposition && input.trim()) {
				if (
					!userId &&
					commands.findIndex((item) => input.trim().includes(item)) > -1
				) {
					setOpenConnectModal(true);
					return;
				}
				submitMessage();
			}
		}
	};

	const inputFocus = () => {
		myInput.current.focus();
	};

	useEffect(() => {
		if (!userId) {
			return;
		}
		setIsLoading.off();
		setInput("");
		onScroll(1000);
	}, [userId]);

	return (
		<HStack
			pos="relative"
			w="full"
			// bg="blackAlpha.50"
			spacing={0}
			py={2}
			px={4}
			// borderColor="blackAlpha.50"
			// borderTopWidth="1px"
			gap={3}
		>
			{!activeChat?.isShare ? (
				<Flex
					boxShadow="2px 2px 6px 0px rgba(0, 0, 0, 0.12), -2px -2px 6px 0px rgba(255, 255, 255, 0.90)"
					flex={1}
					pl={3}
					pr={3}
					pt="6px"
					pb="3px"
					bg="bg.white"
					borderRadius={8}
					pos="relative"
					shadow="md"
					alignItems="center"
					position="relative"
				>
					<Box
						display="flex"
						flex="1"
						flexDirection="column"
						marginRight="auto"
					>
						{isShowInputQuote && section !== "magicWand" && (
							<Box className="my-2 mr-2 w-[fit-content]">
								<QuoteTem
									content={quoteContent}
									showDeleteIcon={true}
									type={quoteType}
								/>
							</Box>
						)}
						<TextArea
							rows={1}
							ref={myInput}
							className="chat-input m-h-[40px] flex-1 no-scrollbar"
							placeholder="You can ask me anything!"
							value={input}
							onChange={setInput}
							readOnly={isLoading}
							autoSize={{ maxHeight: 150 }}
							onFocus={setIsFocus.on}
							// onPressEnter={onPressEnter}
							onKeyDown={(e: any) => {
								if (e.code === "ArrowUp" || e.code === "ArrowDown") {
									myTip.current.popupKeyUp(e.code);
								} else if (e.code === "Enter") {
									onPressEnter(e);
									setTimeout(() => {
										myInput.current.focus();
									});
								}
							}}
							onBlur={() =>
								setTimeout(() => {
									setIsFocus.off();
								}, 300)
							}
						/>
					</Box>
					<HStack
						h="32px"
						minW="35px"
						padding="0 4px"
						mb={1}
						mr="2px"
						borderRadius={8}
						justify="center"
						alignItems="center"
						shadow={isLoading ? "" : "md"}
						bg={input.trim() ? "black" : isLoading ? "" : "gray.300"}
					>
						{!isLoading && (
							<Flex
								alignItems="center"
								justifyContent="center"
								onClick={() => {
									if (input.trim()) {
										submitMessage();
									}
								}}
							>
								{isShowInputQuote ? (
									<Icon as={FiSend} boxSize={5} color="gray.200" />
								) : (
									<>
										<Box height="100%" w="20px" ml={1}>
											<Search2Icon color="#fff" />
										</Box>
										{userId && (
											<Box
												pl="2px"
												pr="4px"
												color="white"
												fontSize="13px"
												fontWeight="500"
											>
												{`(${searchLimit}/30)`}
											</Box>
										)}
									</>
								)}
							</Flex>
						)}
						{isLoading && (
							<Box
								w="38px"
								mb={1}
								height="100%"
								display="flex"
								alignItems="center"
								justifyContent="center"
							>
								<BeatLoader size={7} />
							</Box>
						)}
					</HStack>
				</Flex>
			) : (
				<Button
					size="md"
					w="100%"
					minHeight="44px"
					fontWeight="600"
					borderRadius={8}
					background="#357E7F"
					color="white"
					padding="10px 20px"
					onClick={() => {
						activeChat.isShare = false;
						addChat(activeChat);
						router.push("/explorer");
						setTimeout(() => {
							setActiveChatId(activeChat.id);
						}, 300);
					}}
				>
					Start your thread
				</Button>
			)}

			{userId && allChatList && allChatList.length && (
				<Box
					pos="absolute"
					w="full"
					top="-60px"
					left="0px"
					h="40px"
					bgImg="url('/images/aisql/gradient.png')"
					bgRepeat="repeat"
					borderRadius={10}
				/>
			)}
		</HStack>
	);
};

ChatInput.displayName = "ChatInput";
