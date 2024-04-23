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
        <Box className="no-scrollbar w-[1200px] relative mr-2 pt-[120px] overflow-auto p-10">
          <VStack w="full" color="#fff" h="400px">
            <Image src="/images/airdrop-nft.svg" alt="" w="full" />
          </VStack>
        </Box>
      </VStack>
    </ChatProvider>
  );
}
