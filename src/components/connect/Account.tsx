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
import useWeb3Context from "hooks/useWeb3Context";
import { isPhone, toShortAddress } from "lib";
import { BiLogOut, BiLogIn } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";
import { TfiEmail } from "react-icons/tfi";
import { useStore } from "store";
import { useAiStore } from "store/aiStore";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

import { useConnectModalStore } from "store/modalStore";
import { useUserInfoStore } from "store/userInfoStore";
import { useEffect } from "react";
import { AiFillTwitterCircle } from "react-icons/ai";
import { BsTelegram } from "react-icons/bs";
import { SiSubstack } from "react-icons/si";
import api from "api";
import { useAccount } from "wagmi";
import useWallet from "lib/useWallet";

const Account = ({ isSandBox }: { isSandBox: boolean }) => {
	const { jwt, setJwt } = useJwtStore();
	const { doLogout } = useWallet();
  const { address, isConnected } = useAccount();
	const { totalCoupon, usedCoupon, setTotalCoupon, setUsedCoupon } =
		useAiStore();
	const { email, userId, setUserId, setEmail } = useUserInfoStore();
	const { setOpenInviteModal, setOpenBindEmailModal } = useStore();
	const { setOpenConnectModal, setOpenRemindModal, opened, setOpend } =
		useConnectModalStore();

	// console.log("email", email);

	const getUserInfo = async () => {
		const res: any = await api.get(`/api/auth`);
		if (res?.code === 200) {
			setJwt(res.data.token);
			setTotalCoupon(res?.data?.totalCoupon);
			setUsedCoupon(res?.data?.usedCoupon);
			setUserId(res?.data?.user_id);
			setEmail(res?.data?.email);
		}
	};

	useEffect(() => {
		if (userId) {
			getUserInfo();
		}
	}, [userId, email]);

	useEffect(() => {
		let img1: any = new Image();
		let img2: any = new Image();
		let img3: any = new Image();
		let img4: any = new Image();
		img1.src = "./images/gift/gift.svg";
		img2.src = "./images/gift/right.svg";
		img3.src = "./images/gift/left.svg";
		img4.src = "./images/gift/bottom.svg";
	}, []);

	useEffect(() => {
		if (!opened && jwt && !isPhone()) {
			setOpenRemindModal(true);
			setOpend(true);
		}
	}, [jwt, opened, setOpenRemindModal, setOpend, address]);

	return (
		<VStack w="full" h="full" pt={4} alignItems="flex-start" justify="flex-end">
			{address && jwt ? (
				<VStack w="full" px={4} mb={1}>
					<Box w="full" bg="whiteAlpha.300" color="#fff" borderRadius={10}>
						<Flex className="w-full justify-between items-center" py={3} px={4}>
							<HStack>
								<Jazzicon diameter={40} seed={jsNumberForAddress(address)} />
								<Box className="flex-col justify-around">
									<Box className="text-[16px] font-bold">
										{toShortAddress(address, 10)}
									</Box>
									<Box className="text-[12px]">
										{usedCoupon}/{totalCoupon} Credits
									</Box>
								</Box>
							</HStack>

							<Icon
								as={BiLogOut}
								className="text-[21px] cursor-pointer h-6"
								_hover={{ transform: "scale(1.1)" }}
								onClick={() => doLogout()}
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
									<Text transform="scale(0.95)">Refer friends</Text>
								</HStack>
								<Button
									variant="whitePrimary"
									size="xs"
									px={3}
									h="20px"
									w="55px"
									onClick={() => {
										setOpenInviteModal(true);
									}}
								>
									Invite
								</Button>
							</HStack>
							<HStack w="full" justify="space-between">
								<HStack spacing={1} whiteSpace="nowrap">
									<Icon as={TfiEmail} boxSize={4} transform="scale(0.93)" />
									<Text transform="scale(0.93)">Verify Email</Text>
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
										variant="whitePrimary"
										size="xs"
										px={3}
										isDisabled={email}
										h="20px"
										w="55px"
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
				</VStack>
			) : (
				<Button
					ml={2}
					leftIcon={<Icon as={BiLogIn} boxSize={5} />}
					variant="whitePrimary"
					size="sm"
					px={3}
					borderRadius={16}
					onClick={() => setOpenConnectModal(true)}
				>
					Sign in
				</Button>
			)}

			<HStack
				w="full"
				color="bg.white"
				justify="center"
				px={10}
				py={3}
				borderColor="whiteAlpha.300"
				borderTopWidth="1px"
				gap={10}
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
			</HStack>

			<InviteModal isSandBox={isSandBox} />
			<ConnectModal />
			<BindEmailModal />
			<RemindModal />
			<VerificationEmailModal />
		</VStack>
	);
};

export default Account;
