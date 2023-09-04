import {
	Icon,
	Text,
	Center,
	VStack,
	Button,
	HStack,
	Box,
} from "@chakra-ui/react";
import { ChatList } from "lib/types";
import { AiOutlineMenu } from "react-icons/ai";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { HiOutlineChatBubbleLeft } from "react-icons/hi2";

export function ChatTitle({
	list,
	chatIndex,
	isOpen,
	onOpen,
}: {
	list: ChatList[];
	chatIndex: number;
	isOpen: boolean;
	onOpen: () => void;
}) {
	const showMenu = () => {
		const menu: any = document.querySelector(".ai-menu");
		menu.style.display = "block";
	};

	return (
		<HStack
			w="full"
			h="50px"
			mx={5}
			mt={3}
			pr={1}
			className="chat-title"
			alignItems="center"
			justify="space-between"
			fontWeight="400"
		>
			<HStack spacing={0} ml={4}>
				<Icon
					className="chat-menu"
					as={AiOutlineMenu}
					boxSize={5}
					mr={3}
					ml={1}
					onClick={showMenu}
				/>
				{/* <Icon as={HiOutlineChatBubbleLeft} boxSize={7} pr={2} pt={1} /> */}
				<Text fontSize="18px" pl={1} pr={2}>
					#
				</Text>
				<Text
					className="chat-name"
					fontSize="17px"
					whiteSpace="nowrap"
					overflow="hidden"
					textOverflow="ellipsis"
				>
					{(list && list[chatIndex]?.name) || "Title"}
				</Text>
			</HStack>

			{!isOpen && (
				<HStack
					pos="relative"
					mr={2}
					marginInlineEnd="0"
					cursor="pointer"
					bg="bg.yellow"
					color="#fff"
					h="28px"
					fontSize="xs"
					alignItems="center"
					justify="center"
					fontWeight="semibold"
					borderRadius={5}
					// w="95px"
					px={2}
					_hover={{ transform: "scale(1.01)" }}
					onClick={() => {
						onOpen();
					}}
				>
					<Box
						w="8px"
						h="8px"
						borderRadius="full"
						pos="absolute"
						bg="#ee6f2d"
						top="-3px"
						right="-3px"
					/>
					<Center bg="#fff" p="5px" borderRadius="full" w="16px" h="16px">
						<Icon
							as={BsFillLightningChargeFill}
							boxSize={3}
							color="bg.yellow"
						/>
					</Center>
					<Text>QUEST</Text>
				</HStack>
			)}
		</HStack>
	);
}
