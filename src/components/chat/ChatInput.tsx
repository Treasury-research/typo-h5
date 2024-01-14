import { Box, Icon, Flex, HStack, useBoolean, useToast } from "@chakra-ui/react";
import api from "api";
import {
  useImperativeHandle,
  forwardRef,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { TbSend } from "react-icons/tb";
import { useStore } from "store";
import { ChatList } from "lib/types";
import {
  getShortcutByprompt,
  isAddress,
  isShortcut,
  upFirst,
} from "lib";
import { Input } from "react-vant";
import { BeatLoader } from "react-spinners";
import { TextAreaTips, commands } from "components/chat/TextAreaTips";
import SearchIcon from "components/icons/Search";
import { v4 as uuidv4 } from "uuid";
import { useAiStore } from "store/aiStore";
import { useJwtStore } from "store/jwtStore";
import { useUserInfoStore } from "store/userInfoStore";
import useChatContext from "hooks/useChatContext";
import { useQuoteStore } from "store/quoteStore";
import { QuoteTem } from "./QuoteTem";

const { TextArea } = Input;

export const ChatInput = () => {
  const {
    input,
    isLoading,
    setIsLoading,
    allChatList,
    isSandBox,
    sandBoxType,
    setInput,
    openNav,
    onScroll,
    submitMessage,
    isFocus,
    setIsFocus,
    labelValue,
    setLabelValue,
    section
  } = useChatContext()

  const {
    isShowInputQuote,
    quoteContent,
    quoteType,
    setIsShowInputQuote,
    setQuoteContent,
    setQuoteType,
    isCopilot,
    setIsCopilot,
    setClickList,
    clickList,
  } = useQuoteStore();

  const showToast = useToast();
  const { userId, account } = useUserInfoStore();
  const { jwt, setJwt } = useJwtStore();
  const myInput = useRef<any>(null);
  const myTip = useRef<any>(null);
  const [isComposition, setIsComposition] = useState(false);
  const { setTotalCoupon, setUsedCoupon } = useAiStore();

  const onPressEnter = (e: any) => {
    console.log('onPressEnter', e)
    if (!e.shiftKey && e.key === "Enter") {
      e.preventDefault();

      if (!isComposition && input.trim()) {
        if (
          !userId &&
          commands.findIndex((item) => input.trim().includes(item)) > -1
        ) {
          showToast({
            position: 'top',
            title: `You're not logged in yet.`,
            variant: 'subtle',
            status: 'warning'
          })
          // setOpenConnectModal(true);
          return;
        }
        submitMessage();
      }
    }
  };

  const inputFocus = () => {
    myInput.current.focus();
  };

  useEffect(() => {
    if (!userId) {
      return;
    }
    setIsLoading.off();
    setInput("");
    onScroll(1000);
  }, [userId]);

  return (
    <HStack
      pos="relative"
      w="full"
      // bg="blackAlpha.50"
      spacing={0}
      py={2}
      px={4}
      // borderColor="blackAlpha.50"
      // borderTopWidth="1px"
      gap={3}
    >
      <Flex
        boxShadow="2px 2px 6px 0px rgba(0, 0, 0, 0.12), -2px -2px 6px 0px rgba(255, 255, 255, 0.90)"
        flex={1}
        pl={3}
        pr={3}
        pt="6px"
        pb="2px"
        bg="bg.white"
        borderRadius={8}
        pos="relative"
        shadow="md"
        alignItems="center"
        position="relative"
      >
        <Box display="flex" flexDirection="column" marginRight="auto" width="calc(100% - 90px)">
          <TextArea
            rows={1}
            ref={myInput}
            minHeight="40px"
            className="chat-input flex-1 no-scrollbar"
            placeholder="You can ask me anything! I am here to help."
            value={input}
            onChange={setInput}
            autoSize={{ maxHeight: 150 }}
            onFocus={setIsFocus.on}
          // onPressEnter={onPressEnter}
            onKeyDown={(e: any) => {
              if (e.code === "ArrowUp" || e.code === "ArrowDown") {
                myTip.current.popupKeyUp(e.code);
              } else if (e.code === "Enter") {
                onPressEnter(e)
                setTimeout(() => {
                  myInput.current.focus();
                });
              }
            }}
            onBlur={() =>
              setTimeout(() => {
                setIsFocus.off();
              }, 300)
            }
          />
          {isShowInputQuote && section !== "magicWand" && (
            <Box className="mt-2 w-[fit-content]" marginBottom="4px">
              <QuoteTem
                content={quoteContent}
                showDeleteIcon={true}
                type={quoteType}
              />
            </Box>
          )}
        </Box>
        <HStack
          h="33px"
          minW="33px"
          padding="0 4px"
          ml={2}
          borderRadius={8}
          justify="center"
          alignItems="center"
          shadow="md"
          bg={input.trim() ? "black" : "gray.300"}
        >
          {!isLoading && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={() => {
                if (input.trim()) {
                  submitMessage();
                }
              }}>
              <Box marginTop="2px" height="100%">
                <SearchIcon />
              </Box>
              {/* <Icon
                  as={TbSend}
                  color="bg.white"
                  boxSize={5}
                  marginTop="2px"
                  onClick={() => {
                  if (input.trim()) {
                  submitMessage();
                  }
                  }}
                  /> */}
              <Box marginLeft="4px" marginRight="10px"  color="white">{`(0/30)`}</Box>
            </Box>
          )}
          {isLoading && (
            <Box w="38px" mb={1} height="100%" display="flex" alignItems="center" justifyContent="center">
              <BeatLoader size={7} />
            </Box>
          )}
        </HStack>
      </Flex>
      {userId && allChatList && allChatList.length && (
        <Box
          pos="absolute"
          w="full"
          top="-60px"
          left="0px"
          h="40px"
          bgImg="url('/images/aisql/gradient.png')"
          bgRepeat="repeat"
          borderRadius={10}
        />
      )}
    </HStack>
  );
};

ChatInput.displayName = "ChatInput";
