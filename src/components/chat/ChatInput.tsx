import {
	Box,
	Icon,
	Flex,
	HStack,
	useBoolean,
	useToast,
} from "@chakra-ui/react";
import api from "api";
import {
	useImperativeHandle,
	forwardRef,
	useRef,
	useState,
	useEffect,
	useMemo,
} from "react";

import { Search2Icon } from "@chakra-ui/icons";
import { Input } from "react-vant";
import { BeatLoader } from "react-spinners";
import { commands } from "components/chat/TextAreaTips";
import { useAiStore } from "store/aiStore";
import { useJwtStore } from "store/jwtStore";
import { useUserInfoStore } from "store/userInfoStore";
import useChatContext from "hooks/useChatContext";
import { useQuoteStore } from "store/quoteStore";
import { QuoteTem } from "./QuoteTem";

const { TextArea } = Input;

export const ChatInput = () => {
	const {
		input,
		isLoading,
		setIsLoading,
		allChatList,
		sandBoxType,
		setInput,
		openNav,
		onScroll,
		submitMessage,
		isFocus,
		setIsFocus,
		labelValue,
		setLabelValue,
		section,
	} = useChatContext();

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
	const { searchLimit, setSearchLimit } = useAiStore();

	const onPressEnter = (e: any) => {
		console.log("onPressEnter", e);
		if (!e.shiftKey && e.key === "Enter") {
			e.preventDefault();

			if (!isComposition && input.trim()) {
				if (
					!userId &&
					commands.findIndex((item) => input.trim().includes(item)) > -1
				) {
					showToast({
						position: "top",
						title: `You're not logged in yet.`,
						variant: "subtle",
						status: "warning",
					});
					// setOpenConnectModal(true);
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
				<Box display="flex" flex="1" flexDirection="column" marginRight="auto">
					<TextArea
						rows={1}
						ref={myInput}
						minHeight="40px"
						className="chat-input flex-1 no-scrollbar"
						placeholder="You can ask me anything!"
						value={input}
						onChange={setInput}
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
					{isShowInputQuote && section !== "magicWand" && (
						<Box className="mt-2 w-[fit-content]" marginBottom="4px">
							<QuoteTem
								content={quoteContent}
								showDeleteIcon={true}
								type={quoteType}
							/>
						</Box>
					)}
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
							<Box height="100%" w="20px" ml={1}>
								<Search2Icon color="#fff" />
							</Box>
							<Box
								pl="2px"
								pr="4px"
								color="white"
								fontSize="sm"
							>{`(${searchLimit}/30)`}</Box>
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
