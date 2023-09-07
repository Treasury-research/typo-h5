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
import { NavBar, Tabs } from "react-vant";

export function ChatTitle({
	list,
	chatIndex,
	isOpen,
	onOpen,
	showNav,
	setShowNav,
	setIsSandBox,
}: {
	list: ChatList[];
	chatIndex: number;
	showNav: boolean;
	isOpen: boolean;
	onOpen: () => void;
	setShowNav: {
		on: () => void;
		off: () => void;
		toggle: () => void;
	};
	setIsSandBox: {
		on: () => void;
		off: () => void;
		toggle: () => void;
	};
}) {
	return (
		<>
			<Box w="100vw">
				{showNav && (
					<Box
						w="full"
						h="full"
						pos="absolute"
						zIndex={5}
						onClick={setShowNav.off}
					/>
				)}
				<NavBar
					className="nav-bar"
					title={
						<Tabs
							type="jumbo"
							color="#000"
							onChange={(tabIndex) => {
								tabIndex === 0 ? setIsSandBox.off() : setIsSandBox.on();
							}}
						>
							<Tabs.TabPane title="History" />
							<Tabs.TabPane title="Sandbox" />
						</Tabs>
					}
					leftText={
						<Icon
							className="chat-menu"
							as={AiOutlineMenu}
							boxSize={5}
							mr={3}
							ml={1}
							onClick={setShowNav.toggle}
						/>
					}
					rightText={
						<HStack
							pos="relative"
							pr={2}
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
					}
				/>
			</Box>
		</>
	);
}
