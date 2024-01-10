import React, { useEffect } from 'react'
import { Box, Flex, VStack, Container } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import useChatContext from 'hooks/useChatContext'
import ChatLayout from "components/Layout";
import { Menu } from "components/chat/menu";
import { ChatContent } from "components/chat/chatContent";
import { ChatInput } from "components/chat/ChatInput";
import { useAccount } from "wagmi";
import { ChatTitle } from "components/chat/ChatTitle";
import { useUserInfoStore } from "store/userInfoStore";
import { Quest } from "components/chat/Quest";
import ChatProvider from 'components/chat/Context'

const Chat = () => {
  const router = useRouter();
  const {
    setSection,
    setActiveChatId,
    getChat,
    loadChat,
    isLoading,
    showNav,
    showQuest
  } = useChatContext()
  const chatKey: any = router?.query?.chatKey || [];
  const [section, chatId] = chatKey;
  const { isConnected, address } = useAccount();
  const { userId } = useUserInfoStore();
  const needSign = isConnected && !userId

  console.log('chatKey', chatKey)
  useEffect(() => {
    if (section) {
      setSection(section)
    }
  }, [section])

  useEffect(() => {
    if (chatId) {
      if (getChat(chatId)) {
        setActiveChatId(chatId)
      } else {
        loadChat(chatId)
      }
    }
  }, [chatId])

  return (
    <>
      <NextSeo title={"TypoGraphy AI"} />
      <Container
        w="100vw"
        pr={0}
        pl={0}
        overflow="hidden"
        className="no-scrollbar"
      >
        <Flex
          w="280vw"
          h="full"
          className={showNav ? "move-left" : showQuest ? "move-right" : "move-center"}
        >
          <Menu />
          <VStack
            w="100vw"
            h="full"
            pos="relative"
            overflow="hidden"
            alignItems="flex-start"
            bg="#f4f5f6"
            gap="0"
          >
            <ChatTitle />
            <VStack
              pt={1}
              w="full"
              h="calc(100% - 55px)"
              mt="0!"
              bg="#f4f5f6"
              alignItems="flex-start"
            >
              <ChatContent />
              {!needSign && (<ChatInput />)}
            </VStack>
          </VStack>
          <Quest />
        </Flex>
      </Container>
    </>
  );
}

export default Chat
