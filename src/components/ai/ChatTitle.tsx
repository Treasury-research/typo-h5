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
import { NavBar, Tabs,Badge } from "react-vant";

export function ChatTitle({
	list,
	chatIndex,
	isOpen,
	showNav,
	onOpen,
	openNav,
	closeNav,
	setIsSandBox,
}: {
	list: ChatList[];
	chatIndex: number;
	showNav: boolean;
	isOpen: boolean;
	onOpen: () => void;
	openNav: () => void;
	closeNav: () => void;
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
					<Box w="full" h="full" pos="absolute" zIndex={5} onClick={closeNav} />
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
							onClick={openNav}
						/>
					}
					rightText={
						<Badge dot>
							<HStack
								pos="relative"
								px={2}
								py="2px"
								marginInlineEnd="0"
								cursor="pointer"
								bg="bg.yellow"
								color="#fff"
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
								<Center bg="#fff" p="5px" borderRadius="full" w="16px" h="16px">
									<Icon
										as={BsFillLightningChargeFill}
										boxSize={3}
										color="bg.yellow"
									/>
								</Center>
								<Text>QUEST</Text>
							</HStack>
						</Badge>
					}
				/>
			</Box>
		</>
	);
}
