import { Box, VStack } from "@chakra-ui/react";
import { ChatChildren, ChatList } from "lib/types";

import { Left } from "./LeftContent";
import { Error } from "./ErrorContent";
import { Right } from "./RightContent";
import { Guide } from "./../Guide";

import { useUserInfoStore } from "store/userInfoStore";

export function ChatContent({
	list,
	chatIndex,
	isLoading,
	setList,
	setInput,
	onSend,
	isSandBox,
	setChatIndex,
}: {
	list: ChatList[];
	isLoading: boolean;
	chatIndex: number | null;
	isSandBox: boolean;
	setChatIndex: (value: number | null) => void;
	setInput: (value: string) => void;
	onSend: (isReGenerate?: boolean) => void;
	setList: (value: ChatList[]) => void;
}) {
	const { userId } = useUserInfoStore();

	return (
		<Box
			w="full"
			pt={3}
			pb="50px"
			mb="15px"
			maxW="1000px"
			id="chat-content"
			className="no-scrollbar"
			h="calc(100% - 60px)"
			overflowY="scroll"
		>
			{userId &&
			chatIndex !== null &&
			list &&
			list.length > 0 &&
			list[chatIndex]?.children.length > 0 ? (
				<VStack
					w="full"
					justify="flex-start"
					alignItems="center"
					spacing={8}
					px={3}
					fontFamily="Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto"
				>
					{(list[chatIndex]?.children).map(
						(item: ChatChildren, index: number) => {
							return (
								<Box key={index} w="full">
									{item.type === "nl" ? (
										<Right
											list={list}
											item={item}
											chatIndex={chatIndex}
											isLoading={isLoading}
											index={index}
											setList={setList}
										/>
									) : item.error ? (
										<Error
											item={item}
											chatIndex={chatIndex}
											index={index}
											list={list}
											onSend={onSend}
											setList={setList}
											setInput={setInput}
										/>
									) : (
										<Left
											list={list}
											item={item}
											chatIndex={chatIndex}
											isLoading={isLoading}
											index={index}
											setList={setList}
											onSend={onSend}
											setInput={setInput}
										/>
									)}
								</Box>
							);
						}
					)}
				</VStack>
			) : (
				<Guide setInput={setInput} onSend={onSend} isSandBox={isSandBox} />
			)}
		</Box>
	);
}
