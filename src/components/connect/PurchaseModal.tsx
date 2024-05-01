import React, { useEffect, useMemo, useState } from "react";
import { BaseModal } from "components";
import { useNftStore } from "store/nftStore";
import {
  Flex,
  Box,
  Image,
  Button,
  Input,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBoolean,
  VStack,
  HStack,
  Link,
  useInterval,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { ethers } from "ethers";
import api, { baseURL } from "api";
import useWallet from "hooks/useWallet";
import { useUserInfoStore } from "store/userInfoStore";
import { useChatStore } from "store/chatStore";
import useTranslation from "hooks/useTranslation";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

import useChatContext from "hooks/useChatContext";
import { useQuoteStore } from "store/quoteStore";
import { isProduction, toShortAddress, waitSeconds } from "lib/common";
import { useStore } from "store";
import { Network } from "components";
import { Address, erc20Abi } from "viem";
import { chainList } from "lib/chain";
import QUAR_ABI from "lib/abi/QuarterlyPass.json";
import { useJwtStore } from "store/jwtStore";

export function PurchaseModal() {
  const {
    purchaseType,
    showPurchaseModal,
    showTccModal,
    showRechargeSuccessModal,
    showPurchaseSuccessModal,
    setPurchaseType,
    setShowPurchaseModal,
    setShowTccModal,
    setShowBack,
    showBack,
    setShowRechargeSuccessModal,
    setShowPurchaseSuccessModal,
  } = useNftStore();
  const router = useRouter();
  const { t } = useTranslation();
  const { showToast } = useStore();
  const jwt = useJwtStore.getState().jwt;
  const { chainId, address, balance, provider, openConnectWallet } =
    useWallet();
  const { userId } = useUserInfoStore();
  const { setIsOpenQuest, setActiveTab } = useQuoteStore();
  const { getAuth, submitMessage, setInput } = useChatContext();

  const [purchaseCardMount, setPurchaseCardMount] = useState<number>(1);
  const [usdtValue, setUsdtValue] = useState<any>(null);
  const [tccValue, setTccValue] = useState<any>(null);
  const [purchaseState, setPurchaseState] = useState<any>(purchaseType);

  const [loading, setLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [dataHash, setDataHash] = useState<string>("");
  const [purchaseLoading, setPurchaseLoading] = useBoolean(false);
  const [approving, setApproving] = useBoolean(false);
  const [allowance, setAllowance] = useState(0);
  const { writeContractAsync } = useWriteContract();

  const { isLoading, error, status } = useWaitForTransactionReceipt({
    hash: dataHash as Address,
  });

  // console.log("balance", balance);
  // console.log("allowance", allowance);

  const spendValue = useMemo(() => {
    return purchaseState == 0 ? 10 * purchaseCardMount : 25 * purchaseCardMount;
  }, [purchaseCardMount, purchaseState]);

  const isEnough = useMemo(() => {
    return balance - spendValue >= 0;
  }, [balance, spendValue]);

  const handleTransaction = async () => {
    try {
      const result = await writeContractAsync({
        address: chainList[chainId].UContract,
        abi: erc20Abi,
        functionName: "transfer",
        args: [
          isProduction
          ? ("0x040dAa5d123A04919F5E35303CEF95cb9A59859e" as Address)
          : ("0xD3420A3be0a1EFc0FBD13e87141c97B2C9AC9dD3" as Address),
          BigInt(usdtValue * 10 ** 6),
        ],
      });
      if (result) {
        setDataHash(result);
      }
    } catch (e: any) {
      console.log("e", e);
      setLoading(false);
    }
  };

  const getAllowance = async () => {
    if (showPurchaseSuccessModal) {
      try {
        const erc20Contract = new ethers.Contract(
          chainList[chainId]?.UContract,
          erc20Abi,
          provider
        );
        const result = await erc20Contract?.allowance(
          address,
          chainList[chainId].RedeemContract
        );

        setAllowance(Number(result.toString()) / 10 ** 6);
      } catch (error) {}
    }
  };

  const approve = async () => {
    try {
      setApproving.on();
      const signer = provider.getSigner();
      const erc20Contract = new ethers.Contract(
        chainList[chainId].UContract,
        erc20Abi,
        signer
      );

      await erc20Contract?.approve(
        chainList[chainId].RedeemContract,
        BigInt(100000 * 10 ** 6)
      );

      await waitSeconds(3000);
      setApproving.off();
    } catch (error: any) {
      setApproving.off();
      showToast(error.message || "Approving Error", "warning");
    }
  };

  const purchaseNft = async () => {
    if (!userId || !jwt) {
      setShowPurchaseSuccessModal(false);
      openConnectWallet();
      return;
    }

    if (allowance < spendValue) {
      return;
    }

    try {
      setPurchaseLoading.on();
      const result = await writeContractAsync({
        address: chainList[chainId].RedeemContract as Address,
        abi: QUAR_ABI,
        functionName: "publicMint",
        args: [address, purchaseState, purchaseCardMount],
      });

      if (result) {
        setHash(result);
        setPurchaseCardMount(1);
        getAuth();
        setPurchaseLoading.off();
      }
    } catch (error: any) {
      console.log("error", error);
      setPurchaseLoading.off();
      showToast(error.message || "Purchase Error", "warning");
    }
  };

  useInterval(getAllowance, 1000);

  useEffect(() => {
    setPurchaseState(purchaseType);
  }, [purchaseType]);

  useEffect(() => {
    if (dataHash && status != "pending") {
      if (status === "success") {
        setLoading(false);
        setUsdtValue(null);
        setTccValue(null);
        setShowTccModal(false);
        setShowRechargeSuccessModal(true);
        setTimeout(() => {
          getAuth();
        }, 3 * 60 * 1000);
      } else {
        showToast(error?.message || "Unknown Error", "warning");
        setLoading(false);
      }
    }
  }, [status, dataHash, error]);

  useEffect(() => {
    setHash("");
    setPurchaseLoading.off();
  }, [showPurchaseSuccessModal]);

  return (
    <>
      {/* <!---购买信息--> */}
      <BaseModal
        isOpen={showPurchaseModal}
        onClose={() => {
          setPurchaseCardMount(1);
          setShowPurchaseModal(false);
        }}
        title={""}
        size="4xl"
      >
        <div className="mt-5 mb-5 w-full">
          <div className="flex">
            <div className="w-[280px] me-14">
              <Image
              alt=""
              w="280px"
              src={`/images/pass/${
                                                                        purchaseState == 0 ? "30day" : "90day"
                                                                }-un.png`}
              />
            </div>
            <div className="w-[calc(100%-360px)] pt-3">
              <div className="flex items-center mb-2">
                <div className="me-2 text-[24px] font-bold mb-5">
                  {purchaseState == 0
                  ? t("purchaseModal.title", { day: 30 })
                  : t("purchaseModal.title", { day: 90 })}
                </div>
                <Menu>
                  {({ isOpen }) => (
                    <>
                      <MenuList w="full">
                        <MenuItem
                          _hover={{ bg: "#DAE5E5" }}
                          bg={purchaseState == 0 ? "#DAE5E5" : "#fff"}
                          onClick={() => {
                            setPurchaseType(0);
                          }}
                        >
                          {t("purchaseModal.title", { day: 30 })}
                        </MenuItem>
                        <MenuItem
                          _hover={{ bg: "#DAE5E5" }}
                          bg={purchaseState == 1 ? "#DAE5E5" : "#fff"}
                          onClick={() => {
                            setPurchaseType(1);
                          }}
                        >
                          {t("purchaseModal.title", { day: 90 })}
                        </MenuItem>
                      </MenuList>
                      <MenuButton
                        minW={0}
                        borderRadius="6px"
                        paddingStart="0"
                        paddingEnd="0"
                        border="none"
                        mt="-20px"
                      >
                        {!isOpen ? (
                          <ChevronDownIcon fontSize="22px" />
                        ) : (
                          <ChevronUpIcon fontSize="22px" />
                        )}
                      </MenuButton>
                    </>
                  )}
                </Menu>
              </div>

              <div className="p-5 bg-[#DAE5E5] rounded-[10px]">
                <div className="flex items-center mb-3">
                  <div className="flex items-center w-[270px]">
                    <div className="w-[6px] h-[6px] rounded-[45%] bg-[#000] me-1"></div>
                    <div className="text-[16px] font-bold">
                      {t("purchaseModal.UnlimitedUsage")}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-[6px] h-[6px] rounded-[55%] bg-[#000] me-1"></div>
                    <div className="text-[16px] font-bold whitespace-nowrap">
                      {t("purchaseModal.UnlockAdvancedFeatures")}
                    </div>
                  </div>
                </div>

                <p className="text-[14px] text-[#666666] ml-[10px]">
                  {t("purchaseModal.moreConfirmed")}
                </p>
              </div>

              <div className="px-5 py-3 bg-[#F3F3F3] rounded-[10px] mt-8">
                <div className="flex items-center justify-between mb-2">
                  <div>{t("purchaseModal.UnitPrice")}</div>
                  <div dir="ltr">{purchaseState == 0 ? "10" : "25"} USDT</div>
                </div>
                <div className="flex items-center justify-between text-[16px] font-bold">
                  <div>{t("purchaseModal.TotalPrice")}</div>
                  <div dir="ltr">{spendValue} USDT</div>
                </div>
              </div>
              <Flex className="items-center mt-10 justify-between">
                <div className="flex justify-between me-5" dir="ltr">
                  <div
                    className="h-8 w-8 border-[1px] border-dashed rounded-[50%] flex items-center justify-center text-[24px] cursor-pointer hover:opacity-70"
                    onClick={() =>
                      setPurchaseCardMount(
                        purchaseCardMount == 1 ? 1 : purchaseCardMount - 1
                      )
                    }
                  >
                    -
                  </div>
                  <div className="flex items-center justify-center text-[20px] w-[60px]">
                    {purchaseCardMount}
                  </div>
                  <div
                    className="h-8 w-8 border-[1px] border-dashed rounded-[50%] flex items-center justify-center text-[24px] cursor-pointer hover:opacity-70"
                    onClick={() => setPurchaseCardMount(purchaseCardMount + 1)}
                  >
                    +
                  </div>
                </div>

                <Button
                  colorScheme="teal"
                  size="md"
                  borderRadius="md"
                  isDisabled={!userId || !jwt}
                  onClick={() => {
                    setShowPurchaseModal(false);
                    setShowPurchaseSuccessModal(true);
                  }}
                >
                  Purchase
                </Button>
              </Flex>
            </div>
          </div>
        </div>
      </BaseModal>

      {/* <!--Get More TCC modal---> */}
      <BaseModal
        isOpen={showTccModal}
        onClose={() => {
          setUsdtValue(null);
          setTccValue(null);
          setShowTccModal(false);
        }}
        title={""}
        size="3xl"
      >
        <div>
          {showBack && (
            <div
              className="flex rtl:justify-end ltr:justify-start cursor-pointer"
              onClick={() => {
                setShowPurchaseModal(true);
                setShowTccModal(false);
                setUsdtValue(null);
                setTccValue(null);
              }}
            >
              <Image src={`/images/back.png`} className="me-1" alt="" />
              <div className="text-[16px] font-bold">Back</div>
            </div>
          )}

          <Box className="w-[340px] mx-auto text-center mt-3">
            <Text className="text-[24px] font-bold mb-5">Get More TCC</Text>
            <Text className="text-[#575B66] mb-0">
              {t("purchaseModal.rechargeTCC")}
            </Text>
            {router.pathname !== "/profile" && (
              <Box className="text-[#575B66]">
                {t("purchaseModal.completeTaskEarnTCC")}
                <span
                  className="text-[#357E7F] ml-1 cursor-pointer"
                  onClick={() => {
                    setIsOpenQuest(true);
                    setActiveTab("Earn");
                    setShowTccModal(false);
                    setUsdtValue(null);
                    setTccValue(null);
                  }}
                >
                  {"earn>"}
                </span>
              </Box>
            )}
            <Box mt={8}>
              <Network chainIds={isProduction ? [137, 42161] : [80001, 97]} />
            </Box>

            <Box
              border="solid 1px #C7C9D8"
              mt={4}
              px={4}
              py={3}
              borderRadius="md"
            >
              <VStack alignItems="flex-start" spacing="2px">
                <Flex w="full" justify="space-between" alignItems="center">
                  <Text className="text-left text-[#575B66] text-[16px]">
                    You pay
                  </Text>
                  <HStack>
                    <Image src="/images/usdt.svg" boxSize={5} />
                    <Text fontSize="15px" fontWeight="semibold">
                      USDT
                    </Text>
                  </HStack>
                </Flex>
                <Flex w="full" justify="space-between" alignItems="center">
                  <Input
                  type="number"
                  placeholder="0"
                  border="0"
                  pl={1}
                  value={usdtValue}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // 只允许输入数字和空字符串
                    if (/^\d*$/.test(inputValue)) {
                      setUsdtValue(inputValue);
                      setTccValue(Number(inputValue) * 50);
                    }
                  }}
                  />
                  <Text whiteSpace="nowrap" color="#575B66">
                    Balance: {parseFloat(String(balance)).toFixed(2)}
                  </Text>
                </Flex>
              </VStack>
            </Box>

            <Box
              border="solid 1px #C7C9D8"
              mt={4}
              px={4}
              py={3}
              borderRadius="md"
            >
              <VStack alignItems="flex-start" spacing="2px">
                <Text className="text-left text-[#575B66] text-[16px]">
                  You Receive
                </Text>

                <Flex w="full" justify="space-between" alignItems="center">
                  <Input
                  type="number"
                  placeholder="0"
                  border="0"
                  pl={1}
                  value={tccValue}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // 只允许输入数字和空字符串
                    if (/^\d*$/.test(inputValue)) {
                      setTccValue(inputValue);
                      setUsdtValue(Number(e.target.value) / 50);
                    }
                  }}
                  />
                  <HStack>
                    <Image src="/images/profile/tcc.png" boxSize={5} />
                    <Text fontSize="15px" fontWeight="semibold">
                      TCC
                    </Text>
                  </HStack>
                </Flex>
              </VStack>
            </Box>

            {/* <p className="text-[#575B66] mt-2 mb-5">1 USDT≈50 TCC</p> */}
            <Button
              mt={6}
              colorScheme="teal"
              size="md"
              marginBottom={"40px"}
              borderRadius="md"
              width={"100%"}
              isLoading={loading}
              loadingText="Top Up"
              isDisabled={
              !tccValue ||
              !usdtValue ||
              balance < usdtValue ||
              (isProduction
              ? ![137, 42161].includes(chainId)
              : ![80001, 97].includes(chainId))
              }
              onClick={() => {
                handleTransaction();
                setLoading(true);
              }}
            >
              {(
                isProduction
                ? ![137, 42161].includes(chainId)
                : ![80001, 97].includes(chainId)
              )
              ? "Switch Network"
              : balance < usdtValue
                        ? "Insufficient balance"
                        : t("moreTCC.topUp")}
            </Button>
          </Box>
        </div>
      </BaseModal>

      {/* <!--Purchase NFT modal---> */}
      <BaseModal
        isOpen={showRechargeSuccessModal}
        onClose={() => setShowRechargeSuccessModal(false)}
        title={""}
        size="3xl"
      >
        <div className="text-center">
          <Image
          alt=""
          src={`/images/nft-success.png`}
          className="mx-auto mt-10 mb-5"
          />
          <p className="text-[24px] font-bold mb-5">
            {t("purchaseModal.TransactionSubmitted")}
          </p>
          <p className="text-[#575B66]">
            <span className="text-[#040914] font-bold">{tccValue} TCC</span>{" "}
            {t("purchaseModal.issuedYouAccount")}
          </p>
          <p className="text-[#575B66] mb-10">
            please check it later (about{" "}
            <span className="text-[#000] font-bold">3</span> minutes).
          </p>
          <Button
            colorScheme="teal"
            size="md"
            marginBottom={"40px"}
            borderRadius="md"
            width={"120px"}
            onClick={() => {
              if (showBack) {
                setShowPurchaseModal(true);
              }
              setShowRechargeSuccessModal(false);
            }}
          >
            OK
          </Button>
        </div>
      </BaseModal>

      {/* Confirm Purchase */}
      <BaseModal
        isOpen={showPurchaseSuccessModal}
        closeOnOverlayClick={false}
        onClose={() => setShowPurchaseSuccessModal(false)}
        title={""}
        size="3xl"
        hiddenClose={purchaseLoading}
      >
        {!hash ? (
          <div className="text-center">
            <Box h="25px">
              {!purchaseLoading && (
                <Flex
                  alignItems="center"
                  cursor="pointer"
                  onClick={() => {
                    setShowPurchaseModal(true);
                    setShowPurchaseSuccessModal(false);
                  }}
                >
                  <Image src={`/images/back.png`} className="mr-1" alt="" />
                  <Text>Back</Text>
                </Flex>
              )}
            </Box>

            <Flex justify="center">
              <Image
              className="w-[65px]"
              alt=""
              src={`/images/pass/${
                                                                        purchaseState == 0 ? "30day" : "90day"
                                                                }-un.png`}
              />
            </Flex>
            <Text mt="4" className="text-[24px] font-bold">
              Confirm Purchase
            </Text>
            <Flex alignItems="center" justify="center" mt={2} gap={2} dir="ltr">
              <Text className="font-semibold">
                {purchaseCardMount} x {purchaseState == 0 ? "30" : "90"}-Day
                Pass
              </Text>
              for a total of
              <Text className="font-semibold">{spendValue} USDT</Text>
            </Flex>
            <Box w="320px" mx="auto" mt="30px" mb="10px">
              <Network
              chainIds={isProduction ? [137, 42161] : [80001, 97]}
              showBalance
              />
            </Box>

            <Button
              mt={6}
              colorScheme="teal"
              size="md"
              isLoading={!hash && (purchaseLoading || approving)}
              loadingText={approving ? "Approving..." : "Purchasing..."}
              marginBottom={"40px"}
              borderRadius="md"
              // width={"160px"}
              isDisabled={
              !isEnough || isProduction
              ? ![137, 42161].includes(chainId)
              : ![80001, 97].includes(chainId)
              }
              onClick={allowance < spendValue ? approve : purchaseNft}
            >
              {(
                isProduction
                ? ![137, 42161].includes(chainId)
                : ![80001, 97].includes(chainId)
              )
              ? "Switch Network"
              : !isEnough
              ? "Insufficient balance"
              : allowance < spendValue
                          ? "Approve"
                          : t("checkPassNoCard.Confirm")}
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Image
            alt=""
            src={`/images/nft-success.png`}
            className="mx-auto mt-10 mb-5"
            />
            <p className="text-[24px] font-bold mb-5">Success</p>
            <p className="text-[#575B66]">
              You have successfully purchased{" "}
              <span className="font-semibold">
                {purchaseCardMount} x {purchaseState == 0 ? "30" : "90"}-Day
                Pass
              </span>
            </p>
            <p className="text-[#575B66] mt-1">
              It takes <span className="font-semibold">2~3 minutes</span> to
              synchronize after the transaction is done.
            </p>
            <Flex
              dir="ltr"
              justify="center"
              alignItems="center"
              className="text-[#575B66] mt-1 gap-1"
            >
              <Image src={chainList[chainId].imgUrl} boxSize={4} />
              <Text>Transaction:</Text>
              <Link
                target="_blank"
                href={`${chainList[chainId].browser}/tx/${hash}`}
              >
                <Text color="#007FFF">{toShortAddress(hash, 16)}</Text>
              </Link>
            </Flex>
            <Button
              mt={10}
              colorScheme="teal"
              size="md"
              marginBottom={"40px"}
              borderRadius="md"
              width={"160px"}
              onClick={() => {
                if (router.pathname.includes("explorer")) {
                  setShowPurchaseSuccessModal(false);
                  setInput("/CheckPass");
                  submitMessage({
                    question: "/CheckPass",
                  });
                } else {
                  setShowPurchaseSuccessModal(false);
                }
              }}
            >
              {router.pathname.includes("explorer") ? "Check Holdings" : "Ok"}
            </Button>
          </div>
        )}
      </BaseModal>
    </>
  );
}
