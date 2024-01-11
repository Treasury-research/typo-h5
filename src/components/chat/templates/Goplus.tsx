import {
  Box,
  Flex,
  HStack,
  Text,
  Avatar,
  Icon,
  Button,
  VStack,
  Link,
  Image,
  Center,
  useToast
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  WarningTwoIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import { toShortAddress } from "lib";
import { useUserInfoStore } from "store/userInfoStore";
import { ActionSheet } from "react-vant";
import { useEffect, useMemo, useState } from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { useStore } from "store";
import useChatContext from "hooks/useChatContext";

const moke = {
  address: "0xdc7aba9bcf799e254313053246c563c6a2382fe4",
  approvals: 7,
  assests: [
    {
      malicious_address: 1,
      token_address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      token_symbol: "BUSD",
      malicious_behavior: ["123"],
      token_name: "BUSD Token",
    },
  ],
  error_approvals: {
    count: 3,
    list: [
      {
        token_address: "0xfa40d8fc324bcdd6bbae0e086de886c571c225d4",
        token_symbol: "WZRD",
        token_name: "Wizardia Token",
        approval_list: [
          {
            approved_contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB00",
            approved_amount: "750000",
          },
        ],
      },
      {
        token_address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
        token_symbol: "ETH",
        token_name: "Ethereum Token",
        approval_list: [
          {
            approved_contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            approved_amount: "Unlimited",
          },
          {
            approved_contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            approved_amount: "Unlimited",
          },
        ],
      },
    ],
  },
};

export function Goplus({
  content,
}: any) {
  const { submitMessage } = useChatContext()
  const { account } = useUserInfoStore();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const showToast = useToast();

  // content = moke;

  const list = useMemo(() => {
    content?.error_approvals?.list?.map((item: any) => {
      item.name = item.token_symbol;
    });
    return content?.error_approvals?.list || [];
  }, [content]);

  const { config } = usePrepareContractWrite({
    address: contractAddress as any,
    abi: [
      {
        constant: false,
        inputs: [
          { name: "_spender", type: "address" },
          { name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "approve",
    args: [account, BigInt(0)],
  });

  const { writeAsync, isSuccess, error, isError } = useContractWrite(config);

  useEffect(() => {
    if (isError) {
      showToast({
        position: 'top',
        title: error?.message as string,
        variant: 'subtle',
        status: 'warning'
      })
    }
  }, [error, isError]);

  useEffect(() => {
    if (isSuccess) {
      showToast({
        position: 'top',
        title: 'Approve Success',
        variant: 'subtle',
      })
    }
  }, [isSuccess]);

  return (
    <Box width="-webkit-fill-available" padding="5px">
      <VStack maxW="full" w="full" borderRadius={6} my={3} p={0} spacing={1}>
        <HStack ml={1} w="full" justify="space-between" color="gray.600">
          <Text fontWeight="semibold" whiteSpace="nowrap" fontSize="xs">
            Security Detection:
          </Text>
          {(content?.address || content?.primaryName) && (
            <Text>
              {toShortAddress(content?.address || content?.primaryName, 8)}
            </Text>
          )}
        </HStack>
        <Box bg="#F2F2F2" w="full" py="8px" px={3} borderRadius={8}>
          <HStack fontSize="13px" fontWeight="semibold" ml="2px">
            {content?.assests?.length > 0 ? (
              <Center bg="red" p="3px" borderRadius={3}>
                <Icon as={WarningTwoIcon} color="#fff" boxSize={3} />
              </Center>
            ) : (
              <Center bg="green" p="3px" borderRadius={3}>
                <Icon as={CheckCircleIcon} color="#fff" boxSize={3} />
              </Center>
            )}
            <Text>{content?.assests?.length || 0} Risk Assets</Text>
          </HStack>
          <Box
            w="full"
            overflowY="scroll"
            className="no-scrollbar"
            fontSize="12px"
          >
            {content?.assests && content?.assests.length > 0 && (
              <VStack w="full" bg="#fff" borderRadius={5} mt={2} spacing={0}>
                {content?.assests?.map((item: any, index: number) => {
                  return (
                    <Flex
                      key={index}
                      w="full"
                      h="40px"
                      justify="space-between"
                      p={2}
                      fontSize="13px"
                    >
                      <HStack spacing={0} whiteSpace="nowrap">
                        <Image
                          src={`https://relayer.gopocket.finance/api/v1/getImage/1/${item.token_address}`}
                          boxSize={6}
                          mr={-1}
                        />
                        <Box lineHeight="16px" transform="scale(0.7)">
                          <Text fontWeight="semibold">{item.token_symbol}</Text>
                          <Text color="gray.500" fontSize="xs">
                            {item.token_name}
                          </Text>
                        </Box>
                      </HStack>
                      <Text transform="scale(0.8)" mr={-2} whiteSpace="nowrap">
                        {item?.malicious_behavior?.length} Malicious Behaviors
                      </Text>
                    </Flex>
                  );
                })}
              </VStack>
            )}
          </Box>
        </Box>

        <Box bg="#F2F2F2" w="full" py="8px" px={3} borderRadius={8}>
          <HStack fontSize="13px" fontWeight="semibold" ml="2px">
            {list?.length > 0 ? (
              <Center bg="red" p="3px" borderRadius={3}>
                <Icon as={WarningTwoIcon} color="#fff" boxSize={3} />
              </Center>
            ) : (
              <Center bg="green" p="3px" borderRadius={3}>
                <Icon as={CheckCircleIcon} color="#fff" boxSize={3} />
              </Center>
            )}
            <Text>
              {content?.error_approvals?.list?.length || 0} Risk Approvals
            </Text>
          </HStack>

          {list && list.length > 0 && (
            <VStack bg="#fff" p={2} borderRadius={5} mt={2} spacing={0}>
              <HStack
                w="full"
                pl="2px"
                mb={1}
                spacing={0}
                justify="space-between"
                whiteSpace="nowrap"
                onClick={() => setVisible(true)}
              >
                <HStack spacing={0}>
                  <Image
                    src={`https://relayer.gopocket.finance/api/v1/getImage/1/${list[index]?.token_address}`}
                    boxSize={6}
                    mr={-1}
                    alt=""
                  />
                  <Box lineHeight="16px" transform="scale(0.7)" mr={-1}>
                    <Text fontWeight="semibold">
                      {list[index]?.token_symbol}
                    </Text>
                    <Text
                      color="gray.500"
                      fontSize="xs"
                      maxW="80px"
                      textOverflow="ellipsis"
                      overflow="hidden"
                    >
                      {list[index]?.token_name}
                    </Text>
                  </Box>
                  <Center
                    p="2px"
                    borderRadius="full"
                    shadow="md"
                    borderColor="blackAlpha.200"
                    borderWidth="1px"
                  >
                    <Icon as={ChevronDownIcon} boxSize={4} />
                  </Center>
                  <ActionSheet
                    visible={visible}
                    actions={list}
                    cancelText="Cancel"
                    closeOnClickAction={true}
                    onSelect={(a, i) => setIndex(i)}
                    onCancel={() => setVisible(false)}
                  />
                </HStack>
                <Text fontSize="xs" transform="scale(0.6)" pl="18px">
                  {list[index]?.approval_list?.length} Risk Approvals
                </Text>
              </HStack>

              <VStack
                w="full"
                bg="#F2F2F2"
                borderRadius={8}
                maxH="240px"
                py={1}
                overflowY="scroll"
                className="no-scrollbar"
                fontSize="12px"
                spacing={0}
              >
                <HStack
                  w="110%"
                  justify="space-between"
                  alignItems="center"
                  whiteSpace="nowrap"
                  transform="scale(0.85)"
                  spacing={2}
                >
                  <Text w="80px">Risk Contract</Text>
                  <Text>Allowance</Text>
                  <Flex w="80px" justify="center">
                    <Text pl={2}>Action</Text>
                  </Flex>
                </HStack>
                {list[index]?.approval_list?.map((item: any, index: number) => {
                  return (
                    <HStack
                      w="110%"
                      key={index}
                      justify="space-between"
                      alignItems="center"
                      py="1px"
                      whiteSpace="nowrap"
                      fontWeight="semibold"
                      spacing={2}
                      transform="scale(0.85)"
                    >
                      <Text w="80px">
                        {toShortAddress(item.approved_contract, 8)}
                      </Text>
                      <Text>{item.approved_amount}</Text>

                      <Flex w="80px" justify="center">
                        {content.address.toLocaleLowerCase() ===
                          account.toLocaleLowerCase() ? (
                            <Button
                              colorScheme="red"
                              borderRadius={3}
                              size="xs"
                              onClick={() => {
                                setContractAddress(item.approved_contract);
                                setTimeout(() => {
                                  writeAsync?.();
                                }, 300);
                              }}
                            >
                              Revoke
                            </Button>
                          ) : (
                            <Button
                              variant="bluePrimary"
                              size="xs"
                              onClick={() => {
                                submitMessage({
                                  question: `/AddressRisk my`
                                });
                              }}
                            >
                              Check Mine
                            </Button>
                        )}
                      </Flex>
                    </HStack>
                  );
                })}
              </VStack>
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
