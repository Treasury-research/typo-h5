import {
	Icon,
	Text,
	VStack,
	Button,
	HStack,
	Flex,
	Box,
	Image,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import { useState, useEffect, ReactNode, useMemo } from "react";
import { UploadAvatarModal } from "components";
import { useRouter } from "next/router";
import { Header } from "components/airdrop/Header";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useUserInfoStore } from "store/userInfoStore";
import { formatNumberWithCommas, formatScore, toShortAddress } from "lib";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Pagination } from "antd";
import { HashLoader } from "react-spinners";
import { ConnectBtn } from "components/ConnectBtn";
import api from "api";
import { isMobile } from "react-device-detect";

export default function Profile() {
	const router = useRouter();
	const { id } = router.query;
	const { account, userId, avatar, inviteScore, inviteCount } =
		useUserInfoStore();
	const [list, setList] = useState<any[]>([]);
	const [user, setUser] = useState<any>({});
	const [page, setPage] = useState<number>(1);
	const [total, setTotal] = useState<number>(10);
	const [tab, setTab] = useState<string>("Loyalty");

	const getAuth = async () => {
		if (userId) {
			const res: any = await api.get(`/api/auth`);
			if (res?.code === 200) {
				setUser(res.data);
				return res.data;
			}
		}

		return null;
	};

	const getRanks = async (pageNumber: number, tabName?: string) => {
		const name = tabName || tab;
		// const url = name === "Loyalty" ? "api/ranking" : "api/referral/ranking";
		const url = "api/referral/ranking";
		const result: any = await api.get(url, {
			params: {
				offset: (pageNumber - 1) * 10,
				limit: 10,
			},
		});
		if (result?.code === 200) {
			setList(result?.data.data as any);
			setTotal(result?.data.count);
		}
	};

	const onChange = (pageNumber: number) => {
		setPage(pageNumber);
		getRanks(Number(pageNumber));
	};

	const toMyRank = async (page_ranking?: String) => {
		const pageNumber = page_ranking
			? Math.floor((Number(page_ranking) - 1) / 10) + 1
			: 1;
		setPage(pageNumber);
		getRanks(Number(pageNumber));
	};

	useEffect(() => {
		getAuth();
		toMyRank(String(id || 1));
	}, [router, userId]);

	useEffect(() => {
		/*
		 * if (!isMobile && !location.host.includes("localhost")) {
		 *   location.host.includes("staging")
		 *   ? router.push("https://mobile.typography.staging.knn3.xyz/rank")
		 *   : router.push("https://mobile.typox.ai/rank");
		 * } */
	}, [router]);

	useEffect(() => {
		getRanks(page, tab);
	}, [tab, page]);

	useEffect(() => {
		getRanks(1, "Loyalty");
	}, []);

	return (
		<>
			<NextSeo title={"TypoX AI"} />
			<VStack
				w="100vw"
				h="100vh"
				bg="#000"
				bgImage="url('/images/airdrop-bg.svg')"
			>
				<Header />
				<Box
					className="no-scrollbar relative pt-[80px] overflow-auto"
					width="100%"
				>
					<VStack
						pos="relative"
						overflow="hidden"
						bgRepeat="no-repeat"
						bgSize="cover"
						w="100%"
						h="calc(100vh-40px)"
						p={6}
						flex={1}
						my="20px"
						borderRadius="16px"
						mt="0"
					>
						<Flex w="full" h="full" flexDirection="column">
							<VStack
								w="100%"
								justify="space-between"
								alignItems="center"
								// pl="40px"
								pb="30px"
								pt="20px"
							>
								<Box
									width="100%"
									margin="0 auto"
									marginBottom="24px"
									display="flex"
									alignItems="center"
									justifyContent="center"
								>
									<Box
										display="flex"
										background="rgba(255, 255, 255, 0.2)"
										borderRadius="4px"
										border="1px solid rgba(214, 214, 214, 0.2)"
										width="200px"
										height="32px"
										position="relative"
										boxSizing="border-box"
										fontFamily="JetBrainsMono"
									>
										<Box
											color="white"
											fontSize="14px"
											display="flex"
											alignItems="center"
											justifyContent="center"
											cursor="pointer"
											borderRadius="4px"
											overflow="hidden"
											position="absolute"
											top="-1px"
											left="-1px"
											width="calc(50% + 2px)"
											height="calc(100% + 2px)"
											sx={
												tab === "Loyalty"
													? {
															background:
																"linear-gradient(92deg, #487C7E 0%, #004D50 99.5%)",
															boxShadow: "0px 4px 12px 0px rgba(0, 0, 0, 0.12)",
															border: "1px solid rgba(255, 255, 255, 0.20)",
													  }
													: {}
											}
											onClick={() => {
												setPage(1);
												setTab("Loyalty");
												// getRanks(1, "Loyalty");
											}}
										>
											Loyalty
										</Box>
										<Box
											color="white"
											fontSize="14px"
											display="flex"
											alignItems="center"
											justifyContent="center"
											cursor="pointer"
											borderRadius="4px"
											overflow="hidden"
											position="absolute"
											top="-1px"
											width="calc(50% + 1px)"
											left="calc(50% + 1px)"
											height="calc(100% + 2px)"
											sx={
												tab === "Referral"
													? {
															background:
																"linear-gradient(92deg, #487C7E 0%, #004D50 99.5%)",
															boxShadow: "0px 4px 12px 0px rgba(0, 0, 0, 0.12)",
															border: "1px solid rgba(255, 255, 255, 0.20)",
													  }
													: {}
											}
											onClick={() => {
												setPage(1);
												setTab("Referral");
												// getRanks(1, "Referral");
											}}
										>
											Referral
										</Box>
									</Box>
								</Box>
								<VStack alignItems="center" w="100%">
									<VStack color="#fff" h="100px">
										<Box fontWeight="semibold" lineHeight="55px">
											<Text fontSize="24px">Season 1</Text>
										</Box>
										<Box fontWeight="semibold" lineHeight="55px" display="flex">
											<Text fontSize="40px">Leaderboard</Text>
											<Box paddingLeft="10px">
												<Image
													src="/images/rank/gold.png"
													objectFit="contain"
													h="full"
													width="40px"
												/>
											</Box>
										</Box>
									</VStack>
									{!(userId && account) && (
										<HStack
											mt="40px!"
											pl="20px"
											pr="10px"
											bg="whiteAlpha.800"
											w="100%"
											h="55px"
											fontSize="18px"
											alignItems="center"
											justify="center"
											borderRadius="12px"
											cursor="pointer"
											shadow="md"
											_hover={{ bg: "whiteAlpha.900" }}
										>
											<ConnectBtn bg="transparent" color="#000" />
										</HStack>
									)}
								</VStack>

								{/* <HStack w="full" color="#fff" fontSize="14px" pt="10px">
                    <Text>Empowered by</Text>
                    <Image src="/images/rank/topscore.svg" alt="" h="22px" />
                    </HStack> */}
							</VStack>
							<VStack flex="1" alignItems="center" justify="center">
								<VStack
									w="100%"
									maxW="550px"
									spacing="2px"
									borderRadius="12px"
									py="24px"
									px="20px"
									className="blue-filter"
									minH="300px"
									h="auto"
									justify="center"
									overflowY="auto"
								>
									{list.length > 0 && (
										<Flex
											w="full"
											py="5px"
											pl="6px"
											pr="6px"
											cursor="pointer"
											justify="space-between"
											lineHeight="20px"
											justifyContent="space-between"
											fontFamily="JetBrainsMono"
											fontSize="10px"
										>
											{tab === "Referral" && (
												<HStack alignItems="center" justify="center" w="100%">
													<Text w="20%">Rank</Text>
													<Text w="40%">Address</Text>
													<Text w="20%" color="#fff">
														Invited
													</Text>
													<Text w="20%" color="#fff" textAlign="right">
														Points
													</Text>
												</HStack>
											)}
											{tab === "Loyalty" && (
												<HStack alignItems="center" justify="center" w="100%">
													<Text w="33.33%">Rank</Text>
													<Text w="33.33%">Address</Text>
													<Text w="33.33%" color="#fff" textAlign="right">
														Loyalty Score
													</Text>
												</HStack>
											)}
										</Flex>
									)}

									{list.map((item, index) => {
										if (tab === "Referral") {
											return (
												<Flex
													w="full"
													key={index}
													bg={
														item.address &&
														item.address.toLocaleLowerCase() ===
															account.toLocaleLowerCase()
															? "blackAlpha.500"
															: "transparent"
													}
													borderRadius="md"
													py="5px"
													pl="6px"
													pr="6px"
													cursor="pointer"
													justify="space-between"
													lineHeight="20px"
													justifyContent="space-between"
													fontFamily="JetBrainsMono"
													_hover={{ bg: "blackAlpha.200" }}
													fontSize="10px"
												>
													<HStack w="100%" alignItems="center" justify="center">
														<Flex w="20%" justify="flex-start">
															{page === 1 && index === 0 ? (
																<Image
																	src="/images/rank/rank_1.png"
																	objectFit="contain"
																	boxSize={9}
																/>
															) : page === 1 && index === 1 ? (
																<Image
																	src="/images/rank/rank_2.png"
																	objectFit="contain"
																	boxSize={9}
																/>
															) : page === 1 && index === 2 ? (
																<Image
																	src="/images/rank/rank_3.png"
																	objectFit="contain"
																	boxSize={9}
																/>
															) : (
																<Text
																	fontSize="21px"
																	ml="10px"
																	fontWeight="semibold"
																>
																	{((page || 1) - 1) * 10 + index + 1}
																</Text>
															)}
														</Flex>

														<Text w="40%" fontWeight="semibold">
															{item?.address
																? toShortAddress(item.address, 10)
																: "--"}
														</Text>
														<Text
															w="20%"
															fontWeight="semibold"
															textAlign="center"
														>
															{item?.invited}
														</Text>
														<Text
															w="20%"
															fontWeight="semibold"
															textAlign="right"
														>
															{formatScore(item?.score || item?.invite_score)}
														</Text>
													</HStack>
												</Flex>
											);
										}

										return (
											<Flex
												w="full"
												key={index}
												bg={
													item.address &&
													item.address.toLocaleLowerCase() ===
														account.toLocaleLowerCase()
														? "blackAlpha.500"
														: "transparent"
												}
												borderRadius="md"
												py="5px"
												pl="6px"
												pr="6px"
												cursor="pointer"
												justify="space-between"
												lineHeight="20px"
												justifyContent="space-between"
												fontFamily="JetBrainsMono"
												_hover={{ bg: "blackAlpha.200" }}
												fontSize="10px"
											>
												<HStack w="100%" alignItems="center" justify="center">
													<Flex w="33.33%" justify="flex-start">
														{page === 1 && index === 0 ? (
															<Image
																src="/images/rank/rank_1.png"
																objectFit="contain"
																boxSize={9}
															/>
														) : page === 1 && index === 1 ? (
															<Image
																src="/images/rank/rank_2.png"
																objectFit="contain"
																boxSize={9}
															/>
														) : page === 1 && index === 2 ? (
															<Image
																src="/images/rank/rank_3.png"
																objectFit="contain"
																boxSize={9}
															/>
														) : (
															<Text
																fontSize="21px"
																ml="10px"
																fontWeight="semibold"
															>
																{((page || 1) - 1) * 10 + index + 1}
															</Text>
														)}
													</Flex>
													<Text w="33.33%" fontWeight="semibold">
														{item?.address
															? toShortAddress(item.address, 10)
															: "--"}
													</Text>
													<Text
														w="33.33%"
														fontWeight="semibold"
														textAlign="right"
													>
														{formatScore(item?.score || item?.invite_score)}
													</Text>
												</HStack>
											</Flex>
										);
									})}

									{list.length > 0 ? (
										<Flex
											pt="10px"
											className="rank-page"
											w="full"
											justify="flex-end"
										>
											<Pagination
												size="small"
												showQuickJumper
												showLessItems
												showSizeChanger={false}
												defaultCurrent={1}
												current={page}
												total={total}
												onChange={onChange}
											/>
										</Flex>
									) : (
										<HashLoader color="#36d7b7" />
									)}
								</VStack>
								<Text
									w="100%"
									color="#fff"
									textAlign="center"
									pt={1}
									fontSize="15px"
								>
									The Ranking is refreshed every 2 hours.
								</Text>
							</VStack>
							{userId && account && (
								<>
									<Flex
										mt="20px!"
										pl="20px"
										pr="10px"
										w="full"
										h="75px"
										alignItems="center"
										justify="space-between"
										borderRadius="12px"
										cursor="pointer"
										shadow="md"
										color="#fff"
										bg="rgba(255, 255, 255, 0.32)"
										backdropBlur="blur(100px)"
										_hover={{ bg: "whiteAlpha.600" }}
										onClick={() => toMyRank(user?.page_ranking || 0)}
										fontSize="10px"
									>
										<HStack>
											{avatar ? (
												<Image
													src={avatar}
													w="26px"
													h="26px"
													alt=""
													borderRadius="full"
												/>
											) : (
												<Jazzicon
													diameter={26}
													seed={jsNumberForAddress(account)}
												/>
											)}

											<VStack alignItems="flex-start" pl={1} spacing={1.4}>
												<Text fontWeight="semibold" fontSize="14px">
													{toShortAddress(account, 10)}
												</Text>
												<Text fontSize="13px">
													My Rank: #{user.page_ranking || "-"}
												</Text>
											</VStack>
										</HStack>

										{tab === "Referral" && (
											<VStack alignItems="center" pl={2} pr="2px" spacing={1.4}>
												<Text fontWeight="semibold" fontSize="14px">
													{inviteCount || "0"}
												</Text>
												<Text whiteSpace="nowrap">Invited</Text>
											</VStack>
										)}

										<HStack justify="flex-end" spacing={0}>
											<VStack
												alignItems="flex-end"
												pl={2}
												pr="2px"
												spacing={1.4}
											>
												<Text fontWeight="semibold" fontSize="14px">
													{formatScore(
														tab === "Loyalty" ? user?.score : inviteScore
													)}
												</Text>
												<Text whiteSpace="nowrap">
													{tab === "Loyalty" ? "Loyalty Score" : "Points"}
												</Text>
											</VStack>
											<ChevronRightIcon color="#fff" boxSize={8} />
										</HStack>
									</Flex>
								</>
							)}
						</Flex>
					</VStack>
				</Box>
			</VStack>
			<UploadAvatarModal />
		</>
	);
}
