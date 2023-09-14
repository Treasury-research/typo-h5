import {
	Box,
	useBoolean,
	Alert,
	AlertIcon,
	Text,
	Icon,
	Button,
} from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import { BaseModal } from "components";
import { useConnectModalStore, useBindEmailStore } from "store/modalStore";
import { useRouter } from "next/router";
import { useUserInfoStore } from "store/userInfoStore";
import { CloseIcon } from "@chakra-ui/icons";
import { toShortAddress } from "lib";
import { NoticeBar } from "react-vant";

import { BiWallet } from "react-icons/bi";
import { useAccount } from "wagmi";
import useWallet from "lib/useWallet";

export function ConnectModal({ closeNav }: { closeNav: () => void }) {
	const router = useRouter();

	const { inviteId } = router?.query;
	const { openConnectModal, setOpenConnectModal } = useConnectModalStore();
	const [isHiddenTip, setIsHiddenTip] = useBoolean(false);
	const { userId } = useUserInfoStore();
	const { isConnected, address } = useAccount();
	const { handleSign, openConnectWallet, isSign } = useWallet();

	const needSign = useMemo(() => {
		return isConnected && !userId;
	}, [isConnected, userId]);

	const sign = async () => {
		await handleSign(address as string);
		closeNav();
	};

	useEffect(() => {
		if (needSign && isSign) {
			sign();
		}
	}, [needSign, isSign]);

	useEffect(() => {
		const isHidden = localStorage.getItem("isHiddenTip") || "false";
		isHidden === "true" ? setIsHiddenTip.on() : setIsHiddenTip.off();
	}, []);

	return (
		<>
			<BaseModal
				closeOnOverlayClick={false}
				isOpen={openConnectModal}
				onClose={() => {
					setOpenConnectModal(false);
				}}
				title="Sign In"
				isCentered={true}
			>
				<div className="flex flex-col w-full gap-2 my-4">
					<Button
						mb={2}
						leftIcon={<Icon as={BiWallet} boxSize={5} />}
						variant="blackPrimary"
						size="md"
						h="38px"
						borderRadius={8}
						onClick={() => {
							needSign ? sign() : openConnectWallet();
						}}
					>
						{needSign ? "Sign with Wallet" : "Connect Wallet"}
					</Button>
				</div>

				{!isHiddenTip ? (
					<Box mb={3}>
						{inviteId ? (
							<Alert
								status={"success"}
								fontSize="xs"
								py="7px"
								borderRadius={5}
								alignItems="flex-start"
								justifyContent="space-between"
							>
								<AlertIcon boxSize={4} mt="2px" />
								<Text mr={4} lineHeight="17px" color="#487C7E">
									You have been referred by
									<span style={{ color: "#DF753F" }}>
										{toShortAddress(inviteId as string, 8)}
									</span>
									, sign in and verify your email to get the referee reward
								</Text>
								<CloseIcon
									w="9px"
									mt="10px"
									color="blackAlpha.800"
									_hover={{ color: "black" }}
									cursor="pointer"
									onClick={() => {
										localStorage.setItem("isHiddenTip", "true");
										setIsHiddenTip.on();
									}}
								/>
							</Alert>
						) : (
							<NoticeBar
								style={{ width: "100%" }}
								wrapable={false}
								scrollable
								text="Sign in with referral links to get more rewards."
								mode="closeable"
							/>
						)}
					</Box>
				) : (
					<></>
				)}
			</BaseModal>
		</>
	);
}
