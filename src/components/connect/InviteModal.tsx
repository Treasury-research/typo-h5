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
	InputRightElement,
	useClipboard,
	Box,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useStore } from "store";
import { useUserInfoStore } from "store/userInfoStore";
import { motion as m, AnimatePresence } from "framer-motion";

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
			size="4xl"
		>
			<ModalOverlay />
			<ModalContent
				className="invite-content"
				bg="linear-gradient(135deg, #FFE7B6 0%, #E4A930 100%)"
				pb="30px"
			>
				<ModalHeader></ModalHeader>
				<ModalCloseButton />
				<ModalBody px="40px" position="relative" className="invite-body">
					<VStack color="#000" fontSize="32px" fontWeight="bold">
						<HStack className="invite-refer" mb={1}>
							<Image src="./images/rocket.svg" alt="" />
							<span>Refer friends</span>
						</HStack>
						<p className="invite-title text-[#F98E3F] !-mt-[5px] !-ml-[15px]">
							More Referrals, More Rewards
						</p>
					</VStack>
					<ul className="list-none invite-ul flex gap-4 pt-[66px]">
						<li className="w-[28%]">
							<div className="dottedLine flex items-center gap-4 mb-[22px]">
								<div
									style={{
										filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.12))",
									}}
									className="w-[32px] h-[32px] bg-white rounded-full text-[16px] text-[#000] font-bold flex justify-center items-center flex-shrink-0"
								>
									1
								</div>
							</div>
							<div>
								<h2 className="text-[#121212] text-[20px] font-bold">
									Copy link
								</h2>
								<p className="text-[16px] font-normal">
									Copy your referral link
									<br /> below
								</p>
							</div>
						</li>
						<li className="w-[28%]">
							<div className="dottedLine flex items-center gap-4 mb-[22px]">
								<div
									style={{
										filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.12))",
									}}
									className="w-[32px] h-[32px] bg-white rounded-full text-[16px] text-[#000] font-bold flex justify-center items-center flex-shrink-0"
								>
									2
								</div>
							</div>
							<div>
								<h2 className="text-[#121212] text-[20px] font-bold">
									Invite friends
								</h2>
								<p className="text-[16px] font-normal">
									Share your referral link with
									<br /> your friends to signup
								</p>
							</div>
						</li>
						<li className="w-[30%]">
							<div className="flex items-center gap-4 mb-[22px] invite-3">
								<div
									style={{
										filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.12))",
									}}
									className="w-[32px] h-[32px] bg-white rounded-full text-[16px] text-[#000] font-bold flex justify-center items-center flex-shrink-0"
								>
									3
								</div>
							</div>
							<div>
								<h2 className="text-[#121212] text-[20px] font-bold">
									Earn together
								</h2>
								<p className="text-[15px] font-normal">
									Refer friends to verify by email
									<br /> to earn 20 TCC for each referral
								</p>
							</div>
						</li>
					</ul>
					<InputGroup size="lg" bg="transparent" mt="50px">
						<Input
							paddingY="30px"
							fontSize="16px"
							fontWeight="500"
							paddingRight="140px"
							bg="transparent"
							value={value}
						/>
						<InputRightElement width="140px" paddingY="32px" pr="10px">
							<Button
								onClick={() => {
									onCopy();
									showToast("Copied", "success");
								}}
								borderRadius="6px"
								bg="#fff"
								color="#121212"
								filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.12))"
							>
								Copy Link
							</Button>
						</InputRightElement>
					</InputGroup>
					<Box className="invite-gift">
						<m.div
							className="absolute -top-[100px] right-[94px] z-10"
							initial={{ opacity: 1, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1, translateY: [-600, 34, -10, 0] }}
							transition={{ duration: 0.5, ease: "linear" }}
						>
							<Image src="./images/gift/gift.svg" alt="" />
						</m.div>
						<m.div className="absolute top-[140px] right-[80px]">
							<Image src="./images/gift/bottom.svg" alt="" />
						</m.div>
						<m.div
							className="absolute top-[80px] right-[290px]"
							initial={{ opacity: 0, scale: 0.8, y: 80, x: 30 }}
							animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
							transition={{ duration: 0.3, delay: 0.15, ease: "linear" }}
						>
							<Image src="./images/gift/left.svg" alt="" />
						</m.div>
						<m.div
							className="absolute -top-[10px] right-[50px]"
							initial={{ opacity: 0, scale: 0.8, y: 80, x: -40 }}
							animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
							transition={{ duration: 0.3, delay: 0.15, ease: "linear" }}
						>
							<Image src="./images/gift/right.svg" alt="" />
						</m.div>
					</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
