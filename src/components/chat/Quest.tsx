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
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
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
import { BaseModal, Copy, Empty, InviteModal } from "components";
import { base64, toShortAddress } from "lib";
import { useAiStore } from "store/aiStore";
import { Card, Swiper, Popup } from "react-vant";
import useChatContext from "hooks/useChatContext";

const slides = [
	{
		url: "/images/moledao.png",
		link: "https://rewards.taskon.xyz/campaign/detail/13081",
	},
	{
		url: "/images/aisql/driver.png",
	},
	{
		url: "/images/aisql/knexus.webp",
		link: "https://knexus.xyz/create?utm_source=typo+quest&utm_campaign=kn+mbti",
	},
];

const sandboxSlides = [
	{
		url: "/images/aisql/driver.png",
	},
	{
		url: "/images/aisql/knexus.webp",
		link: "https://knexus.xyz/create?utm_source=typo+quest&utm_campaign=kn+mbti",
	},
];

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

export function Quest() {
	const { showQuest, setShowQuest, closeQuest } = useChatContext();
	const isOpen = showQuest;
	const onClose = closeQuest;
	const { onCopy, value, setValue, hasCopied } = useClipboard("");
	const { isInvite, userId, email } = useUserInfoStore();
	const [awards, setAwards] = useState<Incentive[]>([]);
	const { setOpenInviteModal, setOpenBindEmailModal } = useStore();
	const [showModal, setShowModal] = useBoolean(false);
	const [uuid, setUuid] = useState("");
	const { setTotalCoupon, setUsedCoupon } = useAiStore();
	const [showReferer, setShowReferer] = useState(false);

	console.log("showReferer", showReferer);

	const totalScore = useMemo(() => {
		return awards.reduce(
			(sum, item) => sum + parseInt(item.score as unknown as string),
			0
		);
	}, [awards]);

	const openReferer = () => {
		setShowReferer(true);
	};

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
		const Token2049Item = awards.filter((item) => item.type === "token2049")[0];
		const OlaGalaItem = awards.filter((item) => item.type === "OlaGala")[0];
		const CampaignRewardsItem =
			(GalleryItem?.score || 0) +
			(Gallery2Item?.score || 0) +
			(Token2049Item?.score || 0) +
			(OlaGalaItem?.score || 0);

		return {
			preRegItem,
			signInItem,
			typeHunterItem,
			verifyEmailItem,
			refereeItem,
			referralItem,
			TGItem,
			SubstackItem,
			CampaignRewardsItem,
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

	const list = slides;

	return (
		<>
			<Popup
				visible={showQuest}
				style={{ width: "90%", height: "100%" }}
				position="right"
				onClose={onClose}
			>
				<Flex w="100%" h="100%">
					<VStack pos="relative" w="full" h="full" gap={3} py="20px" px="15px">
						<CloseButton
							pos="absolute"
							right={1}
							onClick={onClose}
							zIndex={5}
						/>
						<HStack pos="relative" w="full" px="5px" h="24px">
							<Text fontWeight="semibold" fontSize="16px">
								Account
							</Text>
						</HStack>
						<Box
							h="calc(100% - 25px)"
							w="full"
							px="5px"
							mt={3}
							overflowY="scroll"
						>
							{/* <Swiper
								autoplay={5000}
								indicator={(total: number, current: any) => (
									<Box width="100%" marginBottom="10px">
										<Box
											width="100%"
											display="flex"
											alignItems="center"
											justifyContent="center"
											height="30px"
										>
											{new Array(3).fill(1).map((_: any, i: any) => (
												<Box
													key={i}
													width="8px"
													height="8px"
													borderRadius="8px"
													background={current == i ? `#D9D9D9` : `#F0F0F0`}
													margin="4px"
												/>
											))}
										</Box>
									</Box>
								)}
							>
								{list.map((item, index) => {
									return (
										<Swiper.Item key={item.url}>
											<Box
												borderRadius="8px"
												overflow="hidden"
												cursor="pointer"
												onClick={() => {
													item.link && window.open(item.link);
												}}
											>
												<Image alt="" src={item.url} fit="contain" />
											</Box>
										</Swiper.Item>
									);
								})}
							</Swiper> */}

							<Card
								round
								style={{
									width: "100%",
									marginTop: "10px",
									background: "#F7F8FA",
								}}
							>
								<Card.Header>
									<HStack color="black">
										<Box lineHeight="18px">
											<HStack spacing={1} fontSize="md">
												<Text mr={1}>{totalScore} TCC</Text>
											</HStack>
											<Text fontSize="10px" color="rgba(0, 0, 0, 0.20)">
												Balance
											</Text>
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
											borderStyle="solid"
										>
											<Box
												width="100%"
												display="flex"
												alignItems="center"
												justifyContent="flex-start"
												marginBottom="10px"
											>
												<Box
													background="#487C7E"
													borderRadius="20px"
													color="white"
													padding="5px 10px"
													marginRight="10px"
												>
													Earn
												</Box>
												{/* <Box
													background="#487C7E"
													borderRadius="20px"
													color="white"
													padding="5px 10px"
													opacity="50%"
												>
													Log
												</Box> */}
											</Box>
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

											<AwardItem
												title="Campaign Rewards"
												isFinish={!!awardItems.CampaignRewardsItem}
												value={awardItems.CampaignRewardsItem}
											/>

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
										background="#357E7F"
										size="sm"
										h="35px"
										borderRadius={8}
										color="white"
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
							{/* <Card
                round
                style={{
                boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
                width: "100%",
                marginTop: "10px",
                }}
                >
                <Card.Header>
                <HStack color="#ee6f2d">
                <Center bg="blackAlpha.200" p={2} borderRadius="full">
                <Icon as={IoRocketOutline} boxSize={5} />
                </Center>
                <Text whiteSpace="pre-wrap">
                Ask about Moledal on TypoGraphy AI!
                </Text>
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
                Participants who pose three Moledao-related questions in Typo
                will earn a matching badge and 100 TCC (Typo Chat Credit).
                Join us today!
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
                "https://www.typography.vip/quest/moledao-quest"
                )
                }
                >
                View More Info
                </Button>
                </Card.Footer>
                </Card> */}
						</Box>
					</VStack>
				</Flex>

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
					<Modal isOpen={showReferer} onClose={() => {}}>
						<ModalContent>
							<ModalBody>
								<Box
									width="284px"
									height="300px"
									background="linear-gradient(108deg, #FFE7B6 0%, #E4A930 114.32%)"
								></Box>
							</ModalBody>
						</ModalContent>
					</Modal>
				</BaseModal>
			</Popup>
		</>
	);
}
