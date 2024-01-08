import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  Text,
  Image,
  AvatarGroup,
  Avatar,
  Icon,
  Center,
  useBoolean,
} from "@chakra-ui/react";
import { toShortAddress } from "lib";
import { BiWallet } from "react-icons/bi";
import { SlBadge } from "react-icons/sl";

const colors: { [key: string]: string } = {
  A: "#8B5CF6",
  "A+": "#8B5CF6",
  B: "#0027FF",
  "B+": "#0027FF",
  C: "#00FFD0",
  "C+": "#00FFD0",
  D: "#B3B3B3",
  "D+": "#B3B3B3",
  S: "#FFD000",
  "S+": "#FFD000",
  SS: "#FF4E31",
};

function SmallCard({
  title,
  value,
  children,
  level,
  onClick,
}: {
  title: string;
  value: string;
  level?: string;
  children?: React.ReactElement | React.ReactElement[];
  onClick?: () => void;
}) {
  const [isHover, setIsHover] = useBoolean(false);
  return (
    <Box
      bg="bg.white"
      minW="100px"
      borderRadius={8}
      px={3}
      py={2}
      onMouseMove={setIsHover.on}
      onMouseLeave={setIsHover.off}
      _hover={{ bg: "whiteAlpha.700", color: onClick ? "text.link" : "" }}
      onClick={onClick}
    >
      <HStack w="full" justify="space-between">
	<Text
	  fontSize="xs"
	  color={onClick && isHover ? "text.link" : "gray.600"}
	>
	  {title}
	</Text>
	{isHover && title !== "LENS" && onClick && (
	  <ArrowForwardIcon boxSize={4} />
	)}
      </HStack>

      <HStack pos="relative" pr={level ? "50px" : "0"}>
	<Text
	  fontSize="md"
	  mt={1}
	  mr={1}
	  fontWeight="semibold"
	  maxW="180px"
	  whiteSpace="nowrap"
	  overflow="hidden"
	  textOverflow="ellipsis"
	>
	  {value || "NAN"}
	</Text>
	{level && (
	  <Center
	    pos="absolute"
	    right={0}
	    w="45px"
	    h="45px"
	    borderRadius="full"
	    borderWidth="3px"
	    borderColor={isHover ? "text.link" : colors[level]}
	    color={isHover ? "text.link" : colors[level]}
	    fontFamily="Robtronika"
	    fontSize="sm"
	  >
	    {level}
	  </Center>
	)}
      </HStack>

      <Flex
	w="full"
	mt={1}
	fontSize="sm"
	color={isHover ? "text.link" : "gray.600"}
      >
	{children}
      </Flex>
    </Box>
  );
}

export function Profile({
  content,
  setInput,
  onSend,
}: {
  content: any;
  setInput: (value: string) => void;
  onSend: (isReGenerate?: boolean) => void;
}) {
  return (
    <Box width="-webkit-fill-available" padding="5px">
      <Text>Sure, here is the Web3 profile</Text>
      <Box
	className="chat-card"
	bg="bg.lightYellow"
	maxW="full"
	borderRadius={6}
	my={3}
	p={4}
      >
	<HStack mb={1} mt="1px" ml={1}>
	  {(content?.address || content?.addr) && (
	    <>
	      <Icon as={BiWallet} color="gray.600" boxSize={4} />
	      <Text color="gray.600">
		{toShortAddress(content?.address || content?.addr, 10)}
	      </Text>
	    </>
	  )}

	  {content.isBABT && (
	    <Flex alignItems="center" ml={1}>
	      <Image src="/images/aisql/bab.svg" boxSize={5} />
	      <Text fontWeight="semibold" color="black" ml={1}>
		BAB
	      </Text>
	    </Flex>
	  )}
	</HStack>
	<Flex flexFlow="row wrap" gap={3} py={2} justify="flex-start">
	  <SmallCard
	  title="ENS"
	  value={content?.ens}
	  onClick={() => {
	    setInput(`/Ens ${content?.address || content?.addr}`);
	    onSend();
	  }}
	  />
	  <SmallCard title="Space ID" value={content?.spaceId} />
	  <SmallCard title=".bit" value={content?.bit} />
	</Flex>

	<Flex flexFlow="row wrap" gap={3} py={1} justify="flex-start">
	  <SmallCard
	    title="POAP"
	    value={content?.poapCount || "0"}
	    onClick={() => {
	      setInput(`/Poap ${content?.address || content?.addr}`);
	      onSend();
	    }}
	  >
	    <AvatarGroup size="sm" max={2}>
	      {(content.poapImages || []).map((img: string, index: number) => {
		return <Avatar icon={<SlBadge />} key={index} src={img} />;
	      })}
	    </AvatarGroup>
	  </SmallCard>
	  <SmallCard
	    title="Snapshot"
	    value={(content?.spaceCount || "0") + " Spaces"}
	    onClick={() => {
	      setInput(`/Snapshot ${content?.address || content?.addr}`);
	      onSend();
	    }}
	  >
	    <HStack h="32px" w="full" justify="space-between">
	      <Text>{content?.voteCount || 0} Votes</Text>
	      <Text>{content?.proposalCount || 0} Proposals</Text>
	    </HStack>
	  </SmallCard>
	  <SmallCard
	    title="LENS"
	    value={content?.lensHandle}
	    level={content?.lensLevel}
	    onClick={() => {
	      const lens = content?.lensHandle.replace(".lens", "");
	      window.open(`https://topscore.social/profile/${lens}`);
	    }}
	  >
	    <HStack h="32px">
	      <Text>Rank #{content?.lensRank || "NAN"}</Text>
	    </HStack>
	  </SmallCard>
	</Flex>
      </Box>
    </Box>
  );
}
