import {
	Text,
	Flex,
	VStack,
	Container,
	useBoolean,
	useDisclosure,
	Box,
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
	const [showNav, setShowNav] = useBoolean(false);
	const [showQuest, setShowQuest] = useBoolean(false);
	const [isLoading, setIsLoading] = useBoolean(false);
	const [chatIndex, setChatIndex] = useState<number | null>(null);
	const [list, setList] = useState<ChatList[] | null>(null);
	const [input, setInput] = useState<string>();
	const [isSandBox, setIsSandBox] = useBoolean(false);
	const [sandBoxType, setSandBoxType] = useState("token2049");
	const { setOpenConnectModal } = useConnectModalStore();

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
			setTimeout(() => {
				const copyList = deepClone(list);
				myInput.current.addChannel(copyList);
			}, 300);
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

	useEffect(() => {
		if (!userId) {
			setOpenConnectModal(true);
			return;
		}
	}, [userId]);

	useEffect(() => {
		showNav
			? (document.body.style.background = "#000")
			: (document.body.style.background = "#fff");
	}, [showNav]);

	return (
		<>
			<NextSeo title={"TypoGraphy AI"} />
			<Container
				w="100vw"
				pr={0}
				pl={0}
				overflow="hidden"
				className="no-scrollbar"
			>
				<Flex
					w="180vw"
					h="full"
					className={showNav ? "move-left" : "move-right"}
				>
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
						closeNav={setShowNav.off}
					/>
					<VStack
						w="calc(100vw + 1px)"
						h="full"
						pos="relative"
						overflow="hidden"
						alignItems="flex-start"
					>
						<ChatTitle
							list={list || []}
							chatIndex={chatIndex || 0}
							isOpen={showQuest}
							showNav={showNav}
							onOpen={setShowQuest.on}
							openNav={setShowNav.on}
							closeNav={setShowNav.off}
							setIsSandBox={setIsSandBox}
						/>
						<VStack
							pt={1}
							w="full"
							h="calc(100% - 55px)"
							mt="0!"
							bg="#f4f5f6"
							alignItems="flex-start"
						>
							<ChatContent
								list={list || []}
								chatIndex={chatIndex}
								isLoading={isLoading}
								isSandBox={isSandBox}
								openNav={setShowNav.on}
								onSend={onSend}
								setList={setList}
								setInput={setInput}
								setChatIndex={setChatIndex}
							/>

							<ChatInput
								ref={myInput}
								list={list || []}
								input={input || ""}
								saveHistory={saveHistory}
								setInput={setInput}
								setList={setList}
								chatIndex={chatIndex}
								isLoading={isLoading}
								setIsLoading={setIsLoading}
								isSandBox={isSandBox}
								sandBoxType={sandBoxType}
								onOpen={setShowQuest.on}
								onClose={setShowQuest.off}
								openNav={setShowNav.on}
								setChatIndex={setChatIndex}
							/>
						</VStack>
					</VStack>
					<Quest isOpen={showQuest} onClose={setShowQuest.off} />
				</Flex>
			</Container>
		</>
	);
}
