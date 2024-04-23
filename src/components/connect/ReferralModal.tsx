import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Flex,
  ModalOverlay,
  VStack,
  Image,
  InputGroup,
  Input,
  Button,
  InputRightElement,
  useClipboard,
  Box,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useStore } from "store";
import { useUserInfoStore } from "store/userInfoStore";
import { motion as m, AnimatePresence } from "framer-motion";
import useTranslation from "hooks/useTranslation";
import api from "api";
import { toShortAddress } from "lib";

export function ReferralModal() {
  const { openReferralModal, setOpenReferralModal } = useStore();
  const { userId } = useUserInfoStore();
  const { onCopy, value, setValue } = useClipboard("");
  const { showToast } = useStore();
  const { t } = useTranslation();
  const [mine, setMine] = useState<any>({});
  const [list, setList] = useState<any>([]);
  console.log('ReferralModal', openReferralModal)

  const getReffral = async () => {
    const res: any = await api.get(`/api/auth/referral`);
    if (res?.code === 200) {
      setMine(res.data?.mine || {});
      setList(res.data?.list);
    }
  };

  useEffect(() => {
    if (userId) {
      getReffral();
    }
  }, [userId]);

  useEffect(() => {
    setValue(`${location.origin}/explorer?inviteId=${userId}`);
  }, []);

  return (
    <Modal
      onClose={() => setOpenReferralModal(false)}
      isOpen={openReferralModal}
      isCentered
      size="2xl"
    >
      <ModalOverlay />
      <ModalContent
        className="invite-content"
        bg="transparent"
        bgImage="url('/images/invite-bg.png')"
        bgRepeat="no-repeat"
        bgSize="cover"
        pb="20px"
      >
        <ModalCloseButton color="#fff" zIndex={5} />
        <ModalBody
          px="40px"
          color="#fff"
          position="relative"
          className="invite-body"
          pt="20px"
        >
          <VStack align="start" fontSize="32px" fontWeight="bold">
            <HStack className="invite-refer">
              <Text fontSize="26px">{t("referFriends.title")}</Text>
            </HStack>
            <Text className="invite-title text-[#F98E3F] !-mt-[2px] text-[16px]">
              {t("referFriends.des")}
            </Text>
          </VStack>

          <VStack w="full" spacing={2} mt="16px">
            <HStack w="full" fontWeight="semibold">
              <Text w="100px" textAlign="left">
                Rank
              </Text>
              <Text w="25%" textAlign="left">
                Address
              </Text>
              <Text w="25%" textAlign="center">
                Invited
              </Text>
              <Text w="25%" textAlign="right">
                Points
              </Text>
            </HStack>

            {list.map((item: any, index: any) => {
              return (
                <HStack w="full" key={index}>
                  <HStack w="100px" alignItems="center" justify="left" pl={1}>
                    {index === 0 ? (
                      <Image
                        src="/images/rank/rank_1.png"
                        objectFit="contain"
                        boxSize={5}
                      />
                    ) : index === 1 ? (
                      <Image
                        src="/images/rank/rank_2.png"
                        objectFit="contain"
                        boxSize={5}
                      />
                    ) : (
                      <Image
                        src="/images/rank/rank_3.png"
                        objectFit="contain"
                        boxSize={5}
                      />
                    )}
                  </HStack>
                  <Text w="25%" textAlign="left">
                    {toShortAddress(item?.address, 12)}
                  </Text>
                  <Text w="25%" textAlign="center">
                    {item?.invited}
                  </Text>
                  <Text w="25%" textAlign="right">
                    {item?.invite_score}
                  </Text>
                </HStack>
              );
            })}

            <HStack w="full" fontWeight="semibold" pl="10px">
              <Text textAlign="left" transform="rotate(90deg)">
                ...
              </Text>
            </HStack>
            <HStack
              w="full"
              fontWeight="semibold"
              justify="space-between"
              className="blue-filter py-1 px-3 !rounded-[6px]"
            >
              <Box textAlign="left">
                <Text>{toShortAddress(mine?.address, 12)}</Text>
                <Text fontSize="12px">My rank: {mine?.ranking || "--"}</Text>
              </Box>
              <Box textAlign="left">
                <Text>{mine?.invited}</Text>
                <Text fontSize="12px">Invited</Text>
              </Box>
              <Box textAlign="left">
                <Text>{mine?.invited * 50}</Text>
                <Text fontSize="12px">Points</Text>
              </Box>
            </HStack>
          </VStack>
          <VStack mt="35px" className="px-3">
            <HStack w="full" spacing={2} mb={2} justify="flex-start">
              <Box w="30px" ml="20px">
                <div
                  style={{
                    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.12))",
                  }}
                  className="ml-[0px] w-[22px] h-[22px] bg-white rounded-full text-[14px] text-[#000] font-bold flex justify-center items-center flex-shrink-0"
                >
                  1
                </div>
              </Box>
              <Box
                w="28%"
                borderStyle="dashed"
                borderColor="#979797"
                borderTopWidth="1px"
              />
              <Box pl="5px" w="30px">
                <div
                  style={{
                    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.12))",
                  }}
                  className="ml-[0px] w-[22px] h-[22px] bg-white rounded-full text-[14px] text-[#000] font-bold flex justify-center items-center flex-shrink-0"
                >
                  2
                </div>
              </Box>
              <Box
                w="30%"
                borderStyle="dashed"
                borderColor="#979797"
                borderTopWidth="1px"
              />
              <Box w="30px" className="flex items-center ">
                <div
                  style={{
                    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.12))",
                  }}
                  className="ml-[0px] w-[22px] h-[22px] bg-white rounded-full text-[14px] text-[#000] font-bold flex justify-center items-center flex-shrink-0"
                >
                  3
                </div>
              </Box>
            </HStack>
            <ul className="list-none invite-ul flex gap-4">
              <li className="w-[30%]">
                <h2 className="text-[16px] text-[#fff] font-bold">
                  {t("referFriends.steps.step1Title")}
                </h2>
                <p className="text-[12px] font-normal">
                  Share the link to your friends.
                </p>
              </li>
              <li className="w-[40%]">
                <div>
                  <h2 className="text-[16px] text-[#fff] font-bold">
                    Finish tasks
                  </h2>
                  <VStack
                    alignItems="flex-start"
                    className="text-[12px] font-normal"
                    spacing={1}
                  >
                    <Text>Let him: </Text>
                    <Text>1、Follow TypoX on Twitter </Text>
                    <Text>2、Login on TypoX </Text>
                    <Text>3、Share the conversation on Twitter</Text>
                  </VStack>
                </div>
              </li>
              <li className="w-[30%]">
                <h2 className="text-[16px] text-[#fff] font-bold">
                  {t("referFriends.steps.step3Title")}
                </h2>
                <p className="text-[12px] font-normal">
                  50 points for inviter while 10 for invitee.
                </p>
              </li>
            </ul>
          </VStack>

          <InputGroup size="lg" bg="transparent" mt="30px">
            <Input
              paddingY="20px"
              fontSize="14px"
              fontWeight="500"
              paddingRight="140px"
              bg="transparent"
              value={value}
            />
            <InputRightElement width="140px">
              <Button
                mt={2}
                ml={7}
                onClick={() => {
                  onCopy();
                  showToast(t("toast.toast11"), "success");
                }}
                borderRadius="6px"
                bg="#fff"
                h="36px"
                color="#121212"
                filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.12))"
              >
                <span>{t("referFriends.steps.step1Title")}</span>
              </Button>
            </InputRightElement>
          </InputGroup>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
