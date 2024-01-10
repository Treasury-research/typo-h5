import { Box, Icon, Flex, HStack, useBoolean } from "@chakra-ui/react";
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
  deepClone,
  getShortcutByprompt,
  isAddress,
  isShortcut,
  upFirst,
} from "lib";
import { Input } from "react-vant";
import { BeatLoader } from "react-spinners";
import { TextAreaTips, commands } from "components/chat/TextAreaTips";
import { v4 as uuidv4 } from "uuid";
import { useAiStore } from "store/aiStore";
import { useJwtStore } from "store/jwtStore";
import { useUserInfoStore } from "store/userInfoStore";
import useChatContext from "hooks/useChatContext";

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
    setLabelValue
  } = useChatContext()

  const { showToast } = useStore();
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
          showToast("You're not logged in yet.", "warning");
          setOpenConnectModal(true);
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
      bg="blackAlpha.50"
      spacing={0}
      py={2}
      px={4}
      borderColor="blackAlpha.50"
      borderTopWidth="1px"
      gap={3}
    >
      <Flex
        flex={1}
        pl={3}
        pr={2}
        pt="6px"
        pb="2px"
        bg="bg.white"
        borderRadius={8}
        pos="relative"
        shadow="md"
        alignItems="center"
      >
        <TextArea
          rows={1}
          ref={myInput}
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
        <Flex h="full" alignItems="flex-end">
          {isLoading && (
            <Box w="38px" mb={1}>
              <BeatLoader size={7} />
            </Box>
          )}
        </Flex>
      </Flex>
      <HStack
        h="33px"
        w="33px"
        ml={2}
        borderRadius={8}
        justify="center"
        alignItems="center"
        shadow="md"
        bg={input.trim() ? "black" : "gray.300"}
      >
        <Icon
          as={TbSend}
          color="bg.white"
          boxSize={5}
          onClick={() => {
            if (input.trim()) {
              submitMessage();
            }
          }}
        />
      </HStack>
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
