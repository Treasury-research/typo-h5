import {
  Icon,
  Text,
  useBoolean,
  VStack,
  Button,
  Box,
  Badge,
} from "@chakra-ui/react";
import { BsCommand } from "react-icons/bs";
import { BiWallet } from "react-icons/bi";

import { useEffect, useMemo, useState } from "react";
import { Cell, Swiper, Typography, Image } from "react-vant";

import { useUserInfoStore } from "store/userInfoStore";
import useWallet from "lib/useWallet";
import { useAccount } from "wagmi";
import { useStore } from "store";
import api from "api";

const slides = [
  // {
  //   url: "/images/aisql/tus.webp",
  // },
  {
    url: "/images/aisql/driver.png",
  },
  {
    url: "/images/aisql/knexus.webp",
    link: "https://knexus.xyz/create?utm_source=typo+quest&utm_campaign=kn+mbti",
  },
];

const sandboxSlides = [
  {
    url: "/images/aisql/driver.png",
  },
  {
    url: "/images/aisql/knexus.webp",
    link: "https://knexus.xyz/create?utm_source=typo+quest&utm_campaign=kn+mbti",
  },
];

export function Guide({
  onSend,
  setInput,
  isSandBox,
}: {
  isSandBox: boolean;
  onSend: (isReGenerate?: boolean) => void;
  setInput: (value: string) => void;
}) {
  const [commands, setCommands] = useState([]);
  const { userId } = useUserInfoStore();
  const { isConnected, address } = useAccount();
  const { openInviteModal, setOpenInviteModal } = useStore();

  const { handleSign, openConnectWallet, isSign } = useWallet();

  const needSign = useMemo(() => {
    return isConnected && !userId;
  }, [isConnected, userId]);

  // console.log(isConnected, needSign);

  const list = useMemo(() => {
    return isSandBox ? sandboxSlides : slides;
  }, [isSandBox]);

  const cmds = useMemo(() => {
    return isSandBox
      ? commands.filter((item: any) => item?.type === "short")
      : commands.filter((item: any) => item?.type === "normal");
  }, [isSandBox, commands]);

  const getCommands = async () => {
    const result: any = await api.get("api/shortcut/questions");
    if (result?.code === 200) {
      setCommands(result?.data as any);
    }
  };

  useEffect(() => {
    if (needSign && isSign) {
      handleSign(address as string);
    }
  }, [needSign, isSign]);

  useEffect(() => {
    if (userId) {
      getCommands();
    }
  }, [userId]);

  return (
    <VStack
      className="guide"
      w="full"
      h="full"
      justify="flex-start"
      alignItems="center"
    >
      <Swiper
        autoplay={5000}
        indicator={(total: number, current: any) => (
          <Box className="custom-indicator">
            {current + 1}/{total}
          </Box>
        )}
      >
        {list.map((item, index) => {
          return (
            <Swiper.Item key={item.url}>
              <Box
                cursor="pointer"
                onClick={() => {
                  item.link && window.open(item.link);
                }}
              >
                <Image alt="" src={item.url} fit="contain" />
              </Box>
            </Swiper.Item>
          );
        })}
      </Swiper>

      <VStack w="full" justify="center" flexDir="column" spacing={5} mt="40px!">
        {userId ? (
          cmds.map((item: any, index) => {
            return (
              <Box key={index} w="full" pos="relative">
                <Cell.Group card>
                  <Cell
                    style={{ alignItems: "center" }}
                    title={
                      <Typography.Text ellipsis>
                        {item?.question}
                      </Typography.Text>
                    }
                    icon={<Icon as={BsCommand} w="20px" />}
                    isLink
                    onClick={() => {
                      setInput(item?.question);
                      onSend();
                    }}
                  />
                </Cell.Group>
              </Box>
            );
          })
        ) : (
          <>
            <Button
              leftIcon={<Icon as={BiWallet} boxSize={5} />}
              variant="blackPrimary"
              size="md"
              w="52%"
              h="42px"
              fontWeight="600"
              borderRadius={8}
              onClick={() => {
                needSign ? handleSign(address as string) : openConnectWallet();
              }}
            >
              {needSign ? "Sign with Wallet" : "Connect Wallet "}
            </Button>
          </>
        )}
      </VStack>
    </VStack>
  );
}
