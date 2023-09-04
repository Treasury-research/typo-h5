import {
	Box,
	Button,
	Flex,
	VStack,
	Icon,
	HStack,
	Tooltip,
	Text,
	PopoverTrigger,
	Popover,
	PopoverContent,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
} from "@chakra-ui/react";
import { useJwtStore } from "store/jwtStore";
import useWeb3Context from "hooks/useWeb3Context";
import { isPhone, toShortAddress } from "lib";
import { BiLogIn } from "react-icons/bi";
import { LuUsers, LuLogOut } from "react-icons/lu";
import { TfiEmail } from "react-icons/tfi";
import { useStore } from "store";
import { useAiStore } from "store/aiStore";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import {
	InviteModal,
	RemindModal,
	BindEmailModal,
	VerificationEmailModal,
	ConnectModal,
} from "components";

import { useConnectModalStore } from "store/modalStore";
import { useUserInfoStore } from "store/userInfoStore";
import { useEffect } from "react";
import { HiOutlineEllipsisVertical } from "react-icons/hi2";
import api from "api";

const Account = ({ isSandBox }: { isSandBox: boolean }) => {
	const { jwt, setJwt } = useJwtStore();
	const { account, doLogout } = useWeb3Context();
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
	}, [jwt, opened, setOpenRemindModal, setOpend]);

	return (
		<Flex
			w="full"
			px="10px"
			pt={4}
			pb={5}
			alignItems="center"
			borderTopWidth="1px"
			borderColor="bg.gray"
		>
			{account && jwt ? (
				<VStack w="full">
					<Flex className="w-full justify-between items-center">
						<HStack>
							<Jazzicon diameter={40} seed={jsNumberForAddress(account)} />

							<Box className="flex-col justify-around">
								<Box className="text-[14px] font-bold">
									{toShortAddress(account, 11)}
								</Box>
								<Box className="text-[12px]">
									{usedCoupon}/{totalCoupon} Credits
								</Box>
							</Box>
						</HStack>
						<Popover placement="top">
							<PopoverTrigger>
								<Flex w="30px" pl={2} justify="center">
									<Icon
										as={HiOutlineEllipsisVertical}
										className="text-[21px] cursor-pointer h-6"
										_hover={{ transform: "scale(1.1)" }}
									/>
								</Flex>
							</PopoverTrigger>
							<PopoverContent w="140px" ml={2} overflow="hidden">
								<PopoverArrow bg="bg.main" />
								<PopoverBody bg="bg.main" px={0} py={1} fontSize="13px">
									<HStack
										w="full"
										_hover={{ bg: "gray.300" }}
										cursor="pointer"
										px={2}
										py={1}
										onClick={() => setOpenInviteModal(true)}
									>
										<Icon as={LuUsers} color="bg.green" w="20px" />
										<Text>Refer Friends</Text>
									</HStack>
									<HStack
										w="full"
										_hover={{ bg: "gray.300" }}
										cursor="pointer"
										px={2}
										py={1}
										onClick={() => !email && setOpenBindEmailModal(true)}
									>
										<Icon as={TfiEmail} color="bg.green" w="20px" />
										<Text
											whiteSpace="nowrap"
											overflow="hidden"
											textOverflow="ellipsis"
										>
											{email ? email : "Verify Email"}
										</Text>
									</HStack>
									<HStack
										w="full"
										_hover={{ bg: "gray.300" }}
										cursor="pointer"
										px={2}
										py={1}
										onClick={() => doLogout()}
									>
										<Icon as={LuLogOut} color="bg.green" w="20px" />
										<Text>Logout</Text>
									</HStack>
								</PopoverBody>
							</PopoverContent>
						</Popover>
					</Flex>
				</VStack>
			) : (
				<Button
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
			
			<InviteModal isSandBox={isSandBox} />
			<ConnectModal />
			<BindEmailModal />
			<RemindModal />
			<VerificationEmailModal />
		</Flex>
	);
};

export default Account;
