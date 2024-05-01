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
          <VStack mt="35px" className="px-3">
            <Box
              className="list-none invite-ul flex gap-4"
              flexDirection="column"
              width="100%"
            >
              <Box
                className="w-[100%]"
                display="flex"
              >
                <Box width="40px">
                  <Box w="30px" className="flex items-center justify-center">
                    <div
                      style={{
                        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.12))",
                      }}
                      className="ml-[0px] w-[22px] h-[22px] bg-white rounded-full text-[14px] text-[#000] font-bold flex justify-center items-center flex-shrink-0"
                    >
                      1
                    </div>
                  </Box>
                </Box>
                <Box>
                  <h2 className="text-[16px] text-[#fff] font-bold">
                    {t("referFriends.steps.step1Title")}
                  </h2>
                  <p className="text-[12px] font-normal">
                    Share the link to your friends.
                  </p>
                </Box>
              </Box>

              <Box
                className="w-[100%]"
                display="flex"
              >
                <Box width="40px">
                  <Box w="30px" className="flex items-center justify-center">
                    <div
                      style={{
                        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.12))",
                      }}
                      className="ml-[0px] w-[22px] h-[22px] bg-white rounded-full text-[14px] text-[#000] font-bold flex justify-center items-center flex-shrink-0"
                    >
                      2
                    </div>
                  </Box>
                </Box>
                <Box>
                  <h2 className="text-[16px] text-[#fff] font-bold">
                    Finish tasks
                  </h2>
                  <VStack
                    alignItems="flex-start"
                    className="text-[12px] font-normal"
                    spacing={1}
                  >
                    <Text>1、Follow TypoX on Twitter </Text>
                    <Text>2、Login on TypoX </Text>
                    <Text>3、Share the conversation on Twitter</Text>
                  </VStack>
                </Box>
              </Box>

              <Box
                className="w-[100%]"
                display="flex"
              >
                <Box width="40px">
                  <Box w="30px" className="flex items-center justify-center">
                    <div
                      style={{
                        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.12))",
                      }}
                      className="ml-[0px] w-[22px] h-[22px] bg-white rounded-full text-[14px] text-[#000] font-bold flex justify-center items-center flex-shrink-0"
                    >
                      3
                    </div>
                  </Box>
                </Box>
                <Box>
                  <h2 className="text-[16px] text-[#fff] font-bold">
                    {t("referFriends.steps.step3Title")}
                  </h2>
                  <p className="text-[12px] font-normal">
                    50 points for inviter while 10 for invitee.
                  </p>
                </Box>
              </Box>
            </Box>
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
