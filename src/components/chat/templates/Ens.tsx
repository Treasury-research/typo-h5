import {
  Box,
  Flex,
  HStack,
  Text,
  Icon,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { Empty } from "components/Empty";
import { toShortAddress } from "lib";
import { BiWallet } from "react-icons/bi";

const TableItem = ({ title, data }: { title: string; data: [] }) => {
  return (
    <Box w="300px" maxW="full" bg="#fff" py={3} borderRadius={5}>
      <Flex justify="space-between" px={4} fontSize="sm" fontWeight="semibold">
	<Text lineHeight="18px">{title}</Text>
	<HStack ml={5}>
	  <Text fontSize="13px" color="gray.600" pt="2px">
	    Total
	  </Text>
	  <Text>{data?.length || 0}</Text>
	</HStack>
      </Flex>
      <Divider my={2} />

      {data?.length > 0 ? (
	<>
	  <Flex
	    px={4}
	    justify="space-between"
	    fontWeight="semibold"
	    color="gray.700"
	    fontSize="13px"
	  >
	    <Text>Domain</Text>
	    <Text pr={2}>
	      {title === "Recorded domains" ? "Holder" : "Address"}
	    </Text>
	  </Flex>
	  <VStack
	    spacing={0}
	    px={2}
	    mt={1}
	    color="gray.700"
	    fontSize="13px"
	    maxH="170px"
	    className="no-scrollbar"
	    overflowY="scroll"
	  >
	    {data?.map((item: any, index: number) => {
	      return (
		<Flex
		  w="full"
		  px={2}
		  py={2}
		  key={index}
		  borderRadius={5}
		  justify="space-between"
		  _hover={{ bg: "bg.lightYellow" }}
		>
		  <Text>{item.name || item.ens}</Text>
		  <Text pr={2}>{toShortAddress(item?.address, 10)}</Text>
		</Flex>
	      );
	    })}
	  </VStack>
	</>
      ) : (
	<Flex px={3} w="full" mt={1} overflow="hidden">
	  <Empty height="70px" showMessage={false} />
	</Flex>
      )}
    </Box>
  );
};

export function Ens({ content }: { content: any }) {
  return (
    <Box width="-webkit-fill-available" padding="5px">
      <Box
	className="chat-card"
	bg="bg.lightYellow"
	maxW="full"
	w="full"
	borderRadius={6}
	my={3}
	p={4}
      >
	<HStack mb={1} mt="1px" ml={1}>
	  {(content?.address || content?.primaryName) && (
	    <>
	      <Icon as={BiWallet} color="gray.600" boxSize={4} />
	      <Text color="gray.600">
		{toShortAddress(content?.address || content?.primaryName, 12)}
	      </Text>
	    </>
	  )}
	</HStack>
	<Flex w="full" className="ens" gap={3} py={2} justify="flex-start">
	  <TableItem title="Holding domains" data={content.holding_domains} />
	  <TableItem title="Recorded domains" data={content.recorded_domains} />
	</Flex>
      </Box>
    </Box>
  );
}
