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

	console.log("showNav", showNav);

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
			<Container w="100vw" pr={0} pl={0}>
				<Flex
					w="180vw"
					h="full"
					className={showNav ? "move-left" : "move-right"}
				>
					<Menu
						showNav={showNav}
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
							setShowNav={setShowNav}
							setIsSandBox={setIsSandBox}
						/>
						<VStack
							pt={1}
							w="full"
							h="full"
							mt="0!"
							bg="#f4f5f6"
							alignItems="flex-start"
						>
							<ChatContent
								list={list || []}
								chatIndex={chatIndex}
								isLoading={isLoading}
								isSandBox={isSandBox}
								setShowNav={setShowNav}
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
								onOpen={setShowQuest.on}
								onClose={setShowQuest.off}
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
