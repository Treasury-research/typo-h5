import {
	Box,
	Flex,
	Image,
	Spinner,
	useBoolean,
	Alert,
	AlertIcon,
	Text,
	HStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BaseModal } from "components";
import useWeb3Context from "hooks/useWeb3Context";
import { useConnectModalStore, useBindEmailStore } from "store/modalStore";
import { useRouter } from "next/router";
import bindGithubApi from "api/binGithubApi";
import api from "api";
import { useJwtStore } from "store/jwtStore";
import { useUserInfoStore } from "store/userInfoStore";
import { useStore } from "store";
import { CloseIcon } from "@chakra-ui/icons";
import { toShortAddress } from "lib";

export function ConnectModal(props: any) {
	const router = useRouter();
	const { showToast } = useStore();
	const { inviteId } = router?.query;
	const { openConnectModal, setOpenConnectModal } = useConnectModalStore();
	const [isHiddenTip, setIsHiddenTip] = useBoolean(false);

	const { openBindEmail, setOpenBindEmail, setPartyType, setPartyId, setType } =
		useBindEmailStore();

	const { setUserInfo, clearUserInfo } = useUserInfoStore();

	const { doLogin, connectWallet } = useWeb3Context();

	const { jwt, setJwt } = useJwtStore();

	const [isLoading, setIsLoading] = useBoolean(false);

	const connectClick = async () => {
		setIsLoading.on();
		const res = await connectWallet();
		try {
			if (res) {
				await doLogin(res);
				setIsLoading.off();
			}
		} catch (error) {
			setIsLoading.off();
		}
	};

	const verifyGithub = async () => {
		const res: any = await bindGithubApi.post("", {
			code: router.query.code,
			type: router.query.type,
		});
		if (res && res.jwt) {
			let strings = res.jwt.split(".");
			let userinfo = JSON.parse(
				decodeURIComponent(
					escape(window.atob(strings[1].replace(/-/g, "+").replace(/_/g, "/")))
				)
			);
			if (!userinfo.is_verified) {
				api.defaults.headers.authorization = ``;
				setJwt("");
				setPartyType(userinfo.third_party_type);
				setPartyId(userinfo.third_party_id);
				setType("github");
				setOpenBindEmail(true);
			} else {
				api.defaults.headers.authorization = `Bearer ${res.jwt}`;
				setJwt(res.jwt);
				const res1 = await api.get(
					`/api/users?thirdPartyType=${userinfo.third_party_type}&thirdPartyId=${userinfo.third_party_id}`
				);
				if (
					res1 &&
					res1.status &&
					res1.status == 200 &&
					res1.data.email_verified
				) {
					setUserInfo(res1.data);
				}
			}
		}
	};

	useEffect(() => {
		if (router.query && router.query.code && router.query.type) {
			verifyGithub();
			router.push(router.pathname);
		}
	}, [router]);

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
					setIsLoading.off();
				}}
				title="Sign In"
				isCentered={true}
			>
				<Flex
					alignItems="center"
					justifyContent="space-between"
					width="400px"
					maxW="full"
					border="1px"
					borderColor="text.gray"
					borderRadius="md"
					px={4}
					py={1}
					h={12}
					my={4}
					cursor="pointer"
					className="hover:opacity-70"
					onClick={connectClick}
				>
					<Box>Browser Wallet</Box>
					<Box>
						{isLoading ? (
							<Spinner size="md" mr={2} mt={1} color="gray.700" />
						) : (
							<Image
								src="/images/connect/metamask.svg"
								alt=""
								height="40px"
								width="40px"
							/>
						)}
					</Box>
				</Flex>

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
									You have been referred by{" "}
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
							<Alert
								status="warning"
								fontSize="xs"
								py="8px"
								borderRadius={5}
								justifyContent="space-between"
							>
								<HStack spacing={1}>
									<AlertIcon boxSize={4} />
									<Text mr={3} lineHeight="17px" color="#DF753F">
										Sign in with referral links to get more rewards.
									</Text>
								</HStack>

								<CloseIcon
									w="8px"
									color="blackAlpha.800"
									_hover={{ color: "black" }}
									cursor="pointer"
									onClick={() => {
										localStorage.setItem("isHiddenTip", "true");
										setIsHiddenTip.on();
									}}
								/>
							</Alert>
						)}
					</Box>
				) : (
					<></>
				)}
			</BaseModal>
		</>
	);
}
