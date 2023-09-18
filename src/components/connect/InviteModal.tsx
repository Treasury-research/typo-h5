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
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useStore } from "store";
import { useUserInfoStore } from "store/userInfoStore";

export function InviteModal({ isSandBox }: { isSandBox: boolean }) {
	const { openInviteModal, setOpenInviteModal } = useStore();
	const { userId } = useUserInfoStore();
	const { onCopy, value, setValue } = useClipboard("");
	const { showToast } = useStore();

	useEffect(() => {
		setValue(
			`${location.origin}?tab=${
				isSandBox ? "sandbox" : "general"
			}&inviteId=${userId}`
		);
	}, [isSandBox]);

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
					<VStack w="full" alignItems="center" position="relative">
						<Image src="./images/invite.svg" alt="" w="300px" />
						<InputGroup
							w="300px"
							bg="transparent"
							pos="absolute"
							bottom="45px"
							px={5}
							py="28px"
						>
							<Flex w="full" alignItems="center" spacing={0}>
								<Input
									px={2}
									w="60%"
									fontSize="16px"
									fontWeight="500"
									border="0"
									bg="transparent"
									value={value}
									autoFocus={false}
								/>

								<Button
									w="140px"
									flex={1}
									onClick={() => {
										onCopy();
										showToast("Copied", "success");
									}}
									borderRadius={1}
									bg="transparent!"
								/>
							</Flex>
						</InputGroup>
						<Box
							w="300px"
							color="#fff"
							top="inherit"
							pos="absolute"
							bottom="0"
							zIndex="30"
							h="30px"
							onClick={() => setOpenInviteModal(false)}
						/>
					</VStack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
