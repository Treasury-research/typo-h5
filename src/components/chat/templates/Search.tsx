import {
  VStack,
  Text,
  Box,
  Image,
  HStack,
  Flex,
  Tooltip,
  Skeleton,
  useToast
} from "@chakra-ui/react";
import React, { useState, useMemo, useCallback } from "react";
import { Markdown } from "./Markdown";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { getTopLevelDomain } from "lib";
import { useQuoteStore } from "store/quoteStore";
import api, { baseURL } from "api";
import { useJwtStore } from "store/jwtStore";
import { BarLoader } from "react-spinners";
import { useStore } from "store";
import { useThrottleEffect } from "ahooks";
import { useUserInfoStore } from "store/userInfoStore";
import { useConnectModalStore } from "store/modalStore";
import useChatContext from "hooks/useChatContext";

interface ISource {
  pageContent: string;
  index: number;
  link: string;
  favicon: string;
  isKnn3?: boolean;
}

const SourceBox = ({
  source,
  item,
  loading,
  loadingChange,
  doneChange,
  donePreview,
}: any) => {
  const { activeChat, updateMessage, getMessage, setTotalCoupon, setDailyAdd, isGenerate, setIsGenerate, setActionSheetProps, setIsActionSheetOpen } =
    useChatContext();
  const jwt = useJwtStore.getState().jwt;
  const showToast = useToast();
  const [value, setValue] = useState("");
  const { userId, isPassuser } = useUserInfoStore();
  const { setOpenConnectModal } = useConnectModalStore();
  const { awards, setAwards } = useQuoteStore();

  const isJSONString = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  };

  const getAwards = async () => {
    const res: any = await api.get(`/api/incentive`);
    if (res?.code === 200) {
      setAwards(res?.data || []);
    }
  };

  const sourcePreview = async (url: string) => {
    if (loading) {
      showToast({
        position: 'top',
        title: 'Please wait, AI is generating the answer.',
        variant: 'subtle',
        status: 'warning'
      })
      return;
    }

    // if (!userId) {
    //   showToast("You're not logged in yet.", "warning");
    //   setOpenConnectModal(true);
    //   return;
    // }

    if (activeChat && activeChat.isShare) {
      showToast({
        position: 'top',
        title: 'Please start your thread',
        variant: 'subtle',
      })
      return;
    }
    loadingChange(true);
    const conversation_id = activeChat?.chatId;
    doneChange(false);
    localStorage.setItem("isForceScroll", "no");
    setIsGenerate(true)
    const onChunkedResponseError = (err: any) => {
      setIsGenerate(false)
      loadingChange(false);
      doneChange(true);
      // updateActiveLink("");
      showToast({
        position: 'top',
        title: 'We are unable to read the article in your link due to its anti-crawling mechanism.',
        variant: 'subtle',
        status: 'warning'
      })
      setTimeout(() => {
        localStorage.setItem("isForceScroll", "yes");
      }, 2000);
    };
    const processChunkedResponse = (response: any) => {
      return new Promise((resolve, reject) => {
        let json: any = {};
        let text: string = "";
        var reader = response.body.getReader();
        var decoder = new TextDecoder();

        return readChunk();

        async function readChunk() {
          return reader.read().then(appendChunks);
        }

        function appendChunks(result: any) {
          let chunk: any = decoder.decode(result.value || new Uint8Array(), {
            stream: !result.done,
          });
          console.log("chunk1", chunk);
          let str: any = chunk.match(/<chunk>([\s\S]*?)<\/chunk>/g);
          let str1: any = chunk.replace(/<chunk>([\s\S]*?)<\/chunk>/g, "");
          if (isJSONString(str1)) {
            const jsonStr1 = JSON.parse(str1);
            if (jsonStr1.code && jsonStr1.code == 1016) {
              loadingChange(false);
              showToast({
                position: 'top',
                title: 'We are unable to read the article in your link due to its anti-crawling mechanism.',
                variant: 'subtle',
                status: 'warning'
              })

              resolve({
                done: true,
                summarizeContent: "",
                activeLink: "",
              });
            }
            if (jsonStr1.code && jsonStr1.code == 1019) {
              loadingChange(false);
              if (!userId) {
                showToast({
                  position: 'top',
                  title: `You're not logged in yet.`,
                  variant: 'subtle',
                  status: 'warning'
                })
                setOpenConnectModal(true);
              } else {
                showToast({
                  position: 'top',
                  title: 'Exceed usage limit.',
                  variant: 'subtle',
                  status: 'warning'
                })
              }
              resolve({
                done: true,
                summarizeContent: "",
                activeLink: "",
              });
            }
          } else {
            text += str1;
          }
          if (str) {
            chunk = str.map((t: string) => t.replace(/<\/?chunk>/g, ""));
            chunk = chunk.join("");
            if (isJSONString(chunk)) {
              const jsonChunk = JSON.parse(chunk);
              json = {
                ...json,
                ...jsonChunk,
              };
              if (jsonChunk.hasOwnProperty("totalCoupon")) {
                setTotalCoupon(jsonChunk.totalCoupon);
              }

              if (jsonChunk.hasOwnProperty("dailyAdd")) {
                setDailyAdd(jsonChunk.dailyAdd);
              }
            }
          }
          console.log("chunk2", chunk);

          if (result.done) {
            resolve({
              done: true,
              summarizeContent: text,
              activeLink: url,
            });
            loadingChange(false);
          } else {
            updateMessage(activeChat.id, item.id, {
              summarizeContent: text,
              activeLink: url,
            });
            loadingChange(false);
            // setValue(text);
            return readChunk();
          }
        }
      });
    };

    await fetch(`${baseURL}api/summarize`, {
      method: "POST",
      headers: {
        authorization: jwt ? `Bearer ${jwt}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation_id,
        item_id: item.id,
        urls: [url],
      }),
    })
      .then(processChunkedResponse)
      .then((respones: any) => {
        doneChange(true);
        setIsGenerate(false)
        if (respones.done) {
          const preCount =
            item["previewCount"] == undefined ? 3 : item["previewCount"];

          if (respones.summarizeContent) {
            updateMessage(activeChat.id, item.id, {
              previewCount:
                preCount <= 0
                ? 0
                : respones.summarizeContent
                ? preCount - 1
                : preCount,
            });
          } else {
            updateMessage(activeChat.id, item.id, {
              summarizeContent: respones.summarizeContent,
              activeLink: respones.activeLink,
            });
          }
          getAwards();

          setTimeout(() => {
            localStorage.setItem("isForceScroll", "yes");
          }, 2000);
        }
      })
      .catch(onChunkedResponseError);
  };

  const activeLink = useMemo(() => {
    const message = getMessage(activeChat.id, item.id);
    return message && message.activeLink;
  }, [activeChat, item.id]);

  const updateActiveLink = (link: any) => {
    // if (!userId) {
    //   showToast("You're not logged in yet.", "warning");
    //   return;
    // }
    if (activeChat && activeChat.isShare) {
      showToast({
        position: 'top',
        title: 'Please start your thread',
        variant: 'subtle',
      })
      return;
    }

    updateMessage(activeChat.id, item.id, {
      activeLink: link,
    });
  };

  const openSourceActionSheet = useCallback(() => {
    setActionSheetProps({
      item,
      type: 'source'
    })
    setIsActionSheetOpen.on()
    // window.open(source.link)
  }, [])

  return (
    <Box>
      <VStack
        justify="space-between"
        alignItems="start"
        p={3}
        key={source.index}
        style={{ backdropFilter: "blur(30px)", height: '100%' }}
        className="bg-[#DAE5E5] rounded-md overflow-hidden text-[#487C7E] relative group"
      >
        <Box
          className={`w-full h-full absolute left-0 top-0 bg-[rgba(0,0,0,0.5)] z-10 ${activeLink == source.link ? "visible" : "invisible"
            } ${donePreview ? "group-hover:visible" : ""
            } flex items-center justify-center`}
          onClick={() => {
            openSourceActionSheet()
          }}
        >

        </Box>

        <p className="overflow-ellipsis overflow-hidden whitespace-nowrap w-full">
          {source.pageContent}
        </p>
        <HStack justifyContent="space-between" w="full">
          <HStack spacing={1} flex={1} overflow="hidden">
            <Box pos="relative" py="1">
              <Image
                src={
                source.favicon ||
                "https://storage.googleapis.com/knn3-online/typography/logo/default.svg"
                }
                w="20px"
                borderRadius="full"
                alt=""
              />
              {source.isKnn3 ? (
                <Image
                  src="/images/knn3.png"
                  w="12px"
                  borderRadius="full"
                  alt=""
                  pos="absolute"
                  top="0"
                  right="-2px"
                />
              ) : null}
            </Box>

            <Text>{getTopLevelDomain(source.link)}</Text>
          </HStack>
          <div className="w-[20px] h-[20px] rounded-full bg-[#487C7E] text-white flex justify-center items-center text-xs">
            {source.index}
          </div>
        </HStack>
      </VStack>
    </Box>
  );
};

const viewMoreBox = (more: boolean, langth: number, sources: ISource[]) => {
  return (
    <VStack
      h="full"
      justifyContent="center"
      alignItems="start"
      p={3}
      style={{ backdropFilter: "blur(30px)", height: '100%' }}
      className="bg-[#DAE5E5] rounded-md overflow-hidden"
    >
      <HStack spacing={1}>
        {!more
        ? sources.slice(3, sources.length).map((item) => (
          <div
            key={item.index}
            className="w-[20px] h-[20px] rounded-full overflow-hidden"
          >
            <Image
              alt=""
              w="20px"
              src={
              item.favicon ||
              "https://storage.googleapis.com/knn3-online/typography/logo/default.svg"
              }
            />
          </div>
        ))
        : null}
      </HStack>
      {!more ? (
        <div className="flex gap-2">
          <Text>View {langth} more</Text>
          <AiFillRightCircle fontSize="20px" color="#487C7E" />
        </div>
      ) : (
        <div className="flex gap-2">
          <Text>View less</Text>
          <span className="inline-block w-[20px] h-[20px]">
            <AiFillLeftCircle fontSize="20px" color="#487C7E" />
          </span>
        </div>
      )}
    </VStack>
  );
};

export default function Search({
  content,
  sources,
  done,
  isLast,
  item,
  showQuoteIndex,
  index,
}: any) {
  const { activeChat, isGenerate, setIsActionSheetOpen, setActionSheetProps } = useChatContext();
  const [more, setMore] = useState(false);
  const { setIsShowInputQuote, setQuoteContent, setQuoteType } =
    useQuoteStore();
  const [loading, setLoading] = useState(false);
  const [donePreview, setDonePreview] = useState(true);
  const { userId, isPassuser } = useUserInfoStore();
  const { setOpenConnectModal } = useConnectModalStore();
  const showToast = useToast();

  return (
    <VStack spacing={5} p={2} alignItems="start" className="w-full">
      <Box className="w-full">
        <h2 className="text-2xl">Answer</h2>
        <Box className="w-full">
          <Markdown value={content} />
        </Box>
        {done && showQuoteIndex == index && (
          <Tooltip
            placement="top"
            rounded={"4px"}
            fontSize="14px"
            bg="#666666"
            color="#fff"
            maxW="600px"
            paddingY="6px"
            paddingX="10px"
            label="Ask a follow-up."
          >
            <Box
              className={`${isGenerate ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-[#487C7E] bg-[#DAE5E5] rounded-[4px] py-2 font-bold flex items-center px-3 w-[fit-content] mt-[10px] cursor-pointer hover:opacity-70`}
              onClick={() => {
                if(isGenerate){
                  return;
                }
                if (!userId) {
                  showToast({
                    position: 'top',
                    title: `You're not logged in yet.`,
                    variant: 'subtle',
                    status: 'warning'
                  })
                  setOpenConnectModal(true);
                  return;
                }
                if (activeChat && activeChat.isShare) {
                  showToast({
                    position: 'top',
                    title: 'Please start your thread',
                    variant: 'subtle',
                  })
                  return;
                }
                setIsShowInputQuote(true);
                setQuoteContent(content);
                setQuoteType("Answer");
              }}
            >
              <Image className="mr-1" src="./images/quote.png" alt="" />
              Quote
            </Box>
          </Tooltip>
        )}
      </Box>
      {sources && sources.length ? (
        <>
          {/* <hr className="h-[1px] w-full bg-[#D9D9D9]" /> */}
          <Box>
            {/* <h2 className="text-2xl">Sources</h2> */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">Sources</div>
              {!isPassuser && userId && item.isNewSearch && (
                <div className="text-[#999999]">
                  {item.previewCount} previews left
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1 font-medium">
              {sources
                .slice(0, more ? sources.length : 3)
                .map((source: ISource, i: number) => (
                  <SourceBox
                    key={i}
                    loadingChange={(e: any) => setLoading(e)}
                    doneChange={(e: any) => setDonePreview(e)}
                    source={source}
                    item={item}
                    loading={loading}
                    donePreview={donePreview}
                  />
              ))}
              <div onClick={() => setMore(!more)}>
                {viewMoreBox(more, sources.length - 3, sources)}
              </div>
            </div>
          </Box>
        </>
      ) : null}
      {loading ? (
        <>
          <Skeleton
            height="16px"
            mb={1}
            w={"90%"}
            startColor="#F3F3F3"
            endColor="#DFDFDF"
            borderRadius={"8px"}
          />
          <Skeleton
            height="16px"
            mb={1}
            w={"80%"}
            startColor="#F3F3F3"
            endColor="#DFDFDF"
            borderRadius={"8px"}
          />
          <Skeleton
            height="16px"
            w={"70%"}
            startColor="#F3F3F3"
            endColor="#DFDFDF"
            borderRadius={"8px"}
          />
        </>
      ) : (
        <Markdown value={item.summarizeContent} />
      )}
    </VStack>
  );
}
