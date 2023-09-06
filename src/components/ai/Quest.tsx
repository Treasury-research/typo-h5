import {
	Icon,
	Text,
	Center,
	VStack,
	Button,
	HStack,
	Flex,
	CloseButton,
	Badge,
	Box,
	Image,
	Tooltip,
	Link,
	useBoolean,
	useClipboard,
} from "@chakra-ui/react";

import { BiGift } from "react-icons/bi";
import { IoRocketOutline } from "react-icons/io5";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { useUserInfoStore } from "store/userInfoStore";
import { useEffect, useState, useMemo } from "react";
import { BiCopy } from "react-icons/bi";
import api from "api";
import { Incentive } from "lib/types";
import {
	CheckIcon,
	ChevronRightIcon,
	CopyIcon,
	InfoIcon,
	InfoOutlineIcon,
} from "@chakra-ui/icons";
import { useStore } from "store";
import { BaseModal, Copy } from "components";
import { base64, toShortAddress } from "lib";
import { useAiStore } from "store/aiStore";
import { Popup, Typography } from "react-vant";

const AwardItem = ({
	title,
	value,
	isFinish,
	email,
}: {
	title: string;
	isFinish: boolean;
	email?: string;
	value: number | React.ReactElement | React.ReactElement[];
}) => {
	return (
		<Flex w="full" justify="space-between" px={3}>
			<HStack spacing={4} color={isFinish ? "black" : "blackAlpha.500"}>
				<CheckIcon />
				<Text>{title}</Text>
				{title === "Referral" && (
					<Tooltip
						placement="top"
						fontSize="xs"
						bg="#e6b65a"
						color="#fff"
						fontWeight="semibold"
						label="Invite new friends to earn TCC rewards, 20 TCC for each referral."
						hasArrow
						w="240px"
					>
						<InfoOutlineIcon
							boxSize={4}
							marginInlineStart="5px!"
							cursor="pointer"
						/>
					</Tooltip>
				)}
			</HStack>
			<Box cursor="pointer">{isFinish ? `+${value}` : value || 0}</Box>
		</Flex>
	);
};

export function Quest({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const { onCopy, value, setValue, hasCopied } = useClipboard("");
	const { isInvite, userId, email } = useUserInfoStore();
	const [awards, setAwards] = useState<Incentive[]>([]);
	const { setOpenInviteModal, setOpenBindEmailModal } = useStore();
	const [showModal, setShowModal] = useBoolean(false);
	const [uuid, setUuid] = useState("");
	const { setTotalCoupon, setUsedCoupon } = useAiStore();

	const totalScore = useMemo(() => {
		return awards.reduce(
			(sum, item) => sum + parseInt(item.score as unknown as string),
			0
		);
	}, [awards]);

	const awardItems = useMemo(() => {
		const preRegItem = awards.filter(
			(item) => item.type === "Pre_Registration"
		)[0];

		const signInItem = awards.filter((item) => item.type === "Login")[0];
		const refereeItem = awards.filter((item) => item.type === "Referee")[0];
		const referralItem = awards.filter((item) => item.type === "Referral")[0];
		const typeHunterItem = awards.filter(
			(item) => item.type === "Typo_Hunter"
		)[0];
		const verifyEmailItem = awards.filter(
			(item) => item.type === "Connect_Email"
		)[0];

		const TGItem = awards.filter((item) => item.type === "TG")[0];
		const SubstackItem = awards.filter((item) => item.type === "Substack")[0];
		const GalleryItem = awards.filter((item) => item.type === "gallery_s1")[0];

		return {
			preRegItem,
			signInItem,
			typeHunterItem,
			verifyEmailItem,
			refereeItem,
			referralItem,
			TGItem,
			SubstackItem,
			GalleryItem,
		};
	}, [awards]);

	const getAwards = async () => {
		const res: any = await api.get(`/api/incentive`);
		if (res?.code === 200) {
			setAwards(res?.data || []);
		}
	};

	const getUserInfo = async () => {
		const res: any = await api.get(`/api/auth`);
		if (res?.code === 200) {
			setTotalCoupon(res?.data?.totalCoupon);
			setUsedCoupon(res?.data?.usedCoupon);
		}
	};

	const getUuid = () => {
		const uid = base64(userId);
		setUuid(uid);
		setValue(`/bind_typo ${uid}`);
	};

	useEffect(() => {
		if (userId) {
			getAwards();
			getUuid();
		} else {
			setAwards([]);
			setValue("");
		}
	}, [userId, email]);

	return (
		<>
			<Popup
				visible={isOpen}
				closeable
				round
				position="bottom"
				title={
					<HStack w="full" justify="center" alignItems="center">
						<Flex pos="relative" alignItems="center" gap={1} fontSize="md">
							<Icon as={BiGift} boxSize={5} />
							<Text fontWeight="semibold">QUEST</Text>
							<Badge
								ml="1"
								colorScheme="red"
								pos="absolute"
								left="82px"
								top="-8px"
								fontSize="12px"
								borderRadius={4}
							>
								Hot
							</Badge>
						</Flex>
					</HStack>
				}
				description={
					<>
						<VStack mt="0.5rem!" w="full" bg="bg.lightYellow" borderRadius={10}>
							<HStack
								alignItems="center"
								w="full"
								fontWeight="semibold"
								spacing={3}
								mt={1}
								color="#ee6f2d"
								borderColor="rgba(0, 0, 0, 0.08)"
								borderBottomWidth="1px"
								px={4}
								py={2}
							>
								<Center bg="#fff" p={2} borderRadius="full">
									<Image src="/images/aisql/tcc.svg" boxSize={5} alt="" />
								</Center>
								<Box lineHeight="20px">
									<HStack spacing={1} fontSize="md">
										<Text mr={1}>{totalScore}</Text>
										<Text>TCC</Text>
										<Tooltip
											placement="top"
											fontSize="xs"
											bg="#e6b65a"
											color="#fff"
											fontWeight="semibold"
											label="TypoGraphy Chat Credit"
											hasArrow
										>
											<InfoIcon boxSize={4} cursor="pointer" />
										</Tooltip>
									</HStack>
									<Text fontSize="sm">Total TCC Earned</Text>
								</Box>
							</HStack>
							<VStack
								w="full"
								px={3}
								pt={1}
								fontSize="13px"
								fontWeight="semibold"
								spacing={2}
							>
								{awardItems.preRegItem && (
									<AwardItem
										title="Pre-reg"
										isFinish={!!awardItems.preRegItem}
										value={awardItems.preRegItem?.score}
									/>
								)}

								<AwardItem
									title="Sign in"
									isFinish={!!awardItems.signInItem}
									value={awardItems.signInItem?.score}
								/>

								{awardItems.typeHunterItem && (
									<AwardItem
										title="Typo Hunter"
										isFinish={!!awardItems.typeHunterItem}
										value={awardItems.typeHunterItem?.score}
									/>
								)}

								<AwardItem
									title="Verify Telegram"
									isFinish={!!awardItems.TGItem}
									value={
										!!awardItems.TGItem ? (
											awardItems.TGItem?.score
										) : (
											<HStack
												spacing={0}
												mr={-1}
												fontSize="sm"
												onClick={() => {
													setShowModal.on();
													onClose();
												}}
											>
												<Text>Verify</Text>
												<ChevronRightIcon boxSize={5} />
											</HStack>
										)
									}
								/>

								<AwardItem
									title="Verify Email"
									isFinish={!!awardItems.verifyEmailItem}
									value={
										!!awardItems.verifyEmailItem ? (
											awardItems.verifyEmailItem?.score
										) : (
											<HStack
												spacing={0}
												mr={-1}
												fontSize="sm"
												onClick={() => {
													setOpenBindEmailModal(true);
													onClose();
												}}
											>
												<Text>Verify</Text>
												<ChevronRightIcon boxSize={5} />
											</HStack>
										)
									}
								/>

								<AwardItem
									title="Email subscription"
									isFinish={!!awardItems.SubstackItem}
									email={email}
									value={
										!!awardItems.SubstackItem ? (
											awardItems.SubstackItem?.score
										) : (
											<HStack
												spacing={0}
												mr={-1}
												fontSize="sm"
												onClick={() => {
													if (email) {
														window.open("https://knn3.substack.com/");
													} else {
														setOpenBindEmailModal(true);
														onClose();
													}
												}}
											>
												<Text>Subscribe</Text>
												<ChevronRightIcon boxSize={5} />
											</HStack>
										)
									}
								/>

								{awardItems.GalleryItem && (
									<AwardItem
										title="Gallery S1"
										isFinish={!!awardItems.GalleryItem}
										value={awardItems.GalleryItem?.score}
									/>
								)}

								{isInvite && (
									<AwardItem
										title="Referee"
										isFinish={!!awardItems.refereeItem}
										value={
											!!awardItems.refereeItem ? (
												awardItems.refereeItem?.score
											) : (
												<HStack
													spacing={0}
													mr={-1}
													fontSize="sm"
													onClick={() => {
														setOpenBindEmailModal(true);
														onClose();
													}}
												>
													<Text>Verify</Text>
													<ChevronRightIcon boxSize={5} />
												</HStack>
											)
										}
									/>
								)}

								<AwardItem
									title="Referral"
									isFinish={!!awardItems.referralItem}
									value={
										!!awardItems.referralItem ? (
											awardItems.referralItem?.score
										) : (
											<HStack
												spacing={0}
												mr={-1}
												fontSize="sm"
												onClick={() => {
													setOpenInviteModal(true);
													onClose();
												}}
											>
												<Text>Invite</Text>
												<ChevronRightIcon boxSize={5} />
											</HStack>
										)
									}
								/>
							</VStack>
							<Flex w="full" mt="18px!" mb="1rem!" px={4}>
								<Button
									flex={1}
									variant="blackPrimary"
									size="sm"
									h="35px"
									borderRadius={6}
									color="#fae3b3"
									fontWeight="semibold"
									leftIcon={<Icon as={FaUserGroup} boxSize={4} />}
									onClick={() => {
										setOpenInviteModal(true);
										onClose();
									}}
								>
									Invite more friends
								</Button>
							</Flex>
						</VStack>
						<VStack my={4} bg="bg.lightYellow" borderRadius={10} opacity={0.95}>
							<HStack
								alignItems="center"
								w="full"
								fontWeight="semibold"
								fontSize="lg"
								spacing={3}
								mt={1}
								color="#ee6f2d"
								borderColor="rgba(0, 0, 0, 0.08)"
								borderBottomWidth="1px"
								px={4}
								py="10px"
							>
								<Center bg="#fff" p={2} borderRadius="full">
									<Icon as={IoRocketOutline} boxSize={5} />
								</Center>
								<VStack
									alignItems="flex-start"
									spacing={0}
									lineHeight="20px"
									fontSize="md"
								>
									<Text whiteSpace="nowrap">TOKEN2049 Journey</Text>
								</VStack>
							</HStack>
							<Box w="full" pl={6} pr={3} my={3}>
								<Typography.Text size="lg">
									By joining the <b>#Token2049</b> channel and engaging in
									conversations and &nbsp;
									<b>sharing on Twitter</b>, you will have the opportunity to
									win up to &nbsp;<b>2049 TCC!</b>
								</Typography.Text>
							</Box>
							<Flex w="full" mt={1} mb="1rem!" px={4}>
								<Button
									mt={2}
									w="full"
									variant="blackPrimary"
									size="sm"
									h="35px"
									borderRadius={6}
									color="#fae3b3"
									fontWeight="semibold"
									leftIcon={<Icon as={BsFillLightningChargeFill} boxSize={4} />}
									onClick={() =>
										window.open(
											"https://www.typography.vip/quest/token2049-quest?utm_source=apptypo&utm_campaign=token2049-contest "
										)
									}
								>
									View More Info
								</Button>
							</Flex>
						</VStack>
					</>
				}
				onClose={onClose}
			/>

			<BaseModal
				isOpen={showModal}
				onClose={() => {
					getAwards();
					getUserInfo();
					setShowModal.off();
				}}
				title="Verify Telegram"
			>
				<HStack color="text.black" flexFlow="row wrap" spacing={0}>
					<Box>Please copy the command and send it to our Telegram bot.</Box>
					<Flex pt={2}>
						<Tooltip
							placement="top"
							fontSize="xs"
							isOpen={hasCopied}
							label={hasCopied ? "Copied!" : "Copy"}
							hasArrow
						>
							<Button
								variant="blackPrimary"
								size="xs"
								color="gray.200"
								h="26px"
								rightIcon={<Icon as={BiCopy} boxSize={4} color="#fff" />}
								fontWeight="semibold"
								onClick={onCopy}
							>
								/bind_typo {toShortAddress(uuid, 10)}
							</Button>
						</Tooltip>
					</Flex>
				</HStack>
				<Flex mt={5} justify="space-between" color="gray.600">
					<Text> </Text>
					<Button
						variant="bluePrimary"
						size="xs"
						onClick={() => {
							window.open("https://t.me/TypoHunterBot");
						}}
					>
						Verify
					</Button>
				</Flex>
			</BaseModal>
		</>
	);
}
