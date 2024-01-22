import {
	Box,
	Button,
	Flex,
	VStack,
	Icon,
	HStack,
	Tooltip,
	Text,
	Center,
} from "@chakra-ui/react";
import {
	InviteModal,
	RemindModal,
	BindEmailModal,
	VerificationEmailModal,
	ConnectModal,
} from "components";
import { useJwtStore } from "store/jwtStore";
import { toShortAddress } from "lib";
import { BiLogOut, BiLogIn } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";
import { TfiEmail } from "react-icons/tfi";
import { useStore } from "store";
import { useAiStore } from "store/aiStore";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import useChatContext from "hooks/useChatContext";
import { useConnectModalStore } from "store/modalStore";
import { useUserInfoStore } from "store/userInfoStore";
import { useEffect, useMemo, useCallback } from "react";
import { AiFillTwitterCircle } from "react-icons/ai";
import { BsTelegram } from "react-icons/bs";
import { SiSubstack } from "react-icons/si";
import { BiWallet } from "react-icons/bi";
import useWallet from "hooks/useWallet";
import BookIcon from "components/icons/Book";
import api from "api";

const Account = () => {
	const { closeNav, addChat, setActiveChatId } = useChatContext();
	const { setJwt } = useJwtStore();
	const { doLogout } = useWallet();
	const {
		email,
		userId,
		setUserId,
		setEmail,
		account,
		isPassuser,
		setIsPassuser,
	} = useUserInfoStore();
	const { setOpenInviteModal, setOpenBindEmailModal } = useStore();
	const { setOpenRemindModal, setOpenConnectModal } = useConnectModalStore();
	const {
		totalCoupon,
		usedCoupon,
		dailyAdd,
		setTotalCoupon,
		setUsedCoupon,
		setSearchLimit,
		setDailyAdd,
	} = useAiStore();

	const getUserInfo = async () => {
		const res: any = await api.get(`/api/auth`);
		if (res?.code === 200) {
			setJwt(res.data.token);
			setDailyAdd(res?.data?.dailyAdd);
			setTotalCoupon(res?.data?.totalCoupon);
			setUsedCoupon(res?.data?.usedCoupon);
			setUserId(res?.data?.user_id);
			setEmail(res?.data?.email);
		}
	};

	const getDayLimit = async () => {
		const res: any = await api.get(`/api/limit`);
		if (res?.code === 200) {
			setSearchLimit(res.data || 0);
		}
	};

	useEffect(() => {
		if (userId) {
			getUserInfo();
			getDayLimit();
		}
	}, [userId, email]);

	// useEffect(() => {
	// 	if (userId) {
	// 		setOpenRemindModal(true);
	// 	}
	// }, [userId]);

	return (
		<VStack w="full" h="full" pt={4} alignItems="center" justify="flex-end">
			<VStack w="full" px={3} mb={1}>
				{userId ? (
					<Box w="full" bg="whiteAlpha.300" color="#fff" borderRadius={10}>
						<Flex
							className="w-full justify-between"
							py={3}
							px={4}
							alignItems="center"
						>
							<HStack flex="1" alignItems="flex-start">
								<Jazzicon diameter={40} seed={jsNumberForAddress(account)} />
								<Box className="flex-col flex-1 justify-around" marginLeft="4px">
									<Box className="text-[16px] font-bold">
										{toShortAddress(account, 10)}
									</Box>
									<Box marginTop="4px" marginBottom="4px">
										Daily Reward
									</Box>
									<Box
										className="text-[12px]"
										display="flex"
										alignItems="center"
										justifyContent="flex-start"
									>
										<Box
											width="80%"
											background="#EAEDF1"
											height="10px"
											borderRadius="24px"
											overflow="hidden"
											marginRight="6px"
										>
											<Box
												height="100%"
												background="#FFE3AC"
												width={(dailyAdd / (isPassuser ? 120 : 60)) * 100}
											/>
										</Box>
										<Box>
											{dailyAdd.toFixed(1)}/{isPassuser ? "120" : "60"}
										</Box>
									</Box>
								</Box>
							</HStack>

							<Icon
								as={BiLogOut}
								className="text-[21px] cursor-pointer h-6"
								_hover={{ transform: "scale(1.1)" }}
								onClick={() => {
									doLogout();
									setActiveChatId("");
									closeNav();
								}}
							/>
						</Flex>
						<VStack
							w="full"
							py={3}
							px={4}
							borderColor="whiteAlpha.300"
							borderTopWidth="1px"
							fontSize="13px"
							spacing={2}
						>
							<HStack w="full" justify="space-between">
								<HStack spacing={1} whiteSpace="nowrap">
									<Icon as={LuUsers} boxSize={4} />
									<Text transform="scale(0.95)">Invite friends</Text>
								</HStack>
								<Button
									size="xs"
									px={3}
									h="20px"
									w="55px"
									color="white"
									background="transparent"
									border="1px solid white"
									padding="4px 10px"
									width="70px"
									onClick={() => {
										setOpenInviteModal(true);
									}}
								>
									Refer
								</Button>
							</HStack>
							<HStack w="full" justify="space-between">
								<HStack spacing={1} whiteSpace="nowrap">
									<Icon as={TfiEmail} boxSize={4} transform="scale(0.93)" />
									<Text transform="scale(0.93)">Bind Email</Text>
								</HStack>
								{email ? (
									<Tooltip placement="top" fontSize="xs" label={email} hasArrow>
										<Text
											fontSize="xs"
											w="100px"
											whiteSpace="nowrap"
											overflow="hidden"
											textOverflow="ellipsis"
											transform="scale(0.94)"
											cursor="pointer"
										>
											{email}
										</Text>
									</Tooltip>
								) : (
									<Button
										size="xs"
										px={3}
										isDisabled={email}
										h="20px"
										w="55px"
										color="white"
										background="transparent"
										border="1px solid white"
										padding="4px 10px"
										width="70px"
										onClick={() => {
											setOpenBindEmailModal(true);
										}}
									>
										Verify
									</Button>
								)}
							</HStack>
						</VStack>
					</Box>
				) : (
					<Button
						mb={2}
						leftIcon={<Icon as={BiWallet} boxSize={5} />}
						variant="whitePrimary"
						w="95%"
						h="32px"
						size="sm"
						borderRadius={16}
						onClick={() => setOpenConnectModal(true)}
					>
						Sign in
					</Button>
				)}
			</VStack>

			<HStack
				w="full"
				color="bg.white"
				justify="center"
				py={3}
				borderColor="whiteAlpha.300"
				borderTopWidth="1px"
				gap={12}
			>
				<Icon
					as={AiFillTwitterCircle}
					className="cursor-pointer"
					onClick={() => window.open("https://twitter.com/Knn3Network")}
					boxSize={9}
				/>

				<Icon
					as={BsTelegram}
					className="cursor-pointer"
					onClick={() => window.open("https://t.me/+zR-uaI0Bt_hjMjY9")}
					boxSize={8}
				/>

				<Center
					borderRadius="full"
					bg="#fff"
					w="34px"
					h="34px"
					onClick={() => window.open("https://knn3.substack.com/")}
				>
					<Icon
						as={SiSubstack}
						color="#000"
						className="cursor-pointer"
						boxSize={4}
					/>
				</Center>
				<Box>
					<BookIcon />
				</Box>
			</HStack>

			<InviteModal />
			<ConnectModal closeNav={closeNav} />
			<BindEmailModal />
			<RemindModal />
			<VerificationEmailModal />
		</VStack>
	);
};

export default Account;
