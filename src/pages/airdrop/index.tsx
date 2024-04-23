import {
  Icon,
  Text,
  VStack,
  Button,
  HStack,
  Flex,
  Box,
  Image,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import { useState, useEffect, ReactNode, useMemo } from "react";
import { useUserInfoStore } from "store/userInfoStore";
import { toShortAddress, formatScore, isPhone } from "lib";
import useTranslation from "hooks/useTranslation";
import api from "api";
import { Empty, UploadAvatarModal } from "components";
import { useRouter } from "next/router";
import { LiaParachuteBoxSolid } from "react-icons/lia";
import { useStore } from "store";
import { Header } from "components/airdrop/Header";
import ReferIcon from "components/icons/Refer";
import FollowIcon from "components/icons/Follow";
import LinkIcon from "components/icons/Link";
import ShareIcon from "components/icons/Share";
import DailyIcon from "components/icons/Daily";
import ClaimedIcon from "components/icons/Claimed";
import moment from "moment";
import { ReferralModal } from "components/connect/ReferralModal";
import useWallet from "hooks/useWallet";

export default function Profile() {
  const router = useRouter();
  const { showToast } = useStore();
  const { openReferralModal, setOpenReferralModal } = useStore();
  const { userId, rankTotalCount } = useUserInfoStore();
  const [isphone, setIsphone] = useState(false);
  const [phrase, setPhrase] = useState("season 2");

  const [task2Status, setTask2Status] = useState(0);
  const [task3Status, setTask3Status] = useState(0);
  const [task4Status, setTask4Status] = useState(0);

  const [task2Loading, setTask2Loading] = useState(false);
  const [task3Loading, setTask3Loading] = useState(false);
  const [task4Loading, setTask4Loading] = useState(false);

  const { openConnectWallet } = useWallet();

  const [authInfo, setAuthInfo] = useState<any>({});
  const [taskScore, setTaskScore] = useState<number>(0);
  const [questList, setQuestList] = useState<any>({});
  const [awards, setAwards] = useState(0);
  const [zealyTask, setZealyTask] = useState<number>(0);

  const getUserInfo = async () => {
    const res: any = await api.get(`/api/auth`);

    if (res?.code === 200) {
      setAuthInfo({ ...res.data });
      setTaskScore(res.data.score);
    }
  };

  const getZealyLog = async () => {
    const res: any = await api.get(`/api/zealy/log`);
    console.log("getZealyLog", res);

    if (res?.code === 200) {
      let count = 0;
      const today = moment().startOf("day");
      (res?.data?.list || []).map((item: any) => {
        const checkDate = moment(item.created_at);
        if (checkDate.isSame(today, "day")) {
          count++;
        }
      });

      setZealyTask(count);
      setQuestList(res.data?.list || []);
    }
  };

  const getTaskStatus = async () => {
    const res: any = await api.get(`/api/auth/task`);
    console.log("getTaskStatus", res);
    if (res?.code === 200) {
      res.data.map((item: any) => {
        if (item.task === "twitter") {
          setTask2Status(item.status);
        }
        if (item.task === "login") {
          setTask3Status(item.status);
        }
        if (item.task === "share") {
          setTask4Status(item.status);
        }
      });
    }
  };

  const getAwards = async () => {
    const res: any = await api.get(`/api/airdrop`);
    console.log("getAwards", res);
    if (res?.code === 200) {
      setAwards(res.data);
    }
  };

  const updateTask = async (task: string, status: number) => {
    try {
      const res: any = await api.post(`/api/task/update`, {
        task: task,
        status: status,
      });
      console.log("claimTask2", res);
      if (res?.code === 200) {
      }
      await getTaskStatus();
      await getUserInfo();
      setTask2Loading(false);
      setTask3Loading(false);
      setTask4Loading(false);
    } catch (error: any) {
      console.log("error", error.message);
      setTask2Loading(false);
      setTask3Loading(false);
      setTask4Loading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserInfo();
      getZealyLog();
      getAwards();
      getTaskStatus();
      setTask3Status(1);
    } else {
      setTask3Status(0);
    }
  }, [userId]);

  useEffect(() => {
    isPhone() ? setIsphone(true) : setIsphone(false);
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
          className="no-scrollbar relative mr-2 pt-[120px] overflow-auto p-0"
          width="100%"
        >
          <Box width="1000px" margin="0 auto" marginBottom="24px">
            <Box
              display="flex"
              background="rgba(255, 255, 255, 0.2)"
              borderRadius="4px"
              border="1px solid rgba(214, 214, 214, 0.2)"
              width="246px"
              height="40px"
              position="relative"
              boxSizing="border-box"
              fontFamily="JetBrainsMono"
            >
              <Box
                color="white"
                fontSize="16px"
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
                phrase === "season 2"
                ? {
                  background:
                                                                                                        "linear-gradient(92deg, #487C7E 0%, #004D50 99.5%)",
                  boxShadow: "0px 4px 12px 0px rgba(0, 0, 0, 0.12)",
                  border: "1px solid rgba(255, 255, 255, 0.20)",
                }
                : {}
                }
                onClick={() => setPhrase("season 2")}
                // fontFamily="JetBrains Mono"
              >
                Season II
              </Box>
              <Box
                color="white"
                fontSize="16px"
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
                phrase === "season 1"
                ? {
                  background:
                                                                                                        "linear-gradient(92deg, #487C7E 0%, #004D50 99.5%)",
                  boxShadow: "0px 4px 12px 0px rgba(0, 0, 0, 0.12)",
                  border: "1px solid rgba(255, 255, 255, 0.20)",
                }
                : {}
                }
                onClick={() => setPhrase("season 1")}
                // fontFamily="JetBrains Mono"
              >
                Season I
              </Box>
            </Box>
          </Box>
          {phrase === "season 2" && (
            <Box
              background="rgba(252, 98, 255, 0.30)"
              height="112px"
              marginBottom="24px"
            >
              <Box
                width="1000px"
                margin="0 auto"
                height="100%"
                display="flex"
                alignItems="center"
                position="relative"
              >
                <Box display="flex" alignItems="flex-end">
                  <Box
                    background="linear-gradient(94deg, #FF7A00 0%, #C54AFF 99.46%)"
                    backgroundClip="text"
                    textShadow="0px 0px 12px rgba(255, 127, 86, 0.80)"
                    color="#FF7A00"
                    fontSize="80px"
                    lineHeight="72px"
                    fontFamily="Neuropolitical"
                    sx={{
                      "-webkit-background-clip": "text",
                      "-webkit-text-fill-color": "transparent",
                      "@property --num": {
                        syntax: `'<integer>'`,
                        initialValue: "0",
                        inherits: "false",
                      },
                      "&": {
                        transition: "--num 1s",
                        counterReset: "num var(--num)",
                        "--num": taskScore,
                      } as any,
                      "&::after": {
                        content: "counter(num)",
                      },
                    }}
                  >
                    {/* <Odometer value={taskScore} format="(.ddd),dd" /> */}
                  </Box>
                  <Box
                    color="white"
                    fontSize="28px"
                    marginLeft="10px"
                    fontFamily="JetBrainsMono"
                  >
                    points
                  </Box>
                </Box>
                <HStack
                  pos="absolute"
                  color="#fff"
                  fontSize="12px"
                  top="calc(50% - 17px)"
                  right="20px"
                  spacing={1}
                  zIndex={5}
                  h="35px"
                  pl={1}
                  bg="whiteAlpha.300"
                  borderRadius={5}
                >
                  <VStack spacing={1} lineHeight="10px" pt="5px">
                    <Text fontWeight="semibold">
                      {authInfo?.page_ranking
                      ? `# ${authInfo?.page_ranking}`
                      : "--"}
                    </Text>
                    <Text fontSize="xs" transform="scale(0.76)">
                      Out of {rankTotalCount}
                    </Text>
                  </VStack>

                  <Image
                  h="full"
                  src="/images/profile/rank.svg"
                  className="ml-4 cursor-pointer hover:opacity-70"
                  onClick={() =>
                    router.push(
                      `/airdrop/leaderboard/${authInfo.page_ranking || 1}`
                    )
                  }
                  alt=""
                  />
                </HStack>
              </Box>
            </Box>
          )}
          {phrase === "season 2" && (
            <Box color="white" width="1000px" margin="0 auto">
              {/* <!--refer friends--> */}
              <Box
                width="100%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderRadius="12px"
                border="1px solid #FFF"
                background="rgba(255, 255, 255, 0.20)"
                padding="28px 54px"
                marginBottom="24px"
              >
                <Box>
                  <Box display="flex" alignItems="flex-end">
                    <Box
                      fontSize="32px"
                      lineHeight="32px"
                      fontFamily="JetBrainsMonoBold"
                    >
                      +50
                    </Box>
                    <Box
                      fontSize="20px"
                      fontFamily="JetBrainsMono"
                      marginLeft="15px"
                    >
                      points
                    </Box>
                  </Box>
                  <Box
                    fontSize="20px"
                    marginTop="12px"
                    fontFamily="JetBrainsMono"
                  >
                    Copy link and forward
                  </Box>
                </Box>
                <Box>
                  <Box
                    fontSize="20px"
                    background="linear-gradient(92deg, #487C7E 0%, #004D50 99.5%)"
                    boxShadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25)"
                    padding="12px 10px"
                    borderRadius="8px"
                    display="flex"
                    alignItems="center"
                    cursor="pointer"
                    height="52px"
                    width="228px"
                    fontFamily="JetBrainsMono"
                    onClick={() => setOpenReferralModal(true)}
                  >
                    <Box marginRight="8px">
                      <ReferIcon />
                    </Box>
                    <Box>Refer Friends</Box>
                  </Box>
                </Box>
              </Box>

              {/* <!--follow typox--> */}
              {task2Status !== 2 && (
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderRadius="12px"
                  border="1px solid #FFF"
                  background="rgba(255, 255, 255, 0.20)"
                  padding="28px 54px"
                  marginBottom="24px"
                >
                  <Box>
                    <Box display="flex" alignItems="flex-end">
                      <Box
                        fontSize="32px"
                        lineHeight="32px"
                        fontFamily="JetBrainsMonoBold"
                      >
                        +100
                      </Box>
                      <Box
                        fontSize="20px"
                        fontFamily="JetBrainsMono"
                        marginLeft="15px"
                      >
                        points
                      </Box>
                    </Box>
                    <Box
                      fontSize="20px"
                      marginTop="12px"
                      fontFamily="JetBrainsMono"
                    >
                      {`Follow @TypoX_AI on Twitter`}
                    </Box>
                  </Box>
                  <Box>
                    {!task2Status && (
                      <Box
                        fontSize="20px"
                        background="linear-gradient(92deg, #487C7E 0%, #004D50 99.5%)"
                        boxShadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25)"
                        padding="12px 10px"
                        borderRadius="8px"
                        display="flex"
                        alignItems="center"
                        cursor="pointer"
                        height="52px"
                        width="228px"
                        fontFamily="JetBrainsMono"
                        onClick={() => {
                          setTask2Loading(true);
                          updateTask("twitter", 1);
                          window.open("https://twitter.com/TypoX_AI");
                        }}
                      >
                        <Box marginRight="8px">
                          <FollowIcon />
                        </Box>
                        <Box>Follow TypoX</Box>
                      </Box>
                    )}
                    {task2Status === 1 && (
                      <Box
                        fontSize="20px"
                        background="linear-gradient(92deg, #487C7E 0%, #004D50 99.5%)"
                        boxShadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25)"
                        padding="12px 10px"
                        borderRadius="8px"
                        display="flex"
                        alignItems="center"
                        height="52px"
                        fontFamily="JetBrainsMono"
                        onClick={() => {
                          setTask2Loading(true);
                          updateTask("twitter", 2);
                        }}
                        width={task2Loading ? "178px" : "132px"}
                        pointerEvents={task2Loading ? "none" : "all"}
                        opacity={task2Loading ? "0.5" : "1"}
                        cursor={task2Loading ? "not-allowed" : "pointer"}
                      >
                        <Box marginRight="8px">
                          <FollowIcon />
                        </Box>
                        <Box>{task2Loading ? "Claiming" : "Claim"}</Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {/* <!--login--> */}
              {task3Status !== 2 && (
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderRadius="12px"
                  border="1px solid #FFF"
                  background="rgba(255, 255, 255, 0.20)"
                  padding="28px 54px"
                  marginBottom="24px"
                >
                  <Box>
                    <Box display="flex" alignItems="flex-end">
                      <Box
                        fontSize="32px"
                        lineHeight="32px"
                        fontFamily="JetBrainsMonoBold"
                      >
                        +50
                      </Box>
                      <Box
                        fontSize="20px"
                        fontFamily="JetBrainsMono"
                        marginLeft="15px"
                      >
                        points
                      </Box>
                    </Box>
                    <Box
                      fontSize="20px"
                      marginTop="12px"
                      fontFamily="JetBrainsMono"
                    >
                      Login and connect your wallet on TypoX
                    </Box>
                  </Box>
                  <Box>
                    {!task3Status && (
                      <Box
                        fontSize="20px"
                        background="linear-gradient(92deg, #487C7E 0%, #004D50 99.5%)"
                        boxShadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25)"
                        padding="12px 10px"
                        borderRadius="8px"
                        display="flex"
                        alignItems="center"
                        cursor="pointer"
                        height="52px"
                        width="228px"
                        fontFamily="JetBrainsMono"
                        onClick={openConnectWallet}
                      >
                        <Box marginRight="8px">
                          <LinkIcon />
                        </Box>
                        <Box>Link Wallet</Box>
                      </Box>
                    )}
                    {task3Status === 1 && (
                      <Box
                        fontSize="20px"
                        background="linear-gradient(92deg, #487C7E 0%, #004D50 99.5%)"
                        boxShadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25)"
                        padding="12px 10px"
                        borderRadius="8px"
                        display="flex"
                        alignItems="center"
                        height="52px"
                        fontFamily="JetBrainsMono"
                        onClick={() => {
                          setTask3Loading(true);
                          updateTask("login", 2);
                        }}
                        width={task3Loading ? "178px" : "132px"}
                        pointerEvents={task3Loading ? "none" : "all"}
                        opacity={task3Loading ? "0.5" : "1"}
                        cursor={task3Loading ? "not-allowed" : "pointer"}
                      >
                        <Box marginRight="8px">
                          <LinkIcon />
                        </Box>
                        <Box>{task3Loading ? "Claiming" : "Claim"}</Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {/* <!--share twitter--> */}
              {task4Status !== 2 && (
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderRadius="12px"
                  border="1px solid #FFF"
                  background="rgba(255, 255, 255, 0.20)"
                  padding="28px 54px"
                  marginBottom="24px"
                >
                  <Box>
                    <Box display="flex" alignItems="flex-end">
                      <Box
                        fontSize="32px"
                        lineHeight="32px"
                        fontFamily="JetBrainsMono"
                      >
                        +100
                      </Box>
                      <Box
                        fontSize="20px"
                        fontFamily="JetBrainsMono"
                        marginLeft="15px"
                      >
                        points
                      </Box>
                    </Box>
                    <Box
                      fontSize="20px"
                      marginTop="12px"
                      fontFamily="JetBrainsMono"
                    >
                      Share your conversation with TypoX on Twitter
                    </Box>
                  </Box>
                  <Box>
                    {!task4Status && (
                      <Box
                        fontSize="20px"
                        background="linear-gradient(92deg, #487C7E 0%, #004D50 99.5%)"
                        boxShadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25)"
                        padding="12px 10px"
                        borderRadius="8px"
                        display="flex"
                        alignItems="center"
                        cursor="pointer"
                        height="52px"
                        width="228px"
                        fontFamily="JetBrainsMono"
                        onClick={() => {
                          setTask4Status(1);
                          window.open(`${location.origin}/explorer`);
                        }}
                      >
                        <Box marginRight="8px">
                          <ShareIcon />
                        </Box>
                        <Box>Share Twitter</Box>
                      </Box>
                    )}
                    {task4Status === 1 && (
                      <Box
                        fontSize="20px"
                        background="linear-gradient(92deg, #487C7E 0%, #004D50 99.5%)"
                        boxShadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25)"
                        padding="12px 10px"
                        borderRadius="8px"
                        display="flex"
                        alignItems="center"
                        height="52px"
                        fontFamily="JetBrainsMono"
                        onClick={() => {
                          const isSharedTask =
                            localStorage.getItem("isSharedTask");
                          if (isSharedTask === "true") {
                            setTask4Loading(true);
                            updateTask("share", 2);
                          } else {
                            showToast(
                              "Please share your conversation!",
                              "warning"
                            );
                          }
                        }}
                        width={task4Loading ? "178px" : "132px"}
                        pointerEvents={task4Loading ? "none" : "all"}
                        opacity={task4Loading ? "0.5" : "1"}
                        cursor={task4Loading ? "not-allowed" : "pointer"}
                      >
                        <Box marginRight="8px">
                          <ShareIcon />
                        </Box>
                        <Box>{task4Loading ? "Claiming" : "Claim"}</Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {/* <!--zealy--> */}
              <Box
                width="100%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexDirection="column"
                borderRadius="12px"
                border="1px solid #FFF"
                background="rgba(255, 255, 255, 0.20)"
                padding="28px 54px"
                marginBottom="24px"
                fontFamily="JetBrainsMono"
              >
                <Box
                  borderBottom="1px solid rgba(255, 255, 255, 0.6)"
                  width="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingBottom="24px"
                >
                  <Box>
                    <Box display="flex" alignItems="flex-end">
                      <Box
                        fontSize="32px"
                        lineHeight="32px"
                        fontFamily="JetBrainsMonoBold"
                      >
                        +50
                      </Box>
                      <Box fontSize="20px" marginLeft="15px">
                        points/each
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box
                      fontSize="16px"
                      marginRight="10px"
                      fontFamily="JetBrainsMonoExtraBold"
                    >
                      {`${zealyTask}/5`}
                    </Box>
                    <Box marginRight="20px" fontSize="16px">
                      Today
                    </Box>
                    <Box
                      fontSize="20px"
                      background="linear-gradient(92deg, #487C7E 0%, #004D50 99.5%)"
                      boxShadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25)"
                      padding="12px 10px"
                      paddingLeft="18px"
                      borderRadius="8px"
                      display="flex"
                      alignItems="center"
                      cursor="pointer"
                      height="52px"
                      width="136px"
                      onClick={() => {
                        window.open("https://zealy.io/cw/typoxai/questboard");
                      }}
                    >
                      <Box
                        marginRight="8px"
                        width="28px"
                        height="28px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                      >
                        <Box position="absolute" top="0" left="0" zIndex="1">
                          <DailyIcon />
                        </Box>
                        <Box zIndex="2">
                          <Image src="/images/z-icon.png" w="16px" h="16px" />
                        </Box>
                      </Box>
                      <Box>Daily</Box>
                    </Box>
                  </Box>
                </Box>
                <VStack
                  w="full"
                  spacing={6}
                  h={questList?.length > 0 ? "300px" : "120px"}
                  pt="20px"
                  className="no-scrollbar"
                  overflowY="scroll"
                  fontSize="20px"
                  px={2}
                  pb={2}
                >
                  {questList?.length > 0 ? (
                    (questList || []).map((item: any, index: number) => {
                      return (
                        <Box
                          key={index}
                          w="full"
                          display="flex"
                          padding="5px 0"
                        >
                          <Box
                            width="33.3%"
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                          >
                            <Text>{item.type}</Text>
                          </Box>
                          <Box
                            width="33.3%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Text w="150px" textAlign="right">
                              +{formatScore(item.score)}
                            </Text>
                          </Box>
                          <Box
                            width="33.3%"
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-end"
                          >
                            {moment(item.created_at).format("YYYY/MM/DD HH:mm")}
                          </Box>
                        </Box>
                      );
                    })
                  ) : (
                    <Box
                      width="100%"
                      paddingTop="40px"
                      fontSize="20px"
                      textAlign="center"
                    >
                      No Tasks
                    </Box>
                  )}
                </VStack>
              </Box>

              {task2Status === 2 && (
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderRadius="12px"
                  border="1px solid #FFF"
                  background="rgba(255, 255, 255, 0.20)"
                  padding="28px 54px"
                  marginBottom="24px"
                >
                  <Box>
                    <Box display="flex" alignItems="flex-end">
                      <Box
                        fontSize="32px"
                        lineHeight="32px"
                        fontFamily="JetBrainsMonoBold"
                      >
                        +100
                      </Box>
                      <Box
                        fontSize="20px"
                        fontFamily="JetBrainsMono"
                        marginLeft="15px"
                      >
                        points
                      </Box>
                    </Box>
                    <Box
                      fontSize="20px"
                      marginTop="12px"
                      fontFamily="JetBrainsMono"
                    >
                      {`Follow @TypoX_AI on Twitter`}
                    </Box>
                  </Box>
                  <Box>
                    <Box
                      fontSize="20px"
                      background="rgba(255, 255, 255, 0.30)"
                      boxShadow="0px 0px 6px 0px rgba(0, 0, 0, 0.25)"
                      padding="12px 10px"
                      borderRadius="8px"
                      display="flex"
                      alignItems="center"
                      height="52px"
                      fontFamily="JetBrainsMono"
                      width="156px"
                    >
                      <Box marginRight="8px">
                        <ClaimedIcon />
                      </Box>
                      <Box>Claimed</Box>
                    </Box>
                  </Box>
                </Box>
              )}
              {task3Status === 2 && (
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderRadius="12px"
                  border="1px solid #FFF"
                  background="rgba(255, 255, 255, 0.20)"
                  padding="28px 54px"
                  marginBottom="24px"
                >
                  <Box>
                    <Box display="flex" alignItems="flex-end">
                      <Box
                        fontSize="32px"
                        lineHeight="32px"
                        fontFamily="JetBrainsMonoBold"
                      >
                        +50
                      </Box>
                      <Box
                        fontSize="20px"
                        fontFamily="JetBrainsMono"
                        marginLeft="15px"
                      >
                        points
                      </Box>
                    </Box>
                    <Box
                      fontSize="20px"
                      marginTop="12px"
                      fontFamily="JetBrainsMono"
                    >
                      Login and connect your wallet on TypoX
                    </Box>
                  </Box>
                  <Box>
                    <Box
                      fontSize="20px"
                      background="rgba(255, 255, 255, 0.30)"
                      boxShadow="0px 0px 6px 0px rgba(0, 0, 0, 0.25)"
                      padding="12px 10px"
                      borderRadius="8px"
                      display="flex"
                      alignItems="center"
                      height="52px"
                      fontFamily="JetBrainsMono"
                      width="156px"
                    >
                      <Box marginRight="8px">
                        <ClaimedIcon />
                      </Box>
                      <Box>Claimed</Box>
                    </Box>
                  </Box>
                </Box>
              )}
              {task4Status === 2 && (
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderRadius="12px"
                  border="1px solid #FFF"
                  background="rgba(255, 255, 255, 0.20)"
                  padding="28px 54px"
                  marginBottom="24px"
                >
                  <Box>
                    <Box display="flex" alignItems="flex-end">
                      <Box
                        fontSize="32px"
                        lineHeight="32px"
                        fontFamily="JetBrainsMono"
                      >
                        +100
                      </Box>
                      <Box
                        fontSize="20px"
                        fontFamily="JetBrainsMono"
                        marginLeft="15px"
                      >
                        points
                      </Box>
                    </Box>
                    <Box
                      fontSize="20px"
                      marginTop="12px"
                      fontFamily="JetBrainsMono"
                    >
                      Share your conversation with TypoX on Twitter
                    </Box>
                  </Box>
                  <Box>
                    <Box
                      fontSize="20px"
                      background="rgba(255, 255, 255, 0.30)"
                      boxShadow="0px 0px 6px 0px rgba(0, 0, 0, 0.25)"
                      padding="12px 10px"
                      borderRadius="8px"
                      display="flex"
                      alignItems="center"
                      height="52px"
                      fontFamily="JetBrainsMono"
                      width="156px"
                    >
                      <Box marginRight="8px">
                        <ClaimedIcon />
                      </Box>
                      <Box>Claimed</Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          )}
          {phrase === "season 1" && (
            <VStack
              pos="relative"
              pb={10}
              alignItems="flex-start"
              className="blue-filter py-5 px-10 rounded-[10px]"
              width="1000px"
              margin="0 auto"
              marginBottom="24px"
            >
              <HStack
                pos="absolute"
                color="#fff"
                fontSize="12px"
                bottom="5px"
                right="8px"
                spacing={1}
                zIndex={5}
                transform="scale(0.8)"
              >
                <Text>Empowered by</Text>
                <Image src="/images/rank/topscore.svg" alt="" h="22px" />
              </HStack>
              <Flex w="full" justify="space-between" alignItems="center">
                <Text fontWeight="semibold" fontSize="20px">
                  Airdrop
                </Text>
                <HStack
                  pos="absolute"
                  color="#fff"
                  fontSize="12px"
                  top="20px"
                  right="40px"
                  spacing={1}
                  zIndex={5}
                  h="35px"
                  pl={1}
                  bg="whiteAlpha.300"
                  borderRadius={5}
                >
                  <VStack spacing={1} lineHeight="10px" pt="5px">
                    <Text fontWeight="semibold">
                      {authInfo?.page_ranking
                      ? `# ${authInfo?.page_ranking}`
                      : "--"}
                    </Text>
                    <Text fontSize="xs" transform="scale(0.76)">
                      Out of {rankTotalCount}
                    </Text>
                  </VStack>

                  <Image
                  h="full"
                  src="/images/profile/rank.svg"
                  className="ml-4 cursor-pointer hover:opacity-70"
                  onClick={() =>
                    router.push(
                      `/airdrop/leaderboard/${authInfo.page_ranking || 1}`
                    )
                  }
                  alt=""
                  />
                </HStack>
              </Flex>
              <HStack w="full" justify="space-between" spacing={3} pt="14px">
                <HStack
                  p="4"
                  borderWidth="1px"
                  borderColor="whiteAlpha.300"
                  flex={1}
                  borderRadius={5}
                  justify="space-between"
                >
                  <Box>
                    <Text fontSize="16px" fontWeight="semibold" mb={1}>
                      {awards} $TPX
                    </Text>
                    <Text fontSize="12px">Season I</Text>
                  </Box>
                  <HStack
                    w="40px"
                    h="40px"
                    justify="center"
                    borderRadius="full"
                    bg="blackAlpha.500"
                  >
                    <Icon as={LiaParachuteBoxSolid} boxSize={7} color="#fff" />
                  </HStack>
                </HStack>
                <HStack
                  p="4"
                  borderWidth="1px"
                  borderColor="whiteAlpha.300"
                  flex={1}
                  borderRadius={5}
                  justify="space-between"
                >
                  <Box>
                    <Text fontSize="16px" fontWeight="semibold" mb={1}>
                      {formatScore(authInfo.score)} points
                    </Text>
                  </Box>
                  <Image
                  src="/images/profile/topscore.png"
                  alt=""
                  boxSize={10}
                  />
                </HStack>
              </HStack>
            </VStack>
          )}
        </Box>
      </VStack>
      <UploadAvatarModal />
      <ReferralModal />
    </>
  );
}
