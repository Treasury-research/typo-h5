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
import { BiGift } from "react-icons/bi";
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
							<Icon
								as={BiGift}
								boxSize={5}
								onClick={() => {
									onOpen();
								}}
							/>
						</Badge>
					}
				/>
			</Box>
		</>
	);
}
