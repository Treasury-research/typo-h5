import { Box, Button, Flex, VStack, Image, HStack } from "@chakra-ui/react";

import { Tabs } from "./Tabs";
import { ChatList } from "lib/types";
import { DynamicAccount } from "components/connect";

import { useEffect, useState } from "react";

export function Menu() {
	return (
		<HStack w="80vw" h="full" bg="#000" spacing={0} zIndex={5}>
			<VStack
				w="full"
				h="full"
				spacing={0}
				pt="20px"
				color="#fff"
				borderColor="bg.gray"
				justify="space-between"
				alignItems="flex-start"
			>
				<Image className="logo" src={`/logo.svg`} height="45px" ml={4} />
				<VStack w="full" h="calc(100% - 285px)" py={4}>
					<Tabs />
				</VStack>
				<Box w="full" h="230px">
					<DynamicAccount />
				</Box>
			</VStack>
		</HStack>
	);
}
