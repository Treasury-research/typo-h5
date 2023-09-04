import {
	Modal,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalContent,
	ModalOverlay,
} from "@chakra-ui/react";
import type React from "react";

export type BaseModalProps = {
	isOpen: boolean;
	onClose: VoidFunction;
	isCentered?: boolean;
	children?: React.ReactElement | React.ReactElement[];
	maxW?: number | string;
	title?: string | React.ReactElement;
	closeOnOverlayClick?: boolean;
	footer?: React.ReactElement | React.ReactElement[];
	size?: any;
};

export const BaseModal: React.FC<BaseModalProps> = (props) => {
	const {
		isOpen,
		onClose,
		maxW,
		children,
		isCentered,
		title,
		closeOnOverlayClick = true,
		footer,
		size,
	} = props;

	return (
		<Modal
			isOpen={isOpen}
			isCentered={isCentered !== undefined ? isCentered : true}
			motionPreset="slideInBottom"
			onClose={onClose}
			closeOnOverlayClick={closeOnOverlayClick}
			size={size}
		>
			<ModalOverlay />
			<ModalContent
				className="base-modal"
				borderRadius="md"
				bg="bg.white"
				color="text.black"
				py="10px"
				px="0px"
			>
				{title ? (
					<ModalHeader
						maxW="calc(100% - 60px)"
						whiteSpace="nowrap"
						textOverflow="ellipsis"
						overflow="hidden"
						fontSize="md"
						fontWeight="semibold"
						pb={1}
					>
						{title}
					</ModalHeader>
				) : null}
				<ModalCloseButton
					color="text.black"
					borderRadius="0"
					mr="5px"
					mt="10px"
					w="20px"
					h="20px"
					fontSize="12px"
				/>
				<ModalBody>{children}</ModalBody>
				{footer ? footer : null}
			</ModalContent>
		</Modal>
	);
};
