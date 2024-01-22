import {
	Icon,
	Text,
	Center,
	VStack,
	Button,
	HStack,
	Box,
	useToast,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { ChatList } from "lib/types";
import { AiOutlineMenu } from "react-icons/ai";
import { BiGift } from "react-icons/bi";
import { NavBar, Tabs, Badge } from "react-vant";
import ShareIcon from "components/icons/Share";
import useChatContext from "hooks/useChatContext";
import { useUserInfoStore } from "store/userInfoStore";

export function ChatTitle() {
	const {
		activeChat,
		activeChatId,
		showNav,
		openQuest,
		openNav,
		closeNav,
		isLoading,
		setActionSheetProps,
		setIsActionSheetOpen,
	} = useChatContext();
	const { userId } = useUserInfoStore();

	// console.log("activeChatId", activeChatId);
	const showToast = useToast();

	const openShareActionSheet = useCallback(() => {
		if (isLoading) {
			showToast({
				position: "top",
				title: "Please Wait...",
				variant: "subtle",
			});
		}

		setActionSheetProps({
			type: "share",
		});
		setIsActionSheetOpen.on();
	}, []);

	return (
		<>
			<Box w="100vw">
				{showNav && (
					<Box w="full" h="full" pos="absolute" zIndex={5} onClick={closeNav} />
				)}
				<NavBar
					className="nav-bar"
					title={
						<Tabs type="jumbo" color="#000">
							<Tabs.TabPane title="Chat" />
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
						<Box display="flex" alignItems="center">
							{userId && activeChat && activeChat.messages.length > 0 && (
								<Box
									marginRight="18px"
									cursor="pointer"
									onClick={openShareActionSheet}
								>
									<ShareIcon />
								</Box>
							)}
							<Badge dot>
								<Icon
									mt={1}
									as={BiGift}
									boxSize={5}
									onClick={() => {
										if (!userId) {
											showToast({
												position: "top",
												title: `You're not logged in yet.`,
												variant: "subtle",
												status: "warning",
											});
											return;
										}
										openQuest();
									}}
								/>
							</Badge>
						</Box>
					}
				/>
			</Box>
		</>
	);
}
