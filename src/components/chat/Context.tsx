import React, { createContext, useCallback, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useBoolean, useDisclosure, useToast } from "@chakra-ui/react";
import { useStore } from "store";
import { useConnectModalStore } from "store/modalStore";
import { useUserInfoStore } from "store/userInfoStore";
import { useChatStore } from "store/chatStore";
import { useQuoteStore } from "store/quoteStore";
import useWeb3Context from "hooks/useWeb3Context";
import { useJwtStore } from "store/jwtStore";
import { upFirst, getShortcutByprompt, isShortcut, isAddress } from "lib";
import api, { baseURL } from "api";
import { useRouter } from "next/router";
import { commands } from "components/chat/TextAreaTips";
import moment from "moment";
import { extractJSON } from "lib/common";

const isJSONString = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

export const ChatContext = createContext({});

export default function ChatProvider({ children }: any) {
  const showToast = useToast();
  const { setOpenConnectModal } = useConnectModalStore();
  const {
    userId,
    isPassuser,
    noPassuserSearchTimes,
    setNoPassuserSearchTimes,
    clearUserInfo,
    setIsPassuser
  } = useUserInfoStore();
  const { account } = useWeb3Context();
  const { jwt, setJwt } = useJwtStore();
  const router = useRouter();

  const {
    isShowInputQuote,
    quoteContent,
    quoteType,
    setIsShowInputQuote,
    setQuoteContent,
    setQuoteType,
    isCopilot,
    clickList,
    setClickList,
    setAwards,
  } = useQuoteStore();

  const {
    setTotalCoupon,
    setDailyAdd,
    addChat,
    activeChatId,
    getActiveChat,
    getActiveChatMessages,
    setActiveChatId,
    removeMessage,
    addMessage,
    updateMessage,
    getAllChatList,
    getChatList,
    getFirstChatByType,
    removeChat,
    updateChat,
    getMessage,
    getChat,
    chatById,
    channel,
    setChannel,
    sharedChat,
    setSharedChat,
    clearMessage
  } = useChatStore();

  const [isSandBox, setIsSandBox] = useBoolean(false);
  const [isActionSheetOpen, setIsActionSheetOpen] = useBoolean(false);
  const [actionSheetProps, setActionSheetProps] = useState({});
  const [sandBoxType, setSandBoxType] = useState("Regular");
  const [category, setCategory] = useState("");
  const [section, setSection] = useState('explorer');
  const [agent, setAgent] = useState("investor");
  const [showNav, setShowNav] = useBoolean(false);
  const [showQuest, setShowQuest] = useBoolean(false);
  const [showAgent, setShowAgent] = useState(false);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [isLoading, setIsLoading] = useBoolean(false);
  const [labelValue, setLabelValue] = useState("");
  const [input, setInput] = useState("");
  const [isFold, setIsFold] = useState(false);
  const [coplyLoading, setCoplyLoading] = useState(false);
  const [isGenerate,setIsGenerate] = useState(false);
  const [getReccordByIdLoading, setGetReccordByIdLoading] = useState(false);
  const [isFocus, setIsFocus] = useBoolean(false);

  let activeChat: any = getActiveChat();
  const activeMessages: any = getActiveChatMessages();
  const chatList: any = getAllChatList()
    .filter(
      (item: any) =>
        (!item.userId || item.userId === userId) && item.section === section
    )
    .sort((a: any, b: any) => {
      if (a.createTime > b.createTime) {
        return 1;
      }

      return -1;
    });
  console.log('chatList111', chatList)

  const [allChatList, setAllChatList] = useState(chatList);

  useEffect(() => {
    if (router.query.id) {
      if (getChat(router.query.id)) {
        setActiveChatId(router.query.id);
      } else if (!getChat(router.query.id) && section === "explorer") {
        setSharedChat(null);
        loadChat(router.query.id);
      }
    } else {
      setSharedChat(null);
      // setActiveChatId("");
    }
    if (router.pathname) {
      console.log('router', router.pathname.split("/")[1])
      // setSection(router.pathname.split("/")[1]);
      // setChannel(router.pathname.split("/")[1]);
    }
  }, [router]);

  useEffect(() => {
    const chatList: any = getAllChatList()
      .filter(
        (item: any) =>
          (!item.userId || item.userId === userId) && item.section === section
      )
      .sort((a: any, b: any) => {
        if (a.createTime > b.createTime) {
          return 1;
        }

        return -1;
      });

    setAllChatList(chatList);

    // if (activeChatId && chatList.findIndex((item: any) => item.id === activeChatId) !== -1) {

    // } else {
    //   const firstChatId = chatList.length ? chatList[0].id : null

    //   setActiveChatId(firstChatId)
    // }
  }, [section, userId, chatById, activeChatId]);

  const onScroll = (timer: number) => {
    setTimeout(() => {
      const chatContent = document.getElementById("chat-content");
      console.log('onScroll', chatContent)
      chatContent && chatContent?.scrollTo({ top: chatContent.scrollHeight });
    }, timer);
  };

  const getClickList = async () => {
    const res = await api.get(`/api/token/list`);
    if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
      setClickList({
        time: moment().format("YYYY-MM-DD"),
        list: res.data,
      });
    }
  };

  const cloneChat = useCallback(
    async (isShare?: boolean, isSecuretyCmds?: boolean) => {
      // if (!userId) {
      //   showToast("You're not logged in yet.", "warning");
      //   setOpenConnectModal(true);
      //   return;
      // }

      if (!activeChat) return;

      const timestamp = new Date().getTime();
      const time = new Date(timestamp).toLocaleTimeString();
      const newChatId = uuidv4();

      const newChat: any = {
        id: newChatId,
        timestamp: timestamp,
        type: isSandBox ? sandBoxType : "general",
        isSandBox: isSandBox,
        channel,
        messages: [...activeChat.messages],
        userId,
        section,
      };

      const count = activeMessages.length;
      newChat.name = isSandBox
                   ? `${upFirst(sandBoxType).toUpperCase()} Chat${" "}${count}`
                   : `New Chat ${time}`;

      if (activeChat.isShare) {
        try {
          await api.post(`/api/conversation/shared/copy`, {
            conversation_id: newChatId,
            id: activeChatId,
          });
          addChat.isShare = false;
        } catch (error) {
          console.error(error);
        }
      }

      addChat(newChat);
      // setActiveChatId(newChat.id);
      if (!isSecuretyCmds) {
        console.log(section)
        console.log('234',!isSecuretyCmds)
        router.push(`/${section}/${newChatId}`);
      }
    },
    [
      activeChat,
      channel,
      activeChatId,
      isSandBox,
      sandBoxType,
      userId,
      activeMessages,
      section,
    ]
  );

  const createChat = useCallback(
    async (id?: string, isShare?: boolean) => {
      // if (!userId) {
      //   showToast("You're not logged in yet.", "warning");
      //   setOpenConnectModal(true);
      //   return;
      // }

      const timestamp = new Date().getTime();
      const time = new Date(timestamp).toLocaleTimeString();
      let newChatId = id ? id : uuidv4();

      const newChat: any = {
        id: newChatId,
        timestamp: timestamp,
        type: isSandBox ? sandBoxType : "general",
        isSandBox: isSandBox,
        channel,
        messages: [],
        userId,
        section,
      };

      const count = activeMessages.length;
      newChat.name = isSandBox
                   ? `${upFirst(sandBoxType).toUpperCase()} Chat${" "}${count}`
                   : `New Chat ${time}`;

      if (isShare) {
        try {
          await api.post(`/api/conversation/shared/copy`, {
            conversation_id: newChatId,
            id: activeChatId,
          });
          addChat.isShare = false;
        } catch (error) {
          console.error(error);
        }
      }

      addChat(newChat);
      // setActiveChatId(newChat.id);
      console.log('section',section)
      router.push(`/${section}/${newChat.id}`);
    },
    [
      channel,
      activeChatId,
      isSandBox,
      sandBoxType,
      userId,
      activeMessages,
      section,
    ]
  );

  const loadClickList = useCallback(() => {
    if (!clickList || !clickList.list || clickList.list.length == 0) {
      getClickList();
    }
  }, [clickList]);

  const handleShortcutPrompt = useCallback(
    async ({ chatId, messageId, prompt }: any) => {
      const { cmd, cmdType, cmdValue } = getShortcutByprompt(prompt);
      const cmds = commands.map((str) => str.toLowerCase());

      const result = await api.get(`/api/shortcut`, {
        params: {
          conversation_id: chatId,
          type: cmds.includes(cmd)
              ? cmdType === "addressrisk"
              ? "goplus"
              : cmdType
              : "",
          input: cmds.includes(cmd) ? cmdValue : "",
          chainId: 1,
        },
      });

      return result;
    },
    []
  );

  const handleAgentPrompt = useCallback(
    async ({
      chatId,
      messageId,
      prompt,
      agentAction,
      agent,
      agentPrompt,
    }: any) => {
      const conversation_id = chatId;
      const input_prompt = prompt;
      let result;

      updateMessage(chatId, messageId, {
        submit: false,
        tool: null,
        createTime: new Date().getTime(),
        prompt: agentAction ? agentPrompt : prompt,
        agent,
        isPrivateChat: agent === "assistant" || agent === "tutor",
        callback: {
          functionName: `/api/vc/${agent}`,
          params: {
            conversation_id: chatId,
            input_prompt: prompt,
          },
        },
      });

      const onDownloadProgress = (res: any) => {
        setIsLoading.off();
        const str = res.event.target.responseText;
        const data = extractJSON(str);

        updateMessage(chatId, messageId, {
          content: data?.content,
        });

        if (data.hasOwnProperty("totalCoupon")) {
          setTotalCoupon(data.totalCoupon);
        }

        if (data.hasOwnProperty("dailyAdd")) {
          setDailyAdd(data.dailyAdd);
        }

        onScroll(0);
      };

      const res = await api.post(
        `/api/vc/${agent}`,
        {
          conversation_id,
          input_prompt: agentAction ? agentPrompt : prompt,
        },
        {
          onDownloadProgress,
        }
      );

      result = {
        code: 200,
        data: extractJSON(res.data),
      };

      return result;
    },
    []
  );

  const handleSearchPrompt = useCallback(
    async ({ chatId, messageId, prompt, entriType }: any) => {
      const conversation_id = chatId;
      const input_prompt = prompt;
      const onChunkedResponseError = (err: any) => {
        console.error(err);
        result = {
          code: err.code,
          data: {
            content: err.errorMsg,
          },
        };
        setIsLoading.off();
      };

      const processChunkedResponse = (response: any) => {
        setIsLoading.off();
        return new Promise((resolve, reject) => {
          let json: any = {};
          let text: string = "";
          let sourceChunk: any;
          var reader = response.body.getReader();
          var decoder = new TextDecoder();

          let time = 0;
          let interval = setInterval(function () {
            time += 1000;
            if (time > 2 * 60 * 1000) {
              resolve({
                done: true,
                content: text,
                ...json,
                tool: "search",
                id: uuidv4(),
              });
              // 清除定时器
              clearInterval(interval);
            }
          }, 1000);

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

            if (str && Array.isArray(str) && str.length > 0) {
              chunk = str.map((t: string) => t.replace(/<\/?chunk>/g, ""));
              for (let i = 0; i < chunk.length; i++) {
                if (isJSONString(chunk[i])) {
                  json = {
                    ...json,
                    ...JSON.parse(chunk[i]),
                  };
                }
              }
            } else {
              if (isJSONString(chunk)) {
                let obj: any = JSON.parse(chunk);
                if (obj.code && obj.code !== 200) {
                  reject({
                    ...JSON.parse(chunk),
                  });
                }
              }
              sourceChunk += chunk;
              if (
                sourceChunk &&
                JSON.stringify(json) == "{}" &&
                sourceChunk.includes('{"sourceList"')
              ) {
                let sourceStr: any = sourceChunk.match(
                  /<chunk>([\s\S]*?)<\/chunk>/g
                );
                console.log("sourceStr", sourceStr);
                if (sourceStr && Array.isArray(sourceStr)) {
                  if (sourceStr[0].includes("sourceList")) {
                    let sourceArry = sourceStr[0].replace(/<\/?chunk>/g, "");
                    console.log("sourceArry", sourceArry);
                    if (isJSONString(sourceArry)) {
                      json = {
                        ...json,
                        ...JSON.parse(sourceArry),
                      };
                    }
                  }
                }
              } else {
                console.log("text", text);
                let outputStr =
                  json.sourceList && json.sourceList.length
                  ? chunk
                    .toString()
                    .replace(
                      /\$(\d+(?:,\d+)*)\$/g,
                      (match: any, group1: any) => {
                        let numbers = group1
                          .split(",")
                          .map((number: any) => {
                            const source = json.sourceList.find(
                              (item: any) => item.index == number
                            );
                            return `<span class="tooltip"><a href="${
                                  source && source.link ? source.link : ""
                                }" target="_blank">${number}</a></span>`;
                          })
                          .join("");
                        return numbers;
                      }
                    )
                  : chunk.toString();
                let regex1 = /\$_1_(.*?)_1_\$/g;
                let regex2 = /\$_2_(.*?)_2_\$/g;
                let replacedStr = outputStr.replace(
                  regex1,
                  '<span class="click-item-1">$1</span>'
                );
                replacedStr = replacedStr.replace(
                  regex2,
                  '<span class="click-item-2">$1</span>'
                );

                replacedStr = replacedStr.replace(
                  /KNN3 /g,
                  '<span class="click-item-2">KNN3</span> '
                );

                text += replacedStr;
              }
            }
            if (result.done) {
              updateMessage(chatId, messageId, {
                done: true,
                content: text,
                ...json,
                previewCount: !userId ? 1 : 3,
              });
              onScroll()

              resolve({
                done: true,
                content: text,
                ...json,
                previewCount: !userId ? 1 : 3,
              });
              // 清除定时器
              clearInterval(interval);
              // setIsLoading.off();
            } else {
              // setIsLoading.off();
              updateMessage(chatId, messageId, {
                submit: false,
                done: false,
                content: text,
                tool: "search",
                createTime: new Date().getTime(),
                prompt,
                ...json,
              });
              onScroll()

              return readChunk();
            }
          }
        });
      };
      let params: any = {};
      let apiUrl = "";
      let method: any = {};
      if (entriType == 1) {
        const selectList = clickList.list.filter((t: any) => {
          return (
            input_prompt.toLowerCase() == t.name.toLowerCase() ||
            input_prompt.toLowerCase() == t.slug.toLowerCase() ||
            input_prompt.toLowerCase() == t.symbol.toLowerCase()
          );
        });
        params = {};
        apiUrl = `${baseURL}api/token/detail?conversation_id=${chatId}&name=${
          selectList.length > 0 ? selectList[0]["name"] : ""
        }&symbol=${selectList.length > 0 ? selectList[0]["symbol"] : ""}`;
        method = {
          method: "GET",
          headers: {
            authorization: jwt ? `Bearer ${jwt}` : "",
            "Content-Type": "application/json",
          },
        };
      } else {
        params = {
          personal_profile: {
            address: account,
          },
          conversation_id: chatId,
          input_prompt,
          isSandbox: false,
          isCopilot,
        };
        apiUrl = `${baseURL}api/search`;
        method = {
          method: "POST",
          headers: {
            authorization: jwt ? `Bearer ${jwt}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        };
      }

      let result;
      await fetch(`${apiUrl}`, {
        ...method,
      })
        .then(processChunkedResponse)
        .then((respones: any) => {
          if (respones.done) {
            if (!isPassuser && userId) {
              getSearchTime();
            }

            if (respones.hasOwnProperty("totalCoupon")) {
              setTotalCoupon(respones.totalCoupon);
            }

            if (respones.hasOwnProperty("dailyAdd")) {
              setDailyAdd(respones.dailyAdd);
            }

            result = {
              code: 200,
              data: {
                ...respones,
                isNewSearch: true,
              },
            };
          }
        })
        .catch(onChunkedResponseError);

      return result;
    },
    [jwt]
  );

  const handleCampaignGenDesc = useCallback(
    async ({ chatId, messageId, prompt }: any) => {
      let result: any;
      const onChunkedResponseError = (err: any) => {
        console.log("err", err);
        result = {
          code: err.code,
          data: {
            content: err.errorMsg,
          },
        };
      };
      const processChunkedResponse = (response: any) => {
        setIsLoading.off();
        return new Promise((resolve, reject) => {
          let json: any = {};
          let text: string = "";
          let sourceChunk: any;
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
            console.log("chunk13434", chunk);
            let str: any = chunk.match(/<chunk>([\s\S]*?)<\/chunk>/g);
            if (str && Array.isArray(str) && str.length > 0) {
              chunk = str.map((t: string) => t.replace(/<\/?chunk>/g, ""));
              for (let i = 0; i < chunk.length; i++) {
                if (isJSONString(chunk[i])) {
                  json = {
                    ...json,
                    ...JSON.parse(chunk[i]),
                  };
                }
              }
            } else {
              if (isJSONString(chunk)) {
                let obj: any = JSON.parse(chunk);
                if (obj.code && obj.code !== 200) {
                  reject({
                    ...JSON.parse(chunk),
                  });
                }
              }
              sourceChunk += chunk;
              text += chunk.toString();
            }
            // }
            if (result.done) {
              updateMessage(chatId, messageId, {
                done: true,
                content: text,
                ...json,
              });

              resolve({
                done: true,
                content: text,
                ...json,
              });
            } else {
              console.log(889900, text);
              updateMessage(chatId, messageId, {
                submit: false,
                done: false,
                content: text,
                tool: "christmas_gen_desc",
                createTime: new Date().getTime(),
                prompt,
                ...json,
              });
              return readChunk();
            }
          }
        });
      };
      await fetch(`${baseURL}api/campaign/genDesc`, {
        method: "POST",
        headers: {
          authorization: jwt ? `Bearer ${jwt}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: prompt,
          conversation_id: chatId,
        }),
      })
        .then(processChunkedResponse)
        .then((respones: any) => {
          if (respones.done) {
            if (respones.hasOwnProperty("totalCoupon")) {
              setTotalCoupon(respones.totalCoupon);
            }

            if (respones.hasOwnProperty("dailyAdd")) {
              setDailyAdd(respones.dailyAdd);
            }
            result = {
              code: 200,
              data: {
                ...respones,
                content: respones.content,
              },
            };
          }
        })
        .catch(onChunkedResponseError);

      return result;
    },
    [jwt]
  );

  const handleNormalPrompt = useCallback(
    async ({ chatId, messageId, prompt }: any) => {
      const conversation_id = chatId;
      const input_prompt = prompt;
      let result;

      const onChunkedResponseError = (err: any) => {
        console.error(err);
        setIsLoading.off();
      };

      const processChunkedResponse = (response: any) => {
        setIsLoading.off();
        let json: any = undefined;
        let text: string = "";
        var reader = response.body.getReader();
        var decoder = new TextDecoder();

        return readChunk();

        function readChunk() {
          return reader.read().then(appendChunks);
        }

        function appendChunks(result: any) {
          let chunk: any = decoder.decode(result.value || new Uint8Array(), {
            stream: !result.done,
          });
          console.log("chunk1", chunk);
          let str: any = chunk.match(/<chunk>([\s\S]*?)<\/chunk>/g);
          if (str) {
            chunk = str.map((t: string) => t.replace(/<\/?chunk>/g, ""));
            chunk = chunk.join("");
          }
          console.log("chunk2", chunk);

          try {
            if (!isNaN(Number(chunk)) && typeof chunk === "string") {
              throw new Error("string number");
            } else {
              json = JSON.parse(chunk);
            }
          } catch (error) {
            text += chunk.toString();
          }

          if (result.done) {
            updateMessage(chatId, messageId, {
              done: true,
              content: text,
              ...json,
            });
            onScroll()

            return {
              done: true,
              content: text,
              ...json,
            };
          } else {
            updateMessage(chatId, messageId, {
              submit: false,
              done: false,
              content: text,
              tool: "chat",
              createTime: new Date().getTime(),
              prompt,
              ...json,
            });
            onScroll()

            return readChunk();
          }
        }
      };

      console.log('baseURL', baseURL)
      const res = await fetch(`${baseURL}api/conversation`, {
        method: "POST",
        headers: {
          authorization: jwt ? `Bearer ${jwt}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personal_profile: {
            address: account,
          },
          conversation_id: chatId,
          input_prompt: prompt,
          isSandbox: isSandBox,
        }),
      })
        .then(processChunkedResponse)
        .catch(onChunkedResponseError);

      if (res.hasOwnProperty("totalCoupon")) {
        setTotalCoupon(res.totalCoupon);
      }

      if (res.hasOwnProperty("dailyAdd")) {
        setDailyAdd(res.dailyAdd);
      }

      // result = {
      //   code: 200,
      //   data: res,
      // };
      if (res.code && res.code !== 200) {
        result = {
          code: res.code,
          data: {
            content: res.errorMsg,
          },
        };
      } else {
        result = {
          code: 200,
          data: res,
        };
      }

      return result;
    },
    [jwt]
  );

  const submitQuestion = useCallback(
    ({
      chatId,
      prompt,
      isReGenerate,
      entriType,
      isRelationsQuestion,
    }: any = {}) => {
      if (!isReGenerate) {
        const newMessage = {
          id: uuidv4(),
          content: prompt,
          createTime: new Date().getTime(),
          type: "question",
          submit: false,
          entriType,
          quoteContent: isRelationsQuestion
                      ? ""
                      : isShowInputQuote
                      ? quoteContent
                      : "",
          quoteType: isRelationsQuestion
                   ? ""
                   : isShowInputQuote
                   ? quoteType
                   : "",
        };

        if (!isRelationsQuestion) {
          setIsShowInputQuote(false);
          setQuoteContent("");
          setQuoteType("");
        }

        setInput("");
        setLabelValue("");
        addMessage(chatId, newMessage);
      }

      onScroll();
    },
    [isShowInputQuote, quoteContent, quoteType, jwt]
  );

  const submitAnswer = useCallback(
    async ({
      chatId,
      prompt,
      toAgent,
      agentAction,
      agentPrompt,
      entriType,
      urls,
      isRelationsQuestion,
    }: any = {}) => {
      loadClickList();

      const messageId = uuidv4();

      const newMessage = {
        id: messageId,
        content: "",
        createTime: new Date().getTime(),
        type: "answer",
      };

      addMessage(chatId, newMessage);
      onScroll()

      if (prompt.toLocaleLowerCase().includes("/uniswap")) {
        updateMessage(chatId, messageId, {
          submit: false,
          content: "uniswap",
          tool: "uniswap",
          createTime: new Date().getTime(),
        });

        return;
      }

      if (prompt.trim().toLocaleLowerCase().includes("/getpass")) {
        updateMessage(chatId, messageId, {
          type: "result",
          id: uuidv4(),
          submit: false,
          content: "getpass",
          tool: "getpass",
          createTime: new Date().getTime(),
        });
        return;
      }

      if (prompt.trim().toLocaleLowerCase().includes("/checkpass")) {
        setIsLoading.on();
        let passData1:any = []
        const res = await api.get(`/api/redeem/nftList`, {
          params: {
            pageNumber: "0",
            pageSize: "100",
          },
        });
        if(res?.data?.data && res?.data?.data.length > 0){
          passData1 = [...res?.data?.data]
        }
        const res1 = await api.get(`/api/redeem/redeemList`, {
          params: {
            pageNumber: "0",
            pageSize: "100",
          },
        });
        let passData:any = []
        if(res1?.data?.data && res1?.data?.data.length > 0){
          res1?.data?.data.map((t:any,i:number) => {
            if(t.owner !== t.target){
              passData.push({
                ...t,
                redeem:[{
                  ...t
                }]
              })
            }
          })
        }

        updateMessage(chatId, messageId, {
          type: "result",
          id: uuidv4(),
          submit: false,
          content: "checkpass",
          tool: "checkpass",
          passData: [...passData,...passData1],
          createTime: new Date().getTime(),
          address:account
        });
        onScroll(0);
        setIsLoading.off();
        return;
      }

      try {
        setIsLoading.on();
        setIsGenerate(true)
        const { cmd, cmdType, cmdValue } = getShortcutByprompt(prompt);
        const cmds = commands.map((str) => str.toLowerCase());
        let result: any;
        if (isShortcut(prompt)) {
          result = await handleShortcutPrompt({
            chatId,
            messageId,
            prompt,
          });
        } else if (showAgent && agent) {
          result = await handleAgentPrompt({
            chatId,
            messageId,
            prompt,
            agentAction,
            agent,
            agentPrompt,
          });
        } else if (
          (section === "explorer" && !isShowInputQuote) ||
          (section === "explorer" && isRelationsQuestion)
        ) {
          result = await handleSearchPrompt({
            chatId,
            messageId,
            prompt,
            entriType,
          });
        } else if (section === "magicWand") {
          result = await handleCampaignGenDesc({
            chatId,
            messageId,
            prompt,
          });
        } else {
          result = await handleNormalPrompt({
            chatId,
            messageId,
            prompt,
          });
        }

        setIsLoading.off();
        setIsGenerate(false)
        getAwards();
        console.log("result124", result);
        if (result.code === 200) {
          updateMessage(
            chatId,
            isShortcut(prompt) ? messageId : result.data.id,
            {
              submit: false,
              createTime: new Date().getTime(),
              prompt,
              agent: showAgent ? agent : null,
              isPrivateChat: agent === "assistant" || agent === "tutor",
              callback: isShortcut(prompt)
                      ? {
                        method: "get",
                        functionName: "/api/shortcut",
                        params: {
                          params: {
                            conversation_id: chatId,
                            type: cmds.includes(cmd)
                                ? cmdType === "addressrisk"
                                ? "goplus"
                                : cmdType
                                : "",
                            input: cmds.includes(cmd) ? cmdValue : "",
                          },
                        },
                      }
                      : {
                        method: "get",
                        functionName: "/api/conversation",
                        params: {
                          personal_profile: {
                            address: account,
                          },
                          conversation_id: chatId,
                          input_prompt: prompt,
                          isSandbox: isSandBox,
                        },
                      },
              ...result.data,
              tool:
                result?.data?.tool === "goplus"
                ? "addressRisk"
                : result?.data?.tool,
            }
          );

          if (result.data.hasOwnProperty("totalCoupon")) {
            setTotalCoupon(result.data.totalCoupon);
          }

          if (result.data.hasOwnProperty("dailyAdd")) {
            setDailyAdd(result.data.dailyAdd);
          }
        } else {
          if (result?.data?.code === 1003) {
            onOpen();
          }
          if (result?.code === 1019) {
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
          }

          if (result?.code === 1006) {
            clearUserInfo();
            setJwt("");
            showToast({
              position: 'top',
              title: 'The login session has expired. Please sign in again.',
              variant: 'subtle',
              status: 'warning'
            })
            setOpenConnectModal(true);
          }

          updateMessage(chatId, messageId, {
            error:
              (result && result.data?.errorMsg) ||
              (result && result.data?.content) ||
              "Send message error!",
            content:
              (result && result.data?.errorMsg) ||
              (result && result.data?.content) ||
              "Send message error!",
            createTime: new Date().getTime(),
            prompt,
            agent: showAgent ? agent : null,
            isPrivateChat: agent === "assistant" || agent === "tutor",
            callback: isShortcut(prompt)
                    ? {
                      method: "get",
                      functionName: "/api/shortcut",
                      params: {
                        params: {
                          conversation_id: chatId,
                          type: cmds.includes(cmd) ? cmdType : "",
                          input: cmds.includes(cmd) ? cmdValue : "",
                        },
                      },
                    }
                    : {
                      method: "get",
                      functionName: "/api/conversation",
                      params: {
                        personal_profile: {
                          address: account,
                        },
                        conversation_id: chatId,
                        input_prompt: prompt,
                        isSandbox: isSandBox,
                      },
                    },
          });
        }

        setInput("");
        onScroll(0);
      } catch (error: any) {
        updateMessage(chatId, messageId, {
          error: "Send message error!",
          content: "Send message error!",
          createTime: new Date().getTime(),
        });
        setIsLoading.off();
        setIsGenerate(false)
        setInput("");
        showToast({
          position: 'top',
          title: 'Unknown exception, Send message error!',
          variant: 'subtle',
          status: 'error'
        })
        onScroll(0);
      }
    },
    [
      account,
      agent,
      channel,
      clickList,
      input,
      isCopilot,
      isSandBox,
      isShowInputQuote,
      jwt,
      labelValue,
      showAgent,
      isLoading,
      setIsLoading,
      section
    ]
  );

  const submitMessage = useCallback(
    async ({
      isReGenerate,
      toAgent,
      agentAction,
      agentPrompt,
      entriType,
      onSuccess,
      urls,
      isSecuretyCmds,
      isRelationsQuestion,
      question,
    }: any = {}) => {

      const prompt =
        (question || input).trim() + (labelValue ? ` ${labelValue}` : "");

      if (isLoading) {
        showToast({
          position: 'top',
          title: 'Please wait, AI is generating the answer.',
          variant: 'subtle',
          status: 'warning'
        })
        return;
      }
      if (!toAgent && !prompt) {
        showToast({
          position: 'top',
          title: 'Please enter your question.',
          variant: 'subtle',
          status: 'warning'
        })
        return;
      }

      if (!userId && section == 'magicWand') {
        showToast({
          position: 'top',
          title: `You're not logged in yet.`,
          variant: 'subtle',
          status: 'warning'
        })
        setOpenConnectModal(true);
        return;
      }

      if (labelValue && !isAddress(labelValue, prompt)) {
        showToast({
          position: 'top',
          title: 'Please enter the correct address.',
          variant: 'subtle',
          status: 'warning'
        })
        return;
      }

      if (
        !isPassuser &&
        userId &&
        noPassuserSearchTimes >= 30 &&
        ((channel === "search" && !isShowInputQuote) || isRelationsQuestion)
      ) {
        showToast({
          position: 'top',
          title: 'Thirty searchs have been used up, please activate unlimited pass.',
          variant: 'subtle',
          status: 'warning'
        })
        return;
      }

      let answer_id = activeChatId;

      if (!answer_id) {
        const new_id = uuidv4();
        answer_id = new_id;
        createChat(new_id);
      }

      if (!toAgent) {
        submitQuestion({
          chatId: answer_id,
          prompt,
          isReGenerate,
          entriType,
          isRelationsQuestion,
        });
      }

      await submitAnswer({
        chatId: answer_id,
        prompt,
        toAgent,
        agentAction,
        agentPrompt,
        entriType,
        urls,
        isRelationsQuestion,
      });

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        });
      }
    },
    [userId, input, activeChatId, labelValue,isLoading,section]
  );

  const loadChat = useCallback(async (chatId: any) => {
    try {
      setGetReccordByIdLoading(true);
      const { data } = await api.get(`/api/conversation/shared/get`, {
        params: {
          id: chatId,
        },
      });

      console.log('data',data)
      if (JSON.stringify(data) !== "{}") {
        const chat = { ...data.data, id: chatId }; // 将id更新
        setSharedChat(chat);
        setActiveChatId(chat.id);
      } else {

        router.push("/explorer");
      }
      setGetReccordByIdLoading(false);
    } catch (error) {
      console.error(error);
      setGetReccordByIdLoading(false);
    }
  }, []);

  const getSearchTime = async () => {
    const res = await api.get(`/api/search/count`);
    if (res) {
      setNoPassuserSearchTimes(res.data);
    }
  };

  const getAwards = async () => {
    const res: any = await api.get(`/api/incentive`);
    if (res?.code === 200) {
      setAwards(res?.data || []);
    }
  };

  const refreshCoupon = async () => {
    const res: any = await api.get(`/api/auth`);
    if (res?.code === 200) {
      setTotalCoupon(res?.data?.totalCoupon);
      setDailyAdd(res?.data?.dailyAdd);
      setIsPassuser(res?.data?.is_pass_user)
    }
  };

  const openNav = async () => {
    setShowNav.on()
  };

  const closeNav = async () => {
    setShowNav.off();
    setShowQuest.off();
  };

  const openQuest = async () => {
    setShowQuest.on();
  };

  const closeQuest = async () => {
    setShowQuest.off();
  };

  return (
    <ChatContext.Provider
      value={{
        isSandBox,
        setIsSandBox,
        sandBoxType,
        setSandBoxType,
        agent,
        setAgent,
        showAgent,
        setShowAgent,
        showNav,
        setShowNav,
        showQuest,
        setShowQuest,
        isLoading,
        setIsLoading,
        onOpen,
        onClose,
        isOpen,
        submitMessage,
        submitAnswer,
        submitQuestion,
        createChat,
        setInput,
        input,
        setTotalCoupon,
        setDailyAdd,
        channel,
        setChannel,
        activeChatId,
        activeChat,
        activeMessages,
        setActiveChatId,
        labelValue,
        setLabelValue,
        onScroll,
        isFold,
        setIsFold,
        removeMessage,
        coplyLoading,
        setCoplyLoading,
        getClickList,
        getSearchTime,
        allChatList,
        getChatList,
        getFirstChatByType,
        removeChat,
        updateChat,
        getMessage,
        updateMessage,
        section,
        setSection,
        cloneChat,
        loadChat,
        getChat,
        getReccordByIdLoading,
        refreshCoupon,
        getAwards,
        isGenerate,
        setIsGenerate,
        clearMessage,
        closeNav,
        openNav,
        openQuest,
        closeQuest,
        isFocus,
        setIsFocus,
        isActionSheetOpen,
        setIsActionSheetOpen,
        actionSheetProps,
        setActionSheetProps,
        addChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
