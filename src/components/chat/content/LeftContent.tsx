import { useMemo, useCallback } from "react";
import {
	Box,
	HStack,
	VStack,
	Avatar,
	Icon,
	useBoolean,
	useToast,
} from "@chakra-ui/react";
import { ChatChildren, ChatList } from "lib/types";
import { AiFillCaretLeft } from "react-icons/ai";
import { Operate } from "../Operate";
import { Markdown } from "components/chat/templates/Markdown";
import MoreIcon from "components/icons/More";
import { Profile } from "components/chat/templates/Profile";
import { Ens } from "components/chat/templates/Ens";
import { Poap } from "components/chat/templates/Poap";
import { Snapshot } from "components/chat/templates/Snapshot";
import { Uniswap } from "components/chat/templates/Uniswap";
import { Goplus } from "components/chat/templates/Goplus";
import useChatContext from "hooks/useChatContext";
import { BsSearch } from "react-icons/bs";
import Search from "../templates/Search";

export function Left({
	chatId,
	messageId,
	item,
	index,
	chatIndex,
	isLast,
	isHidden,
	isPrivateHead,
	isLoading,
}: any) {
	const {
		setInput,
		submitMessage,
		activeChat,
		setTotalCoupon,
		setDailyAdd,
		updateMessage,
		channel,
		isGenerate,
		isActionSheetOpen,
		setIsActionSheetOpen,
		actionSheetProps,
		setActionSheetProps,
	} = useChatContext();
	const [isOpen, setIsOpen] = useBoolean(false);
	const showToast = useToast();

	const showQuoteIndex = useMemo(() => {
		return activeChat.messages.findLastIndex(
			(t: any) =>
				t.tool == "search" || t.tool == "fix_reply" || t.tool == "chat"
		);
	}, [activeChat?.messages]);

	const openMessageActionSheet = useCallback(() => {
		setActionSheetProps({
			item,
			index,
			chatIndex: chatIndex,
			type: "message",
		});
		setIsActionSheetOpen.on();
	}, [item, index]);

	return (
		<VStack>
			<HStack
				key={index}
				w="full"
				justify="flex-start"
				alignItems="flex-start"
				spacing={3}
				mb={3}
			>
				<Avatar size="sm" src="/images/aisql/TypoGraphy.svg" mr={1} />
				<Box
					pos="relative"
					className={`ai-left-content-width ${
						item.tool === "uniswap" ? "uniswap" : ""
					}`}
					maxW="calc(100% - 90px)"
				>
					<Icon
						as={AiFillCaretLeft}
						boxSize={4}
						pos="absolute"
						left="-11.5px"
						top="9px"
						color="bg.white"
					/>
					<VStack
						key={index}
						className="chat-left-content"
						pos="relative"
						spacing={3}
						px="5px"
						pb="8px"
						minH="35px"
						maxW="full"
						w="fit-content"
						pt={2}
						justify="flex-start"
						alignItems="flex-start"
						bg="bg.white"
						borderRadius={5}
						position="relative"
						paddingRight="20px"
					>
						<Box
							position="absolute"
							right="0px"
							top="10px"
							onClick={openMessageActionSheet}
						>
							<MoreIcon />
						</Box>
						{item.tool && item.tool === "profile" ? (
							<Profile content={item.content} />
						) : item.tool === "ens" ? (
							<Ens content={item.content} />
						) : item.tool === "poap" ? (
							<Poap content={item.content} />
						) : item.tool === "snapshot" ? (
							<Snapshot content={item.content} />
						) : item.tool === "goplus" ? (
							<Goplus content={item.content} />
						) : item.tool === "uniswap" ? (
							<Uniswap content={item.content} />
						) : item.tool === "search" ? (
							<Search
								item={item}
								isLast={isLast}
								done={item.done}
								sources={item.sourceList}
								content={item.content}
								submitMessage={submitMessage}
								setInput={setInput}
								showQuoteIndex={showQuoteIndex}
								index={index}
							/>
						) : (
							<Markdown value={item.content as string} />
						)}
					</VStack>
				</Box>
			</HStack>
			<div className="flex w-full gap-2">
				<div className="w-[52px]"></div>
				{item.relatedQuestion && item.relatedQuestion.length > 0 && (
					<Box maxW="calc(100% - 88px)" ml={-4}>
						{item.relatedQuestion.map((t: any, i: number) => (
							<Box
								key={i}
								className={`text-[#487C7E] bg-[#DAE5E5] rounded-[12px] py-2 font-bold flex items-start px-3 w-[fit-content] mt-[10px] mr-[4px] ${
									isGenerate
										? "opacity-50 cursor-not-allowed"
										: "cursor-pointer"
								} hover:opacity-70`}
								onClick={() => {
									if (isGenerate) {
										return;
									}
									if (activeChat && activeChat.isShare) {
										showToast({
											position: "top",
											title: "Please start your thread",
											variant: "subtle",
											status: "info",
										});
										return;
									}
									submitMessage({
										isRelationsQuestion: channel !== "magicWand",
										question: t,
									});
								}}
							>
								{channel !== "magicWand" ? (
									<Icon
										as={BsSearch}
										marginRight="6px"
										color="#487C7E"
										boxSize={4}
										mt="4px"
									/>
								) : null}
								{t}
							</Box>
						))}
					</Box>
				)}
			</div>
		</VStack>
	);
}
