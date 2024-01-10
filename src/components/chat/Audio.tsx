import {
  Flex,
  Icon,
  Box,
  Portal,
  Center,
  HStack,
  Text,
  CloseButton,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { AiFillAudio } from "react-icons/ai";
import { useStore } from "store";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useChatContext from "hooks/useChatContext";

export function Audio({
  boxSize,
  color,
}: any) {
  const { input, setInput } = useChatContext()
  const { showToast } = useStore();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // console.log("transcript", SpeechRecognition.getRecognition(), transcript);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      showToast("Your browser is not supported!", "warning");
    }
  }, []);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript, listening]);

  return (
    <Flex h="full" alignItems="flex-end" pb="2px">
      <Center
	className="audio"
	borderRadius="full"
	shadow="md"
	onClick={
	listening
	? () => SpeechRecognition.stopListening()
	      : () => {
		setInput("");
		SpeechRecognition.startListening({ language: "en-US" });
	      }
	}
      >
	<Icon
	as={AiFillAudio}
	cursor="pointer"
	boxSize={boxSize}
	color={"gray.500"}
	_hover={{ color: color }}
	/>
      </Center>

      <Portal>
	<Center
	  pos="absolute"
	  w="full"
	  h={listening ? "90px" : "0"}
	  borderTopWidth="1px"
	  borderColor="gray.100"
	  boxShadow="md"
	  left={0}
	  right={0}
	  bottom={0}
	  bgImage="linear-gradient(90deg,#f9fdff,#fdfaff);"
	  transition="bottom .16s ease-in-out"
	  opacity={0.98}
	  overflow="hidden"
	>
	  <CloseButton
	  pos="absolute"
	  right="5px"
	  top="5px"
	    size="sm"
	  color="gray.500"
	  onClick={() => SpeechRecognition.stopListening()}
	  />
	  <HStack w="full" h="full">
	    <Box className="voice-popup-ball">
	      <Box className="voice-popup-ball-div voice-popup-ball-bg" />
	      <Box className="voice-popup-ball-div maxSize-140" />
	      <Box className="voice-popup-ball-div maxSize-115" />
	      <Box className="voice-popup-ball-div maxSize-90" />

	      <Icon
	      as={AiFillAudio}
	      boxSize={5}
	      className="voice-popup-ball-div"
	      color="bg.green"
	      />
	    </Box>
	    <Text
	      flex={1}
	      fontWeight="semibold"
	      fontSize="md"
	      color="gray.500"
	      ml="-20px"
	      lineHeight="22px"
	    >
	      {input ? input : "I'm listening,  speak your question..."}
	    </Text>
	  </HStack>
	</Center>
      </Portal>
    </Flex>
  );
}
