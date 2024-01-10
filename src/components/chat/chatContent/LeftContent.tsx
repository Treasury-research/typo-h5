import { Box, HStack, VStack, Avatar, Icon } from "@chakra-ui/react";
import { ChatChildren, ChatList } from "lib/types";
import { AiFillCaretLeft } from "react-icons/ai";
import { Operate } from "../Operate";
import {
  Markdown,
  Profile,
  Ens,
  Poap,
  Snapshot,
  Uniswap,
  Goplus,
} from "components";
import useChatContext from 'hooks/useChatContext'

export function Left({
  chatId,
  messageId,
  item,
  index,
  isLast,
  isHidden,
  isPrivateHead,
  isLoading
}: any) {
  const {
    setInput,
    submitMessage,
    activeChat,
    setTotalCoupon,
    setDailyAdd,
    updateMessage,
    channel,
    isGenerate
  } = useChatContext();

  return (
    <HStack
      key={index}
      w="full"
      justify="flex-start"
      alignItems="flex-start"
      spacing={3}
      mb={3}
    >
      <Operate item={item} index={index}>
        <Avatar size="sm" src="/images/aisql/TypoGraphy.svg" mr={1} />
        <Box
          pos="relative"
          className={`ai-left-content-width ${
            item.tool === "uniswap" ? "uniswap" : ""
          }`}
          maxW="calc(100% - 90px)"
        >
          <Icon
            as={AiFillCaretLeft}
            boxSize={4}
            pos="absolute"
            left="-11.5px"
            top="9px"
            color="bg.white"
          />
          <VStack
            key={index}
            className="chat-left-content"
            pos="relative"
            spacing={3}
            px="5px"
            pb="8px"
            minH="35px"
            maxW="full"
            w="fit-content"
            pt={2}
            justify="flex-start"
            alignItems="flex-start"
            bg="bg.white"
            borderRadius={5}
          >
            {item.tool && item.tool === "profile" ? (
              <Profile
                content={item.content}
                onSend={onSend}
                setInput={setInput}
              />
            ) : item.tool === "ens" ? (
              <Ens content={item.content} />
            ) : item.tool === "poap" ? (
              <Poap content={item.content} />
            ) : item.tool === "snapshot" ? (
              <Snapshot content={item.content} />
            ) : item.tool === "goplus" ? (
              <Goplus
                content={item.content}
                onSend={onSend}
                setInput={setInput}
              />
            ) : item.tool === "uniswap" ? (
              <Uniswap content={item.content} />
            ) : (
              <Markdown value={item.content as string} />
            )}
          </VStack>
        </Box>
      </Operate>
    </HStack>
  );
}
