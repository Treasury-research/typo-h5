import {
  Icon,
  Text,
  VStack,
  Button,
  HStack,
  Flex,
  Box,
  Image,
  useToast
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
import LinkIcon from "components/icons/Airdrop/Link";
import ShareIcon from "components/icons/Airdrop/Share";
import DailyIcon from "components/icons/Daily";
import ClaimedIcon from "components/icons/Claimed";
import moment from "moment";
import { ReferralModal } from "components/connect/ReferralModal";
import useWallet from "hooks/useWallet";

const TaskBox = ({
  points,
  description,
  loading,
  acted,
  claimed,
  onAction,
  onClaim,
  buttonText,
  icon
}: any) => {
  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderRadius="12px"
      border="1px solid #FFF"
      background="rgba(255, 255, 255, 0.20)"
      padding="20px 16px"
      marginBottom="24px"
    >
      <Box>
        <Box display="flex" alignItems="flex-end">
          <Box
            fontSize="20px"
            lineHeight="20px"
            fontFamily="JetBrainsMonoBold"
          >
            {points}
          </Box>
          <Box
            fontSize="12px"
            fontFamily="JetBrainsMono"
            marginLeft="10px"
          >
            points
          </Box>
        </Box>
        <Box
          fontSize="10px"
          marginTop="8px"
          fontFamily="JetBrainsMono"
          paddingRight="10px"
        >
          {description}
        </Box>
      </Box>
      <Box>
        {(!!claimed) && (
          <Box
            fontSize="12px"
            background="rgba(255, 255, 255, 0.30)"
            boxShadow="0px 0px 6px 0px rgba(0, 0, 0, 0.25)"
            padding="8px 10px"
            borderRadius="8px"
            display="flex"
            alignItems="center"
            height="32px"
            width="102px"
            fontFamily="JetBrainsMono"
          >
            <Box marginRight="8px">
              <ClaimedIcon size={16} />
            </Box>
            <Box>Claimed</Box>
          </Box>
        )}
        {(!acted && !claimed) && (
          <Box
            fontSize="12px"
            background="linear-gradient(92deg, #487C7E 0%, #004D50 99.5%)"
            boxShadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25)"
            padding="8px 10px"
            borderRadius="8px"
            display="flex"
            alignItems="center"
            cursor="pointer"
            height="32px"
            width="142px"
            fontFamily="JetBrainsMono"
            onClick={onAction}
          >
            <Box marginRight="8px">
              {icon}
            </Box>
            <Box>{buttonText}</Box>
          </Box>
        )}
        {(!!acted && !claimed) && (
          <Box
            fontSize="12px"
            background="linear-gradient(92deg, #487C7E 0%, #004D50 99.5%)"
            boxShadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25)"
            padding="8px 10px"
            borderRadius="8px"
            display="flex"
            alignItems="center"
            height="32px"
            fontFamily="JetBrainsMono"
            onClick={onClaim}
            width={loading ? "112px" : "92px"}
            pointerEvents={loading ? "none" : "all"}
            opacity={loading ? "0.5" : "1"}
            cursor={loading ? "not-allowed" : "pointer"}
          >
            <Box marginRight="8px">
              {icon}
            </Box>
            <Box>{loading ? "Claiming" : "Claim"}</Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default function Profile() {
  const router = useRouter();
  const showToast = useToast();
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
              height="56px"
              marginBottom="24px"
            >
              <Box
                width="100%"
                margin="0 auto"
                height="100%"
                display="flex"
                alignItems="center"
                position="relative"
                padding="0 20px"
              >
                <Box display="flex" alignItems="flex-end">
                  <Box
                    background="linear-gradient(94deg, #FF7A00 0%, #C54AFF 99.46%)"
                    backgroundClip="text"
                    textShadow="0px 0px 12px rgba(255, 127, 86, 0.80)"
                    color="#FF7A00"
                    fontSize="40px"
                    lineHeight="48px"
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
                    fontSize="12px"
                    marginLeft="10px"
                    fontFamily="JetBrainsMono"
                    marginBottom="6px"
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
                  zIndex={2}
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
            <Box color="white" width="100%" margin="0 auto" padding="0 20px">
              {/* <!--refer friends--> */}
              <TaskBox
                points="+50"
                description="Copy link and forward"
                icon={<ReferIcon size={16} />}
                buttonText="Refer Friends"
                onAction={() => setOpenReferralModal(true)}
              />

              {task2Status !== 2 && (
                <TaskBox
                  points="+100"
                  description={`Follow @TypoX_AI on Twitter`}
                  icon={<FollowIcon size={16} />}
                  buttonText="Follow TypoX"
                  onAction={() => {
                    setTask2Loading(true);
                    updateTask("twitter", 1);
                    window.open("https://twitter.com/TypoX_AI");
                  }}
                  onClaim={() => {
                    setTask2Loading(true);
                    updateTask("twitter", 2);
                  }}
                  acted={!!task2Status}
                  loading={task2Loading}
                />
              )}

              {task3Status !== 2 && (
                <TaskBox
                  points="+50"
                  description={`Login and connect your wallet on TypoX`}
                  icon={<LinkIcon size={16} />}
                  buttonText="Link Wallet"
                  onAction={openConnectWallet}
                  onClaim={() => {
                    setTask3Loading(true);
                    updateTask("login", 2);
                  }}
                  acted={!!task3Status}
                  loading={task3Loading}
                />
              )}

              {task4Status !== 2 && (
                <TaskBox
                  points="+100"
                  description={`Share your conversation with TypoX on Twitter`}
                  icon={<LinkIcon size={16} />}
                  buttonText="Share Twitter"
                  onAction={() => {
                    setTask4Status(1);
                    window.open(`${location.origin}/explorer`);
                  }}
                  onClaim={() => {
                    const isSharedTask =
                      localStorage.getItem("isSharedTask");
                    if (isSharedTask === "true") {
                      setTask4Loading(true);
                      updateTask("share", 2);
                    } else {
                      showToast({
                        position: "top",
                        title: "Please share your conversation!",
                        variant: "subtle",
                      });
                    }
                  }}
                  acted={!!task4Status}
                  loading={task4Loading}
                />
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
                padding="20px 16px"
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
                        fontSize="20px"
                        lineHeight="20px"
                        fontFamily="JetBrainsMonoBold"
                      >
                        +50
                      </Box>
                      <Box fontSize="12px" marginLeft="10px">
                        points/each
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box
                      fontSize="14px"
                      marginRight="6px"
                      marginLeft="10px"
                      fontFamily="JetBrainsMonoExtraBold"
                    >
                      {`${zealyTask}/5`}
                    </Box>
                    <Box marginRight="10px" fontSize="16px">
                      Today
                    </Box>
                    <Box
                      background="linear-gradient(92deg, #487C7E 0%, #004D50 99.5%)"
                      boxShadow="0px 0px 8px 0px rgba(0, 0, 0, 0.25)"
                      padding="8px 10px"
                      paddingLeft="8px"
                      borderRadius="8px"
                      display="flex"
                      alignItems="center"
                      cursor="pointer"
                      height="32px"
                      width="82px"
                      fontSize="12px"
                      onClick={() => {
                        window.open("https://zealy.io/cw/typoxai/questboard");
                      }}
                    >
                      <Box
                        marginRight="8px"
                        width="16px"
                        height="16px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                      >
                        <Box position="absolute" top="0" left="0" zIndex="1">
                          <DailyIcon size={16} />
                        </Box>
                        <Box zIndex="2">
                          <Image src="/images/z-icon.png" w="10px" h="10px" />
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
                <TaskBox
                  points="+100"
                  description={`Follow @TypoX_AI on Twitter`}
                  icon={<FollowIcon size={16} />}
                  buttonText="Follow TypoX"
                  onAction={() => {
                    setTask2Loading(true);
                    updateTask("twitter", 1);
                    window.open("https://twitter.com/TypoX_AI");
                  }}
                  onClaim={() => {
                    setTask2Loading(true);
                    updateTask("twitter", 2);
                  }}
                  claimed={true}
                />
              )}
              {task3Status === 2 && (
                <TaskBox
                  points="+50"
                  description={`Login and connect your wallet on TypoX`}
                  icon={<LinkIcon size={16} />}
                  buttonText="Link Wallet"
                  onAction={openConnectWallet}
                  onClaim={() => {
                    setTask3Loading(true);
                    updateTask("login", 2);
                  }}
                  claimed={true}
                />
              )}
              {task4Status === 2 && (
                <TaskBox
                  points="+100"
                  description={`Share your conversation with TypoX on Twitter`}
                  icon={<LinkIcon size={16} />}
                  buttonText="Share Twitter"
                  onAction={() => {
                    setTask4Status(1);
                    window.open(`${location.origin}/explorer`);
                  }}
                  onClaim={() => {
                    const isSharedTask =
                      localStorage.getItem("isSharedTask");
                    if (isSharedTask === "true") {
                      setTask4Loading(true);
                      updateTask("share", 2);
                    } else {
                      showToast({
                        position: "top",
                        title: "Please share your conversation!",
                        variant: "subtle",
                      });
                    }
                  }}
                  claimed={true}
                />
              )}
            </Box>
          )}
          {phrase === "season 1" && (
            <Box padding="0 20px">
              <VStack
                pos="relative"
                pb={10}
                alignItems="flex-start"
                className="blue-filter py-5 px-5 rounded-[10px]"
                width="100%"
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
                  zIndex={2}
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
                    zIndex={2}
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
                      <Text fontSize="xs" transform="scale(0.76)" whiteSpace="pre">
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
                <VStack w="full" justify="space-between" spacing={3} pt="14px">
                  <HStack
                    p="4"
                    borderWidth="1px"
                    borderColor="whiteAlpha.300"
                    flex={1}
                    borderRadius={5}
                    justify="space-between"
                    width="100%"
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
                    width="100%"
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
                </VStack>
              </VStack>
            </Box>
          )}
        </Box>
      </VStack>
      <UploadAvatarModal />
      <ReferralModal />
    </>
  );
}
