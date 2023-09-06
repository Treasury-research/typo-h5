import { Box, VStack, Text } from "@chakra-ui/react";
import { ChatChildren, ChatList } from "lib/types";

import { Left } from "./LeftContent";
import { Error } from "./ErrorContent";
import { Right } from "./RightContent";
import { Guide } from "./../Guide";

import { useUserInfoStore } from "store/userInfoStore";
import { useMemo } from "react";

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
	const showChat = useMemo(() => {
		return (
			userId &&
			chatIndex !== null &&
			list &&
			list.length > 0 &&
			list[chatIndex]?.children.length > 0
		);
	}, [userId, chatIndex, list, chatIndex]);

	return (
		<>
			{showChat && (
				<Text
					pos="fixed"
					top="63px"
					fontSize="xs"
					bg="blackAlpha.100"
					px={2}
					py="2px"
					borderRadius={3}
					zIndex={5}
				>
					{(list && list[chatIndex || 0]?.name) || "Title"}
				</Text>
			)}

			<Box
				w="full"
				mt="35px!"
				mb="20px!"
				pb="50px"
				className="no-scrollbar"
				id="chat-content"
				h="calc(100% - 90px)"
				overflowY="scroll"
			>
				{showChat ? (
					<VStack
						pos="relative"
						w="full"
						justify="flex-start"
						alignItems="center"
						spacing={8}
						mt={3}
						px={3}
						fontFamily="Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto"
					>
						{(list[chatIndex || 0]?.children).map(
							(item: ChatChildren, index: number) => {
								return (
									<Box key={index} w="full">
										{item.type === "nl" ? (
											<Right
												list={list}
												item={item}
												chatIndex={chatIndex || 0}
												isLoading={isLoading}
												index={index}
												setList={setList}
											/>
										) : item.error ? (
											<Error
												item={item}
												chatIndex={chatIndex || 0}
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
												chatIndex={chatIndex || 0}
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
		</>
	);
}
