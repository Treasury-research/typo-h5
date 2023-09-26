import {
	Box,
	Text,
	HStack,
	VStack,
	Avatar,
	Flex,
	Icon,
} from "@chakra-ui/react";

import { ChatChildren, ChatList } from "lib/types";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { Operate } from "../Operate";
import { AiFillCaretLeft } from "react-icons/ai";

export function Error({
	list,
	item,
	index,
	chatIndex,
	onSend,
	setList,
	setInput,
}: {
	item: ChatChildren;
	index: number;
	chatIndex: number;
	list: ChatList[];
	setInput: (value: string) => void;
	onSend: (isReGenerate?: boolean) => void;
	setList: (value: ChatList[]) => void;
}) {
	return (
		<HStack w="full" justify="flex-start">
			<Operate
				item={item}
				index={index}
				list={list}
				chatIndex={chatIndex}
				onSend={onSend}
				setList={setList}
				setInput={setInput}
			>
				<Avatar size="sm" src="/images/aisql/TypoGraphy.svg" mr={1} />
				<HStack
					key={index}
					bg="bg.white"
					px="12px"
					py="7px"
					w="220px"
					borderRadius={5}
					alignItems="center"
					pos="relative"
				>
					<Icon
						as={AiFillCaretLeft}
						boxSize={4}
						pos="absolute"
						left="-11.4px"
						top="9px"
						color="bg.white"
					/>
					<WarningTwoIcon color="red.500" />
					<Text whiteSpace="pre-wrap">{item.content as string}</Text>
				</HStack>
			</Operate>
		</HStack>
	);
}
