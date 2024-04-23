import React, { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { Box, Button, Icon, Image, Text } from "@chakra-ui/react";
import { BiLogIn, BiWallet } from "react-icons/bi";
import useWallet from "hooks/useWallet";

export const ConnectBtn = (props: any) => {
  const { openConnectWallet } = useWallet();
  return (
    <Box w={props.bg ? "full" : "auto"}>
      <Button
        w="full"
        leftIcon={
        props.bg ? (
          <Image
          src="https://metamask.io/home/runner/work/website/website/favicon/android-chrome-256x256.png"
          boxSize={6}
          />
        ) : (
          <Icon as={BiWallet} boxSize={5} />
        )
        }
        variant={props.bg ? "" : "bluePrimary"}
        size="sm"
        borderRadius="full"
        px={4}
        py={1}
        bg={props.bg}
        onClick={openConnectWallet}
      >
        <Text
          ml={props.bg ? 2 : 0.5}
          fontSize={props.bg ? "18px" : "14px"}
          fontWeight="semibold"
          color={props.color}
        >
          {props.isFold ? "" : "Connect wallet"}
        </Text>
      </Button>
    </Box>
  );
};
