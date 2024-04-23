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
import {
  formatNumberWithCommas,
  formatScore,
  isPhone,
  toShortAddress,
} from "lib";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Pagination } from "antd";
import { HashLoader } from "react-spinners";
import { ConnectBtn } from "components/ConnectBtn";
import api from "api";

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
    const url = name === "Loyalty" ? "api/ranking" : "api/referral/ranking";
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
    const isphone = isPhone();
    if (isphone && !location.host.includes("localhost")) {
      location.host.includes("staging")
      ? router.push("https://mobile.typography.staging.knn3.xyz/rank")
      : router.push("https://mobile.typox.ai/rank");
    }
  }, [router]);

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
        <Box className="no-scrollbar w-[1200px] relative mr-2 pt-[120px] overflow-auto p-10">
          <VStack
            pos="relative"
            overflow="hidden"
            bgRepeat="no-repeat"
            bgSize="cover"
            w="full"
            h="calc(100vh-40px)"
            p={6}
            flex={1}
            my="20px"
            mr="20px"
            borderRadius="16px"
          >
            <Flex w="full" minW="1100px" h="full">
              <VStack
                w="50%"
                justify="space-between"
                alignItems="flex-start"
                // pl="40px"
                pb="30px"
                pt="20px"
              >
                <Tabs variant="unstyled">
                  <TabList
                    w="198px"
                    borderRadius="md"
                    border="solid 1px rgba(214, 214, 214, 0.40)"
                  >
                    <Tab
                      w="100px"
                      color="#fff"
                      fontWeight="semibold"
                      borderRightRadius="md"
                      _selected={{
                        bg: "rgba(72, 124, 126, 0.60);",
                        borderRightWidth: "1px",
                        borderColor: "rgba(214, 214, 214, 0.40)",
                      }}
                      onClick={() => {
                        setPage(1);
                        setTab("Loyalty");
                        getRanks(1, "Loyalty");
                      }}
                    >
                      Loyalty
                    </Tab>
                    <Tab
                      w="100px"
                      color="#fff"
                      fontWeight="semibold"
                      borderLeftRadius="md"
                      _selected={{
                        bg: "rgba(72, 124, 126, 0.60);",
                        borderLeftWidth: "1px",
                        borderColor: "rgba(214, 214, 214, 0.40)",
                      }}
                      onClick={() => {
                        setPage(1);
                        setTab("Referral");
                        getRanks(1, "Referral");
                      }}
                    >
                      Referral
                    </Tab>
                  </TabList>
                </Tabs>
                <VStack alignItems="flex-start" w="450px">
                  <HStack color="#fff" h="100px">
                    <Box fontWeight="semibold" lineHeight="55px">
                      <Text fontSize="40px">Season 1</Text>
                      <Text fontSize="48px">Leaderboard</Text>
                    </Box>
                    <Image
                    src="/images/rank/gold.png"
                    objectFit="contain"
                    h="full"
                    />
                  </HStack>

                  {userId && account ? (
                    <>
                      <Flex
                        mt="50px!"
                        pl="20px"
                        pr="10px"
                        w="full"
                        h="75px"
                        fontSize="16px"
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
                      >
                        <HStack>
                          {avatar ? (
                            <Image
                            src={avatar}
                            w="48px"
                            h="48px"
                            alt=""
                            borderRadius="full"
                            />
                          ) : (
                            <Jazzicon
                            diameter={48}
                            seed={jsNumberForAddress(account)}
                            />
                          )}

                          <VStack alignItems="flex-start" pl={1} spacing={1.4}>
                            <Text fontWeight="semibold">
                              {toShortAddress(account, 10)}
                            </Text>
                            <Text fontSize="13px">
                              My Rank: #{user.page_ranking || "-"}
                            </Text>
                          </VStack>
                        </HStack>

                        {tab === "Referral" && (
                          <VStack
                            alignItems="center"
                            pl={2}
                            pr="2px"
                            spacing={1.4}
                          >
                            <Text fontWeight="semibold">{inviteCount}</Text>
                            <Text fontSize="13px" whiteSpace="nowrap">
                              Invited
                            </Text>
                          </VStack>
                        )}

                        <HStack justify="flex-end" spacing={0}>
                          <VStack
                            alignItems="flex-end"
                            pl={2}
                            pr="2px"
                            spacing={1.4}
                          >
                            <Text fontWeight="semibold">
                              {formatScore(
                                tab === "Loyalty" ? user?.score : inviteScore
                              )}
                            </Text>
                            <Text fontSize="13px" whiteSpace="nowrap">
                              {tab === "Loyalty" ? "Loyalty Score" : "Points"}
                            </Text>
                          </VStack>
                          <ChevronRightIcon color="#fff" boxSize={8} />
                        </HStack>
                      </Flex>
                    </>
                  ) : (
                    <HStack
                      mt="40px!"
                      pl="20px"
                      pr="10px"
                      bg="whiteAlpha.800"
                      w="80%"
                      minW="330px"
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
                  w="88%"
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
                      pr="20px"
                      cursor="pointer"
                      justify="space-between"
                      lineHeight="20px"
                      justifyContent="space-between"
                      fontFamily="math"
                    >
                      <HStack alignItems="center" justify="center">
                        <Text w="70px">Rank</Text>
                        <Text w="150px" pl="10px" fontSize="14px">
                          Address
                        </Text>
                        {tab === "Referral" && (
                          <Text w="80px" color="#fff" pl="15px" fontSize="15px">
                            Invited
                          </Text>
                        )}
                      </HStack>

                      <Text color="#fff" textAlign="right" fontSize="15px">
                        {tab === "Loyalty" ? "Loyalty Score" : "Points"}
                      </Text>
                    </Flex>
                  )}

                  {list.map((item, index) => {
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
                        pr="20px"
                        cursor="pointer"
                        justify="space-between"
                        lineHeight="20px"
                        justifyContent="space-between"
                        fontFamily="math"
                        _hover={{ bg: "blackAlpha.200" }}
                      >
                        <HStack alignItems="center" justify="center">
                          <Flex w="70px" justify="flex-start">
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

                          <Text
                            w="150px"
                            pl="10px"
                            fontWeight="semibold"
                            fontSize="14px"
                          >
                            {item?.address
                            ? toShortAddress(item.address, 15)
                            : "--"}
                          </Text>
                          {tab === "Referral" && (
                            <Text
                              w="80px"
                              fontWeight="semibold"
                              textAlign="center"
                            >
                              {item?.invited}
                            </Text>
                          )}
                        </HStack>

                        <Text
                          fontWeight="semibold"
                          fontSize="14px"
                          lineHeight="36px"
                        >
                          {formatScore(item?.score || item?.invite_score)}
                        </Text>
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
                  w="500px"
                  color="#fff"
                  textAlign="right"
                  pt={1}
                  fontSize="15px"
                >
                  The Ranking is refreshed every 2 hours.
                </Text>
              </VStack>
            </Flex>
          </VStack>
        </Box>
      </VStack>
      <UploadAvatarModal />
    </>
  );
}
