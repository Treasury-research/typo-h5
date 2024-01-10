import { Flex, VStack, Container, useBoolean } from "@chakra-ui/react";
import { ChatList } from "lib/types";
import { NextSeo } from "components";
import { ChatInput } from "components/chat/ChatInput";
import { ChatTitle } from "components/chat/ChatTitle";
import { ChatContent } from "components/chat/ChatContent";
import { Quest } from "components/chat/Quest";
import { useState, useEffect, useRef, useMemo } from "react";
import { useUserInfoStore } from "store/userInfoStore";
import { isPhone } from "lib";
import { Menu } from "components/chat/menu";
import useChatContext from "hooks/useChatContext";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import Chat from 'components/chat'
import ChatProvider from 'components/chat/Context'

export default function Home() {
  return (
    <ChatProvider>
      <Chat />
    </ChatProvider>
  )
}
