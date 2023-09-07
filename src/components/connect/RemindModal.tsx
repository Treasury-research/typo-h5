import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	Image,
	ModalOverlay,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useConnectModalStore } from "store/modalStore";

export function RemindModal() {
	const { openRemindModal, setOpenRemindModal } = useConnectModalStore();

	return (
		<Modal
			onClose={() => setOpenRemindModal(false)}
			isOpen={openRemindModal}
			isCentered
			size="3xl"
		>
			<ModalOverlay />
			<ModalContent
				borderRadius="12px"
				overflow="hidden"
				className="invite-content"
				bg="inherit"
			>
				<ModalCloseButton
					size="md"
					color="#fff"
					bg="#000"
					pos="absolute"
					zIndex="30"
				/>
				<ModalBody
					position="relative"
					className="invite-body"
					pos="relative"
					padding="0"
				>
					<Image src="./images/remind.jpg" alt="" />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
