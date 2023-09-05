import { Box, Icon, Flex, HStack, useBoolean } from "@chakra-ui/react";
import api from "api";
import {
	useImperativeHandle,
	forwardRef,
	useRef,
	useState,
	useEffect,
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
import { Audio } from "./Audio";
import { AiOutlineClear } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import useWeb3Context from "hooks/useWeb3Context";
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
			setInput: (value: string) => void;
			setList: (value: ChatList[]) => void;
			saveHistory: (value: ChatList[]) => void;
			setChatIndex: (value: number) => void;
		},
		ref: any
	) => {
		const { showToast } = useStore();
		const { userId } = useUserInfoStore();
		const myInput = useRef<any>(null);
		const myTip = useRef<any>(null);

		const [labelValue, setLabelValue] = useState("");
		const [isFocus, setIsFocus] = useBoolean(false);

		const [isComposition, setIsComposition] = useState(false);
		const { account } = useWeb3Context();
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

			if (!input) {
				showToast("Please enter your question.", "warning");
				return;
			}

			if (labelValue && !isAddress(labelValue, input)) {
				showToast("Please enter the correct address.", "warning");
				return;
			}

			if (chatIndex === null && list.length >= 10) {
				showToast(`Maximum 10 channels`, "warning");
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
							conversation_id: copyList[0]?.chatId,
							type: cmds.includes(cmd) ? cmdType : type,
							input: cmds.includes(cmd) ? cmdValue : prompt,
						},
					});
				} else {
					result = await api.post(`/api/conversation`, {
						personal_profile: {
							address: account,
						},
						conversation_id: copyList[0]?.chatId,
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
				showToast("Send message error!", "error");
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
			<HStack pos="relative" w="full" spacing={3} py={2} px={3}>
				<Audio input={input} setInput={setInput} boxSize={5} color="bg.green" />
				<Flex
					ml={3}
					flex={1}
					py="6px"
					px={2}
					borderWidth="1px"
					bg="bg.white"
					borderColor="bg.white"
					borderRadius={12}
					pos="relative"
					shadow="md"
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
					<HStack w="full" alignItems="flex-end" spacing={2}>
						<Icon
							as={AiOutlineClear}
							cursor="pointer"
							boxSize={6}
							ml="2px"
							mb="5px"
							color={input ? "black" : "gray.300"}
							onClick={() => setInput("")}
						/>
						<TextArea
							rows={1}
							ref={myInput}
							className="chat-input flex-1"
							placeholder="Use '/' to trigger commands"
							value={input}
							onChange={setInput}
							autoSize={{ maxHeight: 150 }}
							onCompositionStart={() => setIsComposition(true)}
							onCompositionEnd={() => setIsComposition(false)}
							onFocus={setIsFocus.on}
							onBlur={() =>
								setTimeout(() => {
									setIsFocus.off();
								}, 300)
							}
						/>
						<Flex h="full" alignItems="flex-end">
							{isLoading ? (
								<Box w="38px" mb={2}>
									<BeatLoader size={7} />
								</Box>
							) : (
								<HStack
									h="30px"
									w="30px"
									mb="2px"
									borderRadius={8}
									justify="center"
									alignItems="center"
									bg={input.trim() ? "black" : "gray.200"}
								>
									<Icon
										as={TbSend}
										color="bg.white"
										boxSize={5}
										cursor={input.trim() ? "pointer" : "not-allowed"}
										onClick={() => {
											if (input.trim()) {
												onSend();
											}
										}}
									/>
								</HStack>
							)}
						</Flex>
					</HStack>
				</Flex>
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
			</HStack>
		);
	}
);

ChatInput.displayName = "ChatInput";
