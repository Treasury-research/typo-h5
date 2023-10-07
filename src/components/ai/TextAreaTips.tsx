import {
  Box,
  Text,
  Flex,
  VStack,
  Icon,
  Kbd,
  Badge,
  useBoolean,
  HStack,
  InputGroup,
  InputLeftAddon,
  Input,
} from "@chakra-ui/react";
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { VscWordWrap } from "react-icons/vsc";

type CommandTip = {
  [key: string]: {
    label: string;
    text: string;
    left: number;
    tip: string;
  };
};

// const commands: string[] = ["/Profile"];
export const commands: string[] = [
  "/Profile",
  "/ENS",
  "/POAP",
  "/Snapshot",
  "/GoPlus",
  "/Uniswap",
];
const commandsTips: CommandTip = {
  "/Profile": {
    label: "DID",
    text: "Query the Web3 Profile",
    left: 80,
    tip: "my / address / xxx.eth / xxx.bnb / xxx.bit / xxx.lens",
  },
  "/ENS": {
    label: "DID",
    text: "Query the ENS domains",
    left: 70,
    tip: "my / address / xxx.eth / xxx.bnb / xxx.bit / xxx.lens",
  },
  "/POAP": {
    label: "DID",
    text: "Query the POAP events",
    left: 80,
    tip: "my / address / xxx.eth / xxx.bnb / xxx.bit / xxx.lens",
  },
  "/Snapshot": {
    label: "DID",
    text: "Query the Snapshot activies",
    left: 105,
    tip: "my / address / xxx.eth / xxx.bnb / xxx.bit / xxx.lens",
  },
  "/GoPlus": {
    label: "DID",
    text: "Detect risks of token approvals",
    left: 90,
    tip: "my / address / xxx.eth / xxx.bnb / xxx.bit / xxx.lens",
  },
  "/Uniswap": {
    label: "",
    text: "Swap on Uniswap",
    left: 110,
    tip: "",
  },
};

export const TextAreaTips = forwardRef(
  (
    {
      isFocus,
      input,
      isLoading,
      labelValue,
      setInput,
      inputFocus,
      setLabelValue,
      onSend,
    }: {
      isFocus: boolean;
      input: string;
      isLoading: boolean;
      labelValue: string;
      onSend: (isReGenerate?: boolean) => void;
      setLabelValue: (value: string) => void;
      setInput: (value: string) => void;
      inputFocus: () => void;
    },
    ref: any
  ) => {
    const myLabelInput = useRef<any>(null);
    const [tipIndex, setTipIndex] = useState<number>(0);

    const list = useMemo(() => {
      if (!input) {
        return [];
      }

      const listArray = commands.filter((item) =>
        item.toLocaleLowerCase().includes(input.toLocaleLowerCase())
      );

      setTipIndex(0);
      return listArray;
    }, [input]);

    const variableInfo = useMemo(() => {
      const commandsBlank = commands.map((item) => (item = item + " "));
      if (!commandsBlank.includes(input)) {
        return null;
      }

      return commandsTips[input.trim()];
    }, [input]);

    useEffect(() => {
      if (variableInfo?.label) {
        setLabelValue("");
        myLabelInput.current.focus();
      } else {
        inputFocus();
      }
    }, [variableInfo]);

    return (
      <>
        {isFocus && list.length > 0 && (
          <VStack
            justify="space-between"
            pos="absolute"
            bottom="60px"
            left="40px"
            bg="whiteAlpha.900"
            borderRadius={10}
            boxShadow="2px 2px 6px 0px rgba(0, 0, 0, 0.12), -2px -2px 6px 0px rgba(255, 255, 255, 0.90);"
            shadow="md"
            w="60%"
            py={2}
            zIndex={5}
          >
            {list.map((item, index) => {
              return (
                <VStack
                  key={index}
                  alignItems="flex-start"
                  spacing={0}
                  w="full"
                  px={5}
                  py={2}
                  cursor="pointer"
                  bg={tipIndex === index ? "blackAlpha.300" : ""}
                  onClick={() => {
                    setInput(item + " ");
                    setTipIndex(index);
                  }}
                >
                  <HStack
                    fontSize="sm"
                    fontWeight="semibold"
                    justify="flex-start"
                  >
                    <Text>{item}</Text>
                    {commandsTips[item].label && (
                      <Box
                        ml="1"
                        fontSize="xs"
                        fontWeight="semibold"
                        borderRadius={5}
                        px={2}
                        mt="2px"
                        h="18px"
                        lineHeight="18px"
                        bg="gray.800"
                        color="#fff"
                        transform="scale(0.86)"
                      >
                        {commandsTips[item].label}
                      </Box>
                    )}
                  </HStack>
                  <Text fontSize="xs">{commandsTips[item].text}</Text>
                </VStack>
              );
            })}
          </VStack>
        )}

        {variableInfo?.label && (
          <>
            <HStack
              pos="absolute"
              w="full"
              py={1}
              px={1}
              pl={6}
              top="-28px"
              left="-10px"
              zIndex={5}
              borderRadius={6}
              fontSize="xs"
            >
              <Box
                ml="1"
                fontSize="xs"
                fontWeight="semibold"
                borderRadius={5}
                px={2}
                mt="2px"
                h="18px"
                lineHeight="18px"
                bg="gray.800"
                color="#fff"
                transform="scale(0.85)"
              >
                {variableInfo?.label}
              </Box>
              <Text
                whiteSpace="nowrap"
                flex={1}
                overflow="hidden"
                pt="1px"
                textOverflow="ellipsis"
              >
                {variableInfo?.tip}
              </Text>
            </HStack>

            <HStack
              pos="absolute"
              bottom="12px"
              justify="space-between"
              left={`${variableInfo?.left}px`}
              zIndex={6}
            >
              <InputGroup
                size="xs"
                borderWidth="1px"
                borderColor="blackAlpha.900"
                borderRadius={4}
                overflow="hidden"
                color="#fff"
                bg="blackAlpha.600"
                transform="scale(0.8)"
              >
                <InputLeftAddon bg="blackAlpha.900" fontWeight="semibold">
                  {variableInfo?.label}
                </InputLeftAddon>
                <Box
                  display="flex"
                  className="no-scrollbar"
                  contentEditable={"plaintext-only" as any}
                  suppressContentEditableWarning
                  ref={myLabelInput}
                  tabIndex={1}
                  w="auto"
                  h="24px"
                  ml={2}
                  mr={1}
                  minW="30px"
                  maxW="150px"
                  lineHeight="24px"
                  whiteSpace="nowrap"
                  overflowX="hidden"
                  alignItems="center"
                  border={0}
                  outline="none"
                  onKeyDown={(e: any) => {
                    if (!e.shiftKey && labelValue && e.key === "Enter") {
                      e.preventDefault();
                      onSend();
                      return;
                    }

                    if (e.key === "Backspace") {
                      setTimeout(() => {
                        if (!myLabelInput.current?.innerText) {
                          inputFocus();
                          setInput(input.trim());
                          setLabelValue("");
                        }
                      }, 100);
                    }
                  }}
                  onInput={(e: any) => {
                    setLabelValue(e.target.innerText.trim().replace("/n", ""));
                  }}
                />
              </InputGroup>
            </HStack>
          </>
        )}
      </>
    );
  }
);

TextAreaTips.displayName = "TextAreaTips";
