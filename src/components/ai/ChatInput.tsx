import { Box, Icon, Flex, HStack, useBoolean } from "@chakra-ui/react";
import api from "api";
import {
	useImperativeHandle,
	forwardRef,
	useRef,
	useState,
	useEffect,
	useMemo,
} from "react";
import { TbSend } from "react-icons/tb";
import { useStore } from "store";
import { ChatList } from "lib/types";
import {
	deepClone,
	getShortcutByprompt,
	isAddress,
	isShortcut,
	upFirst,
} from "lib";
import { Input } from "react-vant";
import { BeatLoader } from "react-spinners";
import { TextAreaTips, commands } from "components";
import { v4 as uuidv4 } from "uuid";
import { useAiStore } from "store/aiStore";
import { useUserInfoStore } from "store/userInfoStore";

const { TextArea } = Input;

export const ChatInput = forwardRef(
	(
		{
			chatIndex,
			input,
			isLoading,
			setIsLoading,
			list,
			isSandBox,
			sandBoxType,
			setInput,
			setList,
			saveHistory,
			setChatIndex,
			onOpen,
			onClose,
			openNav,
		}: {
			chatIndex: number | null;
			input: string;
			isLoading: boolean;
			isSandBox: boolean;
			sandBoxType: string;
			list: ChatList[];
			setIsLoading: any;
			onOpen: () => void;
			onClose: () => void;
			openNav: () => void;
			setInput: (value: string) => void;
			setList: (value: ChatList[]) => void;
			saveHistory: (value: ChatList[]) => void;
			setChatIndex: (value: number) => void;
		},
		ref: any
	) => {
		const { showToast } = useStore();
		const { userId, account } = useUserInfoStore();
		const myInput = useRef<any>(null);
		const myTip = useRef<any>(null);
		const [labelValue, setLabelValue] = useState("");
		const [isFocus, setIsFocus] = useBoolean(false);

		const { setTotalCoupon, setUsedCoupon } = useAiStore();

		// console.log("chatIndex", chatIndex);
		useImperativeHandle(ref, () => ({
			onSend: onSend,
			addChannel: addChannel,
		}));

		const onSend = (isReGenerate?: boolean) => {
			if (isLoading) {
				showToast("Please wait, AI is generating the answer.", "warning");
				return;
			}

			if (!userId) {
				showToast("You're not logged in yet.", "warning");
				return;
			}

			if (!input) {
				showToast("Please enter your question.", "warning");
				return;
			}

			if (labelValue && !isAddress(labelValue, input)) {
				showToast("Please enter the correct address.", "warning");
				return;
			}

			if (chatIndex === null && list.length >= 10) {
				showToast(`Maximum channels reached. Pick or delete one.`, "warning");
				openNav();
				return;
			}

			const copyList = deepClone(list);
			const chat_index =
				copyList.length === 0
					? 0
					: chatIndex === null
					? copyList.length
					: chatIndex;

			(copyList.length === 0 || chatIndex === null) && addChannel(copyList);
			addChatRight(copyList, chat_index, isReGenerate);
			addChatLeft(copyList, chat_index);
		};

		const addChannel = (copyList: ChatList[]) => {
			if (!userId) {
				showToast("You're not logged in yet.", "warning");
				return;
			}
			const timestamp = new Date().getTime();
			const chat_index = copyList.length === 0 ? 0 : copyList.length;
			const time = new Date(timestamp).toLocaleTimeString();

			copyList[chat_index] = {
				timestamp: timestamp,
				chatId: uuidv4(),
				type: isSandBox ? sandBoxType : "general",
				isSandBox: isSandBox,
				name: isSandBox
					? `${upFirst(sandBoxType).toUpperCase()} Chat${" "}${chat_index + 1}`
					: `New Chat ${time}`,
				children: [],
			};

			setChatIndex(chat_index);
			setList(copyList);
		};

		const addChatRight = (
			copyList: ChatList[],
			chat_index: number,
			isReGenerate?: boolean
		) => {
			if (!isReGenerate) {
				const prompt = input.trim() + (labelValue ? ` ${labelValue}` : "");
				copyList[chat_index]?.children.push({
					content: prompt,
					createTime: new Date().getTime(),
					type: "nl",
					submit: false,
				});

				console.log("copyList", copyList);

				setInput("");
				setLabelValue("");
				setList(copyList);
				saveHistory(copyList);
				onScroll(600);
			}
		};

		const addChatLeft = async (copyList: ChatList[], chat_index: number) => {
			try {
				setIsLoading.on();
				let result: any;
				const prompt = input.trim() + (labelValue ? ` ${labelValue}` : "");
				const type = copyList[chat_index].type;
				const { cmd, cmdType, cmdValue } = getShortcutByprompt(prompt);
				const cmds = commands.map((str) => str.toLowerCase());

				if (isShortcut(prompt) || (isSandBox && type === "token2049")) {
					result = await api.get(`/api/shortcut`, {
						params: {
							conversation_id: copyList[chat_index]?.chatId,
							type: cmds.includes(cmd) ? cmdType : type,
							input: cmds.includes(cmd) ? cmdValue : prompt,
						},
					});
				} else {
					result = await api.post(`/api/conversation`, {
						personal_profile: {
							address: account,
						},
						conversation_id: copyList[chat_index]?.chatId,
						input_prompt: prompt,
						isSandbox: isSandBox,
					});
				}

				setIsLoading.off();
				if (result.code === 200) {
					copyList[chat_index].children[
						copyList[chat_index].children.length - 1
					].id = result?.data?.id;

					copyList[chat_index].children.push({
						type: "result",
						id: result?.data?.id,
						submit: false,
						content: result?.data?.content,
						tool: result?.data?.tool,
						createTime: new Date().getTime(),
					});

					setTotalCoupon(result.data.totalCoupon);
					setUsedCoupon(result.data.usedCoupon);
				} else {
					if (result?.data?.code === 1003) {
						onOpen();
					}
					copyList[chat_index].children.push({
						type: "result",
						id: result?.data?.id,
						error: (result && result.data?.errorMsg) || "Send message error!",
						content: (result && result.data?.errorMsg) || "Send message error!",
						createTime: new Date().getTime(),
					});
				}

				setInput("");
				setList(copyList);
				onScroll(400);
				saveHistory(copyList);
			} catch (error: any) {
				console.log(error);
				copyList[chat_index]?.children.push({
					type: "result",
					error: "Send message error!",
					content: "Send message error!",
					createTime: new Date().getTime(),
				});

				setIsLoading.off();
				setInput("");
				setList(copyList);
				saveHistory(copyList);
				showToast(
					"Unknown exception, create a channel and try again.",
					"danger"
				);
				onScroll(400);
			}
		};

		const onScroll = (timer: number) => {
			setTimeout(() => {
				const chatContent = document.getElementById("chat-content");
				chatContent &&
					chatContent?.scrollTo({
						top: 50000,
						behavior: "smooth",
					});
			}, timer);
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
				bg="blackAlpha.50"
				spacing={0}
				py={2}
				px={4}
				borderColor="blackAlpha.50"
				borderTopWidth="1px"
				gap={3}
			>
				<TextAreaTips
					ref={myTip}
					isFocus={isFocus}
					labelValue={labelValue}
					input={input}
					isLoading={isLoading}
					onSend={onSend}
					setLabelValue={setLabelValue}
					inputFocus={inputFocus}
					setInput={setInput}
				/>
				<Flex
					flex={1}
					px={2}
					pt="6px"
					pb="2px"
					bg="bg.white"
					borderRadius={8}
					pos="relative"
					shadow="md"
					alignItems="center"
				>
					<TextArea
						rows={1}
						ref={myInput}
						className="chat-input flex-1 no-scrollbar"
						placeholder="Use '/' to trigger commands"
						value={input}
						onChange={setInput}
						autoSize={{ maxHeight: 150 }}
						onFocus={setIsFocus.on}
						onKeyDown={(e: any) => {
							if (!e.shiftKey && e.key === "Enter" && input.trim()) {
								onSend();
							}
						}}
						onBlur={() =>
							setTimeout(() => {
								setIsFocus.off();
							}, 300)
						}
					/>
					<Flex h="full" alignItems="flex-end">
						{isLoading && (
							<Box w="38px" mb={1}>
								<BeatLoader size={7} />
							</Box>
						)}
					</Flex>
				</Flex>
				<HStack
					h="33px"
					w="33px"
					ml={2}
					borderRadius={8}
					justify="center"
					alignItems="center"
					shadow="md"
					bg={input.trim() ? "black" : "gray.300"}
				>
					<Icon
						as={TbSend}
						color="bg.white"
						boxSize={5}
						onClick={() => {
							if (input.trim()) {
								onSend();
							}
						}}
					/>
				</HStack>
				{userId &&
					chatIndex !== null &&
					list &&
					list.length > 0 &&
					list[chatIndex]?.children.length > 0 && (
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
	}
);

ChatInput.displayName = "ChatInput";
