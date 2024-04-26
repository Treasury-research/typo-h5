import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Image,
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Badge,
} from "@chakra-ui/react";
import useWallet from "hooks/useWallet";
import { useUserInfoStore } from "store/userInfoStore";
import { Avatar, InviteModal, PurchaseModal } from "components";
import { toShortAddress, isPhone } from "lib";
import { useStore } from "store";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaPowerOff } from "react-icons/fa";

export const Header = () => {
  const router = useRouter();
  const { doLogout, openConnectWallet } = useWallet();
  const { account, username, userId } = useUserInfoStore();
  const [isphone, setIsphone] = useState(true);

  return (
    <Flex
      pos="fixed"
      zIndex="3"
      top="20px"
      w="1200px"
      h="60px"
      mx="auto"
      left="0"
      className="airdrop blue-filter"
      boxShadow="md"
      color="#fff"
      px="12px"
      alignItems="center"
      justify="space-between"
      borderRadius="full"
      fontSize="10px"
    >
      <HStack
        cursor="pointer"
        onClick={() => window.open("https://www.typox.ai/")}
        paddingLeft="10px"
      >
        <Image src="/images/bg-icon.png" alt="" h="28px" />
      </HStack>
      <HStack
        fontWeight="semibold"
        spacing={3}
        fontSize="10px"
      >
        <Box pos="relative">
          <Text
            cursor="pointer"
            _hover={{ borderBottom: "solid 1px #fff" }}
            onClick={() => {
              router.push("/airdrop");
            }}
          >
            Airdrop
          </Text>
          <Badge
            pos="absolute"
            left="10px"
            top="-16px"
            borderRadius="6px"
            boxShadow="md"
            color="#fff"
            w="25px"
            h="14px"
            textAlign="center"
            bg="var(--green-grad, linear-gradient(92deg, #487C7E 0%, #004D50 99.5%));"
            fontSize="10px"
            lineHeight="14px"
          >
            S2
          </Badge>
        </Box>

        <Box pos="relative">
          <Text
            cursor="pointer"
            _hover={{ borderBottom: "solid 1px #fff" }}
            onClick={() => {
              // router.push("/airdrop/nft");
            }}
          >
            Genesis NFT
          </Text>
          <Badge
            pos="absolute"
            left="18px"
            top="-16px"
            borderRadius="6px"
            boxShadow="md"
            color="#fff"
            w="40px"
            h="14px"
            textAlign="center"
            bg="#FF3232"
            fontSize="10px"
            lineHeight="14px"
          >
            Soon
          </Badge>
        </Box>
        <Text
          cursor="pointer"
          _hover={{ borderBottom: "solid 1px #fff" }}
          onClick={() => {
            router.push("/airdrop/leaderboard/1");
          }}
        >
          Leaderboard
        </Text>
      </HStack>

      <HStack fontWeight="semibold" spacing={2}>
        {userId && (
          <HStack
            py={1}
            pl="5px"
            pr={4}
            bg="blackAlpha.500"
            fontSize="14px"
            className="referral-panel"
            alignItems="center"
            justify="center"
            borderRadius="full"
            cursor="pointer"
            shadow="md"
            fontWeight="400"
            _hover={{ bg: "blackAlpha.600" }}
            onClick={() => window.open("/explorer")}
            spacing={1}
          >
            <HStack
              w="28px"
              h="28px"
              borderRadius="full"
              justify="center"
              bg="blackAlpha.600"
            >
              <Icon as={IoChatbubbleEllipsesOutline} boxSize={5} />
            </HStack>
            <Text className="referral" fontWeight="semibold">
              Dapp
            </Text>
          </HStack>
        )}

        <HStack
          py={1}
          pl="5px"
          pr="5px"
          className="avatar-panel"
          bg="blackAlpha.500"
          fontSize="14px"
          alignItems="center"
          justify="center"
          borderRadius="full"
          cursor="pointer"
          shadow="md"
          fontWeight="400"
          _hover={{ bg: "blackAlpha.600" }}
        >
          {userId ? (
            <Menu>
              <MenuButton
                as={Button}
                bg="transparent!"
                h="auto"
                minW="auto"
                px={0}
                py={0}
                _hover={{ bg: "transparent" }}
              >
                <HStack className="w-full">
                  <Avatar w={28} />

                  <Text className="address" color="white" fontWeight="light" pr={1}>
                    {toShortAddress(account || "--", 10)}
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList w="110px" minW="110px" py={0} ml="30px!" mt="2px">
                <MenuItem bg="#535353!" _hover={{ bg: "blackAlpha.800!" }}>
                  <HStack
                    color="#fff"
                    cursor="pointer"
                    fontWeight="semibold"
                    onClick={() => {
                      doLogout();
                    }}
                  >
                    <Icon as={FaPowerOff} boxSize={4} />
                    <Text> Logout</Text>
                  </HStack>
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <HStack onClick={openConnectWallet}>
              <HStack
                w="28px"
                h="28px"
                borderRadius="full"
                justify="center"
                bg="blackAlpha.600"
              >
                <Image
                  src="https://metamask.io/home/runner/work/website/website/favicon/android-chrome-256x256.png"
                  boxSize={4}
                />
              </HStack>
            </HStack>
          )}
        </HStack>
      </HStack>
      <InviteModal />
      <PurchaseModal />
    </Flex>
  );
};
