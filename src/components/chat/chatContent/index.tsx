import { Box, VStack, Text } from "@chakra-ui/react";
import { ChatChildren, ChatList } from "lib/types";

import { Left } from "./LeftContent";
import { Error } from "./ErrorContent";
import { Right } from "./RightContent";
import { Guide } from "./../Guide";

import { useUserInfoStore } from "store/userInfoStore";
import { useMemo } from "react";
import useChatContext from 'hooks/useChatContext'

export function ChatContent() {
  const {
    activeChat,
    setInput,
    isSandBox,
    setIsSandBox,
    isLoading,
    setAgent,
    showAgent,
    onScroll,
    openNav
  } = useChatContext();

  const messages = activeChat?.messages;
  const lastMessage = messages && messages.findLast((item: any) => item.type === "answer");
  const { userId } = useUserInfoStore();
  const showChat = activeChat?.messages?.length > 0

  return (
    <>
      {showChat && (
        <Text
          className="animate__animated animate__fadeInLeft"
          pos="absolute"
          top="65px"
          left="-2px"
          fontSize="xs"
          fontWeight="semibold"
          bg="blackAlpha.100"
          px={2}
          py="2px"
          color="blackAlpha.700"
          borderRightRadius={5}
          zIndex={5}
          onClick={openNav}
        >
          {activeChat?.name || "Title"}
        </Text>
      )}

      <Box
        w="full"
        mt={showChat ? "35px!" : "10px"}
        pb={showChat ? "50px!" : "20px"}
        mb="20px!"
        id="chat-content"
        h="calc(100% - 90px)"
        overflowY="scroll"
        className="no-scrollbar"
      >
        {showChat ? (
          <VStack
            pos="relative"
            w="full"
            justify="flex-start"
            alignItems="center"
            spacing={8}
            mt={3}
            px={3}
            fontFamily="Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto"
          >
            {activeChat.messages.map((item: any, index: any) => {
              return (
                <Box key={index} w="full">
                  {item.type === "question" ? (
                    <Right
                      list={list}
                      item={item}
                      chatIndex={chatIndex || 0}
                      isLoading={isLoading}
                      index={index}
                      setList={setList}
                    />
                  ) : item.error ? (
                    <Error
                      item={item}
                      chatIndex={chatIndex || 0}
                      index={index}
                      list={list}
                      onSend={onSend}
                      setList={setList}
                      setInput={setInput}
                    />
                  ) : (
                    <Left
                      list={list}
                      item={item}
                      chatIndex={chatIndex || 0}
                      isLoading={isLoading}
                      index={index}
                      setList={setList}
                      onSend={onSend}
                      setInput={setInput}
                    />
                  )}
                </Box>
              );
            }
            )}
          </VStack>
        ) : (
          <Guide />
        )}
      </Box>
    </>
  );
}
