import { useState, useEffect, useRef, useMemo } from "react";
import ChatProvider from "components/chat/Context";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { Box, Image, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import { Header } from "components/airdrop/Header";

export default function Home() {
  const router = useRouter();

  return (
    <ChatProvider>
      <NextSeo title={"TypoX AI"} />
      <VStack w="100vw" h="100vh" bg="#000">
        <Header />
        <iframe
        src="https://www.typox.ai/airdrop"
        title="TypoX AI"
        width="100%"
        height="100%"
        />
      </VStack>
    </ChatProvider>
  );
}
