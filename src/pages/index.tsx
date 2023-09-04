import {
	Text,
	Flex,
	VStack,
	Container,
	useBoolean,
	useDisclosure,
	Image,
} from "@chakra-ui/react";
import { ChatList } from "lib/types";
import { ChatInput, NextSeo, ChatTitle, ChatContent, Quest } from "components";
import { useConnectModalStore } from "store/modalStore";
import { useState, useEffect, useRef, useMemo } from "react";
import { useUserInfoStore } from "store/userInfoStore";
import { deepClone, isPhone } from "lib";
import { useJwtStore } from "store/jwtStore";
import { Menu } from "components/ai/menu";
import { useRouter } from "next/router";

export default function Home() {
	const router = useRouter();
	const myInput = useRef<any>(null);
	const { tab } = router?.query;
	const { userId } = useUserInfoStore();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isLoading, setIsLoading] = useBoolean(false);
	const [chatIndex, setChatIndex] = useState<number | null>(null);
	const [list, setList] = useState<ChatList[] | null>(null);
	const [input, setInput] = useState<string>();
	const [isSandBox, setIsSandBox] = useBoolean(true);
	const [sandBoxType, setSandBoxType] = useState("token2049");
	const { setOpenConnectModal } = useConnectModalStore();

	// console.log("tab", tab, isSandBox);

	const localName = useMemo(() => {
		return isSandBox ? "sandbox" : "records";
	}, [isSandBox]);

	const onSend = (isRegenerate?: boolean, isNewChat?: boolean) => {
		if (myInput.current) {
			setTimeout(() => {
				myInput.current.onSend(isRegenerate, isNewChat);
			}, 300);
		}
	};

	const addChannel = () => {
		if (myInput.current) {
			const copyList = deepClone(list);
			myInput.current.addChannel(copyList);
		}
	};

	const saveHistory = (data: ChatList[]) => {
		const history = JSON.parse(localStorage.getItem(localName) || "{}") || {};
		history[userId] = data;

		localStorage.setItem(localName, JSON.stringify(history));
	};

	const getHistory = () => {
		const history = JSON.parse(localStorage.getItem(localName) || "{}") || {};
		setList(history[userId] || []);
	};

	useEffect(() => {
		if (userId) {
			getHistory();
		}
	}, [userId, localName]);

	useEffect(() => {
		if (list) {
			saveHistory(list);
		}
	}, [list]);

	// useEffect(() => {
	// 	tab === "sandbox" ? setIsSandBox.on() : setIsSandBox.off();
	// }, [tab]);

	useEffect(() => {
		if (!userId) {
			setOpenConnectModal(true);
			return;
		}

		// onOpen();
	}, [userId]);

	return (
		<>
			<NextSeo title={"TypoGraphy AI"} />
			<Container className="ai-page" maxW="full" pr={0} pl={0}>
				<Flex w="full" h="full">
					<Menu
						list={list || []}
						chatIndex={chatIndex}
						isSandBox={isSandBox}
						sandBoxType={sandBoxType}
						setChatIndex={setChatIndex}
						setList={setList}
						setInput={setInput}
						addChannel={addChannel}
						setSandBoxType={setSandBoxType}
						setIsSandBox={setIsSandBox}
					/>
					<VStack className="ai-chat flex-1 w-full h-full relative mr-2">
						<ChatTitle
							list={list || []}
							chatIndex={chatIndex || 0}
							onOpen={onOpen}
							isOpen={isOpen}
						/>
						<VStack
							overflow="hidden"
							bg="blackAlpha.100"
							borderTopRadius={15}
							className="p-6 w-full h-full chat-panel"
						>
							<ChatContent
								list={list || []}
								chatIndex={chatIndex}
								isLoading={isLoading}
								isSandBox={isSandBox}
								onSend={onSend}
								setList={setList}
								setInput={setInput}
								setChatIndex={setChatIndex}
							/>

							<ChatInput
								ref={myInput}
								list={list || []}
								input={input || ""}
								chatIndex={chatIndex}
								isLoading={isLoading}
								setIsLoading={setIsLoading}
								isSandBox={isSandBox}
								sandBoxType={sandBoxType}
								saveHistory={saveHistory}
								setInput={setInput}
								setList={setList}
								onOpen={onOpen}
								onClose={onClose}
								setChatIndex={setChatIndex}
							/>
						</VStack>
					</VStack>
					<Quest isOpen={isOpen} onClose={onClose} />
				</Flex>
			</Container>
		</>
	);
}
