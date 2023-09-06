import {
	Box,
	Button,
	Flex,
	VStack,
	Image,
	Icon,
	CloseButton,
	HStack,
} from "@chakra-ui/react";

import { Tabs } from "./Tabs";
import { Left } from "./Left";
import { ChatList } from "lib/types";
import { DynamicAccount } from "components/connect";

import { useEffect, useState } from "react";

export function Menu({
	list,
	chatIndex,
	isSandBox,
	sandBoxType,
	setChatIndex,
	setList,
	addChannel,
	setInput,
	setIsSandBox,
	setSandBoxType,
}: {
	list: ChatList[];
	chatIndex: number | null;
	isSandBox: boolean;
	sandBoxType: string;
	setInput: (value: string) => void;
	addChannel: () => void;
	setChatIndex: (value: number | null) => void;
	setList: (value: ChatList[]) => void;
	setSandBoxType: (value: string) => void;
	setIsSandBox: {
		on: () => void;
		off: () => void;
		toggle: () => void;
	};
}) {
	
	useEffect(() => {
		setChatIndex(null);
	}, [isSandBox]);

	return (
		<HStack w="280px" h="full" className="ai-menu" bg="bg.white" spacing={0}>
			<VStack
				w="220px"
				h="full"
				spacing={0}
				mt={2}
				borderColor="bg.gray"
				justify="space-between"
			>
				<VStack w="full" h="full" py={4}>
					<Tabs
						list={list}
						chatIndex={chatIndex}
						isSandBox={isSandBox}
						sandBoxType={sandBoxType}
						setSandBoxType={setSandBoxType}
						setInput={setInput}
						addChannel={addChannel}
						setChatIndex={setChatIndex}
						setList={setList}
					/>
				</VStack>

				<DynamicAccount isSandBox={isSandBox} />
			</VStack>
		</HStack>
	);
}
