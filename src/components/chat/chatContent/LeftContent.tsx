import { useMemo } from 'react'
import { Box, HStack, VStack, Avatar, Icon } from "@chakra-ui/react";
import { ChatChildren, ChatList } from "lib/types";
import { AiFillCaretLeft } from "react-icons/ai";
import { Operate } from "../Operate";
import { Markdown } from "components/chat/templates/Markdown"
import { Profile } from "components/chat/templates/Profile"
import { Ens } from "components/chat/templates/Ens"
import { Poap } from "components/chat/templates/Poap"
import { Snapshot } from "components/chat/templates/Snapshot"
import { Uniswap } from "components/chat/templates/Uniswap"
import { Goplus } from "components/chat/templates/Goplus"
import useChatContext from 'hooks/useChatContext'
import Search from "../templates/Search";

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

  const showQuoteIndex = useMemo(() => {
    return activeChat.messages.findLastIndex(
      (t: any) =>
        t.tool == "search" || t.tool == "fix_reply" || t.tool == "chat"
    );
  }, [activeChat?.messages]);

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
              />
            ) : item.tool === "uniswap" ? (
              <Uniswap content={item.content} />
            ) : item.tool === "search" ? (
              <Search
                item={item}
                isLast={isLast}
                done={item.done}
                sources={item.sourceList}
                content={item.content}
                submitMessage={submitMessage}
                setInput={setInput}
                showQuoteIndex={showQuoteIndex}
                index={index}
              />
            ) : (
              <Markdown value={item.content as string} />
            )}
          </VStack>
        </Box>
      </Operate>
    </HStack>
  );
}
