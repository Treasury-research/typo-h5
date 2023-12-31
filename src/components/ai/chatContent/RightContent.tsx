import {
	Box,
	Text,
	HStack,
	VStack,
	Avatar,
	Flex,
	Icon,
} from "@chakra-ui/react";
import { useUserInfoStore } from "store/userInfoStore";
import BeatLoader from "react-spinners/BeatLoader";
import { ChatChildren, ChatList } from "lib/types";
import { Operate } from "../Operate";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

export function Right({
	list,
	item,
	index,
	chatIndex,
	isLoading,
	setList,
}: {
	list: ChatList[];
	item: ChatChildren;
	index: number;
	chatIndex: number;
	isLoading: boolean;
	setList: (value: ChatList[]) => void;
}) {
	const { username } = useUserInfoStore();

	return (
		<VStack w="full" spacing={3}>
			<HStack w="full" justify="flex-end">
				<Operate
					item={item}
					index={index}
					list={list}
					chatIndex={chatIndex}
					setList={setList}
				>
					<Box
						className="ai-right-content-width relative"
						key={item.createTime}
						mr={1}
						px="12px"
						py="7px"
						maxW="calc(100% - 90px)"
						bg="bg.green"
						color="bg.white"
						borderRadius={5}
					>
						<Text whiteSpace="pre-wrap">{item.content as string}</Text>
						<Icon
							as={AiFillCaretRight}
							boxSize={4}
							pos="absolute"
							right="-11px"
							top="9px"
							color="bg.green"
						/>
					</Box>
					{username ? (
						<Avatar name={username || ""} size="sm" />
					) : (
						<Avatar size="sm" bg="bg.green" />
					)}
				</Operate>
			</HStack>
			{index === list[chatIndex]?.children.length - 1 && isLoading && (
				<HStack w="full" justify="flex-start" spacing={3}>
					<Avatar size="sm" src="/images/aisql/TypoGraphy.svg" mr={1} />
					<Flex
						pos="relative"
						bg="bg.white"
						w="100px"
						h="35px"
						justify="center"
						alignContent="center"
						borderRadius={5}
						pt="12px"
					>
						<BeatLoader size={6} />
						<Icon
							as={AiFillCaretLeft}
							boxSize={4}
							pos="absolute"
							left="-11.4px"
							top="9px"
							color="gray.100"
						/>
					</Flex>
				</HStack>
			)}
		</VStack>
	);
}
