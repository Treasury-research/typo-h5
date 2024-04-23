import {
  VStack,
  Image,
  Text,
  HStack,
  Flex,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  useBoolean,
  Box,
  Icon,
  Divider,
} from "@chakra-ui/react";
import api from "api";
import { formatScore, getHash, isProduction } from "lib";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useUserInfoStore } from "store/userInfoStore";
import { useStore } from "store";
import useChatContext from "hooks/useChatContext";
import { TbArrowsExchange } from "react-icons/tb";
import { BaseModal } from "components";
import { Steps } from "antd";
import { InfoIcon } from "@chakra-ui/icons";
import { chainList } from "lib/chain";
import useWallet from "hooks/useWallet";
import { useWriteContract } from "wagmi";
import { Address } from "viem";
import AIFX_ABI from "lib/abi/AIFX.json";

export const NftCard = ({ isAirdrop = false }: { isAirdrop?: boolean }) => {
  const router = useRouter();
  const { getAuth } = useChatContext();
  const { account, userId, level, nftLevel, token_id, score, setNftLevel } =
    useUserInfoStore();
  const { chainId, switchNetwork } = useWallet();
  const { showToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useBoolean(false);
  const [isLoading, setIsLoading] = useBoolean(false);
  const [isSign, setIsSign] = useBoolean(false);
  const [isSuccess, setIsSuccess] = useState<string>("ready");

  const { writeContractAsync } = useWriteContract();

  const chainInfo = useMemo(() => {
    return isProduction ? chainList[42161] : chainList[80001];
  }, [chainList]);

  const getSignMsg = async () => {
    try {
      const res: any = await api.post(`api/sign`, {
        level: level,
      });
      if (res && res?.code == 200 && res?.data) {
        return res?.data;
      } else {
        setIsLoading.off();
        setIsSuccess("fail");
        showToast(
          res?.data?.errorMsg || "Get server sign message error!",
          "warning"
        );
        return null;
      }
    } catch (error) {
      setIsLoading.off();
      setIsSuccess("fail");
      showToast(`Get server sign message error!`, "warning");
    }
  };

  const getMintStatus = async (tx_hash: string) => {
    const res = await getHash(tx_hash);
    // console.log("mint blockHash", res?.blockHash);
    if (res && res.blockHash) {
      showToast(`Congratulations, NFT minted successfully`, "success");
      setIsSuccess("done");
      setTimeout(() => {
        getAuth();
      }, 5000);

      setNftLevel(level);
      setIsLoading.off();
      setIsSign.off();
    } else {
      setTimeout(() => {
        getMintStatus(tx_hash);
      }, 3000);
    }
  };

  const mint = async () => {
    if (chainId !== chainInfo.chainId) {
      showToast(`Please switch networks first!`, "warning");
      switchNetwork(chainInfo.chainId);
      return;
    }

    setIsLoading.on();
    const signMsg = await getSignMsg();

    if (signMsg) {
      try {
        const result = await writeContractAsync({
          abi: AIFX_ABI,
          address: chainInfo.NftLevelContract as Address,
          functionName: token_id ? "setLevel" : "publicMint",
          args: token_id
              ? [token_id, BigInt(level), signMsg]
              : [account, BigInt(level), signMsg],
        });

        setIsSign.on();
        if (result) {
          getMintStatus(result);
        }
      } catch (err: any) {
        console.log("err", err);
        setIsLoading.off();
        setIsSign.off();
        setIsSuccess("fail");
        showToast(err?.message || "Unknown Error", "warning");
      }
    }

    // setIsLoading.off();
  };

  const mintText = useMemo(() => {
    if (score < 1000) {
      return nftLevel === 1 ? "Claim Lv2" : "Claim Lv1";
    } else if (score >= 1000 && score < 50000) {
      return nftLevel === 2 ? "Claim Lv3" : "Claim Lv2";
    } else {
      return nftLevel === 3 ? "Claimed" : "Claim Lv3";
    }
  }, [nftLevel, score]);

  return (
    <VStack
      w="full"
      p={2}
      borderRadius="10px"
      alignItems="center"
      bg={isAirdrop ? "" : "url('/images/rank/nftCard.svg')"}
      className={isAirdrop ? "blue-filter" : ""}
      bgSize="cover"
      shadow="md"
      color="#fff"
      fontSize="14px"
      overflow="hidden"
      spacing={0}
    >
      <Flex py={1} px={3} w="full" justify="space-between">
        <HStack>
          <Text fontSize="15px" fontWeight="semibold">
            TypoX AI Fans NFT
          </Text>
          <Text
            fontSize="xs"
            pl={3}
            pt="2px"
            fontWeight="600"
            cursor="pointer"
            _hover={{ color: "bg.main" }}
            onClick={() =>
              window.open(
                "https://dune.com/typox_ai/typox-ai-aifx-loyalty-stats-on-chain"
              )
            }
          >
            Progress {`>`}
          </Text>
        </HStack>

        <Image src={`/images/rank/arb.svg`} objectFit="contain" />
      </Flex>

      <Flex
        w="full"
        px={1}
        pt={2}
        pb={1}
        justify="space-between"
        alignItems="center"
      >
        <HStack flex={1} mr="25px">
          <Image
          src={`/images/rank/LV${level}.svg`}
          objectFit="contain"
          w="60px"
          />
          <Box flex={1} mr={3} minW="180px">
            <Text fontWeight="semibold" mt={-3} fontSize="22px">
              Lv{level}{" "}
              {level === 1 ? "Rookie" : level === 2 ? "Supporter" : "Champion"}
            </Text>
            {/* <Text fontSize="xs">Loyalty Score {formatScore(score)}/50K</Text> */}
          </Box>
        </HStack>
        <Button
          variant="whitePrimary"
          h="28px"
          size="sm"
          px={3}
          fontWeight="semibold"
          isDisabled={
          (nftLevel === 1 && score < 1000) ||
          (nftLevel === 2 && score < 50000) ||
          (nftLevel === 3 && score > 50000)
          }
          onClick={() => {
            setIsSign.off();
            setIsLoading.off();
            setIsModalOpen.on();
            setIsSuccess("ready");
          }}
        >
          <Text color="#487C7E" fontSize="13px">
            {mintText}
          </Text>
        </Button>
      </Flex>

      <Box pb={3} pt={1} w="112%" className="nft-steps">
        <Steps
        current={nftLevel ? nftLevel : 0}
        labelPlacement="vertical"
        size="small"
        percent={(score / (nftLevel ? 1000 : 50000)) * 100}
        status="process"
        items={[
          {
            title: "Lv1",
          },
          {
            title: "Lv2",
          },
          {
            title: "Lv3",
          },
        ]}
        />
      </Box>

      <Flex px={3} pb={3} w="full" alignItems="center" justify="space-between">
        <HStack spacing={1.5}>
          <Image src={`/images/rank/task.svg`} h="50px" />
          <Box>
            <Text fontSize="13px" fontWeight="semibold">
              To Lv2
            </Text>
            <Text
              cursor="pointer"
              fontSize="xs"
              onClick={() =>
                window.open("https://zealy.io/cw/typoxai/questboard")
              }
            >
              Complete Quests {`>`}
            </Text>
          </Box>
        </HStack>
        <Divider orientation="vertical" h="30px" w="2px" />
        <HStack spacing={1.5}>
          <Image src={`/images/rank/card.svg`} h="55px" />
          <Box>
            <Text fontSize="13px" fontWeight="semibold">
              To Lv3
            </Text>
            <Text
              cursor="pointer"
              fontSize="xs"
              onClick={() => router.push("/profile")}
            >
              Redeem Pass {`>`}
            </Text>
          </Box>
        </HStack>
      </Flex>

      <HStack fontSize="xs" pt={1} pb={2}>
        <InfoIcon />
        <Text>Claim before the snapshot to get the airdrop.</Text>
      </HStack>
      <BaseModal
        isOpen={isModalOpen}
        onClose={setIsModalOpen.off}
        title={""}
        size="3xl"
      >
        {isSuccess === "ready" ? (
          <VStack className="text-center" mb="8">
            <HStack spacing={5} className="mt-6 mb-3" alignItems="center">
              <Image
              src={`/images/rank/LV${level}.svg`}
              objectFit="contain"
              w="85px"
              mt={4}
              />

              <Icon as={TbArrowsExchange} color="bg.green" boxSize={6} />

              <Image
              src={`/images/rank/NFT${level}.svg`}
              objectFit="contain"
              w="70px"
              />
            </HStack>

            <Text className="text-[24px] font-bold mb-2">
              You are claiming the badge of LV{level}{" "}
            </Text>

            {(level === 1 || level === 2) && (
              <Text
                className="text-[#FFA047] w-[350px] text-[13px] pb-8"
                lineHeight="18px"
              >
                Notice: You can upgrade to higher level after claiming，or
                directly claim higher level later.
              </Text>
            )}

            {isSign && (
              <Text fontSize="xs" color="gray.500">
                The transaction is expected to take about 1 minutes.
              </Text>
            )}
            <Button
              colorScheme="teal"
              size="sm"
              marginBottom={"40px"}
              borderRadius="md"
              isLoading={isLoading}
              loadingText={isSign ? "Transaction Submitted" : "Please sign"}
              onClick={mint}
            >
              Confirm
            </Button>
          </VStack>
        ) : (
          <VStack className="text-center" mb="8">
            <Image
            src={`/images/rank/${isSuccess}.svg`}
            objectFit="contain"
            w="80px"
            h="88px"
            className="mx-auto mt-10 mb-3"
            />

            <Text className="text-[24px] font-bold mb-2">
              {isSuccess === "done" ? "Mint Success" : "Mint failed"}
            </Text>

            <Text
              className="text-[#575B66] w-[300px] text-[13px] pb-8"
              lineHeight="18px"
            >
              {isSuccess === "done"
              ? "The badge has been issued to your account, please check it!"
              : "Please try again later"}
            </Text>

            <Button
              colorScheme="teal"
              size="sm"
              marginBottom={"40px"}
              width={"120px"}
              borderRadius="md"
              onClick={setIsModalOpen.off}
            >
              OK
            </Button>
          </VStack>
        )}
      </BaseModal>
    </VStack>
  );
};
