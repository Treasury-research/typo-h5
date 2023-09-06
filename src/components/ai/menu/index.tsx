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
// import { Left } from "./Left";
import { ChatList } from "lib/types";
import { DynamicAccount } from "components/connect";

import { useEffect, useState } from "react";

export function Menu({
	list,
	chatIndex,
	isSandBox,
	sandBoxType,
	showNav,
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
	showNav: boolean;
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
		<HStack
			w="80vw"
			h="full"
			bg="#000"
			spacing={0}
			zIndex={5}
			style={{ display: showNav ? "flex" : "none" }}
		>
			<VStack
				w="full"
				h="full"
				spacing={0}
				mt={2}
				color="#fff"
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
