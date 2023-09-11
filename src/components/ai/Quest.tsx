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
	InfoIcon,
	InfoOutlineIcon,
} from "@chakra-ui/icons";
import { useStore } from "store";
import { BaseModal, Copy, Empty } from "components";
import { base64, toShortAddress } from "lib";
import { useAiStore } from "store/aiStore";
import { Card } from "react-vant";

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
			<Box cursor="pointer" color="#000">
				{isFinish ? `+${value}` : value || 0}
			</Box>
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
		const Gallery2Item = awards.filter((item) => item.type === "gallery_s2")[0];

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
			Gallery2Item,
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
			<Flex w="100vw" h="100%">
				<VStack w="full" h="full" gap={3} px="12px">
					<Flex justify="space-between" w="full">
						<HStack w="full" mt={4} pos="relative">
							<Icon as={BiGift} boxSize={5} />
							<Text w="full" fontSize="md" fontWeight="semibold">
								QUEST
							</Text>
							<Badge
								ml="1"
								colorScheme="green"
								pos="absolute"
								left="82px"
								top="-8px"
								fontSize="12px"
								borderRadius={4}
							>
								Hot
							</Badge>
						</HStack>
						<CloseButton mr={-1} mt={4} onClick={onClose} />
					</Flex>
					<Card
						round
						style={{
							boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
							width: "100%",
						}}
					>
						<Card.Header>
							<HStack color="#ee6f2d">
								<Center bg="blackAlpha.200" p={2} borderRadius="full">
									<Image src="/images/aisql/tcc.svg" boxSize={5} alt="" />
								</Center>
								<Box lineHeight="19px">
									<HStack spacing={1} fontSize="md">
										<Text mr={1}>{totalScore} TCC</Text>
										<Text></Text>
									</HStack>
									<Text fontSize="sm">Total TCC Earned</Text>
								</Box>
							</HStack>
						</Card.Header>
						<Card.Body style={{ padding: 0 }}>
							<Box w="full">
								<VStack
									w="full"
									px={3}
									py={4}
									fontSize="sm"
									fontWeight="semibold"
									spacing={2}
									color="#000"
									borderColor="#ebedf0"
									borderTopWidth="1.5px"
									borderStyle="dashed"
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

									{awardItems.Gallery2Item && (
										<AwardItem
											title="Gallery S2"
											isFinish={!!awardItems.Gallery2Item}
											value={awardItems.Gallery2Item?.score}
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
							</Box>
						</Card.Body>
						<Card.Footer>
							<Button
								w="full"
								variant="blackPrimary"
								size="sm"
								h="35px"
								borderRadius={20}
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
						</Card.Footer>
					</Card>
					<Card
						round
						style={{
							boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
							width: "100%",
						}}
					>
						<Card.Header>
							<HStack color="#ee6f2d">
								<Center bg="blackAlpha.200" p={2} borderRadius="full">
									<Icon as={IoRocketOutline} boxSize={5} />
								</Center>
								<Text whiteSpace="nowrap">TOKEN2049 Journey</Text>
							</HStack>
						</Card.Header>
						<Card.Body style={{ padding: 0 }}>
							<Box
								w="full"
								py={3}
								px={5}
								fontSize="sm"
								color="#000"
								borderColor="#ebedf0"
								borderTopWidth="1.5px"
								borderStyle="dashed"
							>
								By participating in the <b>#Token2049</b> chat box and unleash
								your queries about <b>TOKEN2049</b> and our vibrant{" "}
								<b>communities</b> in conversations, and sharing on Twitter, you
								will have the opportunity to win up to 2049 TCC!
							</Box>
						</Card.Body>
						<Card.Footer>
							<Button
								w="full"
								variant="blackPrimary"
								size="sm"
								h="35px"
								borderRadius={20}
								color="#fae3b3"
								fontWeight="semibold"
								leftIcon={<Icon as={BsFillLightningChargeFill} boxSize={4} />}
								onClick={() =>
									window.open(
										"https://www.typography.vip/quest/partners-with-token2049?utm_source=apptypo&utm_campaign=token2049-contest"
									)
								}
							>
								View More Info
							</Button>
						</Card.Footer>
					</Card>
				</VStack>
			</Flex>

			{/* </Popup> */}

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
