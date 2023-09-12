import {
	Box,
	useBoolean,
	Alert,
	AlertIcon,
	Text,
	Button,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { BaseModal } from "components";
// import useWeb3Context from "hooks/useWeb3Context";
import { useConnectModalStore, useBindEmailStore } from "store/modalStore";
import { useRouter } from "next/router";
import { useJwtStore } from "store/jwtStore";
import { useUserInfoStore } from "store/userInfoStore";
import { useStore } from "store";
import { CloseIcon } from "@chakra-ui/icons";
import { toShortAddress } from "lib";
import { NoticeBar } from "react-vant";
import useWallet from "lib/useWallet";
import { useAccount, useConnect, useDisconnect, useSwitchNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";

export function ConnectModal(props: any) {
	const router = useRouter();
	const { showToast } = useStore();
	const { inviteId } = router?.query;
	const { openConnectModal, setOpenConnectModal } = useConnectModalStore();
	const [isHiddenTip, setIsHiddenTip] = useBoolean(false);
	const { address, isConnected } = useAccount();
	const {
		connect,
		connectors,
		error,
		isLoading: connectLoading,
		pendingConnector,
		connectAsync,
	} = useConnect();
	const { projectId, ethereumClient, onConnect, loading } = useWallet();
	const { open, close } = useWeb3Modal();
	const { setUserInfo, clearUserInfo } = useUserInfoStore();
	const { jwt, setJwt } = useJwtStore();

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
					{connectors
						.filter((c) => c.ready)
						.map((connector, index) => (
							<Button
								variant="blackPrimary"
								color="#fff"
								onClick={() => {
									if (isConnected) {
										onConnect(address as string);
									} else {
										connectAsync({ connector }).then((res) => {
											setTimeout(async () => {
												await onConnect(res.account);
											}, 1600);
										});
									}
								}}
								className="flex w-full flex-1 items-center justify-start gap-4 rounded-md border border-transparent bg-bg-100 px-4 py-3 text-sm font-medium text-white hover:bg-bg-200 focus:outline-none"
								key={index}
							>
								{connector.name}
								{connectLoading && connector.id === pendingConnector?.id && (
									<span className="text-[12px] font-bold">(connecting...)</span>
								)}
								{loading && connector.id === pendingConnector?.id && (
									<span className="text-[12px] font-bold">(Signing...)</span>
								)}
							</Button>
						))}
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
