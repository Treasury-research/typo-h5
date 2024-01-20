import {
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	VStack,
	Image,
	InputGroup,
	Input,
	Button,
	Box,
	useClipboard,
	Flex,
	useToast,
	Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useStore } from "store";
import { useUserInfoStore } from "store/userInfoStore";

export function InviteModal() {
	const { openInviteModal, setOpenInviteModal } = useStore();
	const { userId } = useUserInfoStore();
	const { onCopy, value, setValue } = useClipboard("");
	const showToast = useToast();

	useEffect(() => {
		setValue(`${location.origin}&inviteId=${userId}`);
	}, [userId]);

	const copyUrl = () => {
		onCopy();

		showToast({
			position: "top",
			title: "Copied!",
			variant: "subtle",
			status: "info",
		});
	};

	return (
		<Modal
			onClose={() => setOpenInviteModal(false)}
			isOpen={openInviteModal}
			isCentered
		>
			<ModalOverlay />
			<ModalContent
				borderRadius="12px"
				overflow="hidden"
				className="invite-content"
				bg="inherit"
			>
				<ModalBody pos="relative" padding="0">
					<VStack w="full" alignItems="center">
						<Box
							width="284px"
							background="linear-gradient(108deg, #FFE7B6 0%, #E4A930 114.32%)"
							border="1px solid #C7C9D8"
							borderRadius="12px"
							padding="18px"
						>
							<Box color="black" fontSize="24px" fontWeight="700">
								Refer friends
							</Box>
							<Box color="#F98E3F" fontSize="16px" fontWeight="700">
								More Refers, More Rewards
							</Box>
							<Box display="flex" marginTop="10px">
								<Box
									width="28px"
									minWidth="28px"
									height="28px"
									borderRadius="28px"
									background="white"
									color="black"
									display="flex"
									alignItems="center"
									justifyContent="center"
									fontWeight="700"
								>
									1
								</Box>
								<Box display="flex" flexDirection="column" marginLeft="8px">
									<Box fontSize="14px" fontWeight="700">
										Copy link
									</Box>
									<Box fontSize="12px">Copy your refer link below</Box>
								</Box>
							</Box>
							<Box display="flex" marginTop="10px">
								<Box
									width="28px"
									minWidth="28px"
									height="28px"
									borderRadius="28px"
									background="white"
									color="black"
									display="flex"
									alignItems="center"
									justifyContent="center"
									fontWeight="700"
								>
									2
								</Box>
								<Box display="flex" flexDirection="column" marginLeft="8px">
									<Box fontSize="14px" fontWeight="700">
										Invite friends
									</Box>
									<Box fontSize="12px">
										Share your refer link with your friends to signup
									</Box>
								</Box>
							</Box>
							<Box display="flex" marginTop="10px">
								<Box
									width="28px"
									minWidth="28px"
									height="28px"
									borderRadius="28px"
									background="white"
									color="black"
									display="flex"
									alignItems="center"
									justifyContent="center"
									fontWeight="700"
								>
									3
								</Box>
								<Box display="flex" flexDirection="column" marginLeft="8px">
									<Box fontSize="14px" fontWeight="700">
										Earn together
									</Box>
									<Box fontSize="12px">
										Refer friends to verify by email to earn 20 TCC for each
										referral
									</Box>
								</Box>
							</Box>
							<Box
								width="100%"
								border="1px solid #979797"
								borderRadius="6px"
								padding="8px"
								marginTop="10px"
								display="flex"
								alignItems="center"
							>
								<Text
									fontSize="12px"
									fontWeight="700"
									marginRight="10px"
									whiteSpace="nowrap"
									overflow="hidden"
								>
									{value}
								</Text>
								<Button
									w="180px"
									background="white"
									fontWeight="600"
									fontSize="14px"
									borderRadius="6px"
									onClick={copyUrl}
								>
									Copy Link
								</Button>
							</Box>
						</Box>
					</VStack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
