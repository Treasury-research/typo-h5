import {
	Box,
	Flex,
	HStack,
	Text,
	Avatar,
	Icon,
	VStack,
	Link,
} from "@chakra-ui/react";
import { Empty } from "components/Empty";
import { toShortAddress } from "lib";
import { BiWallet } from "react-icons/bi";
import { SlBadge } from "react-icons/sl";

const Item = ({ data }: { data: any }) => {
	return (
		<Link target="_blank" href={data?.url}>
			<VStack bg="#fff" spacing={1} pos="relative">
				<Avatar icon={<SlBadge />} src={data?.imageUrl} size="md" />
				<Text
					w="48px"
					overflow="hidden"
					whiteSpace="nowrap"
					textOverflow="ellipsis"
				>
					{data?.name}
				</Text>
			</VStack>
		</Link>
	);
};

export function Poap({ content }: { content: any }) {
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
				<HStack ml={1} justify="space-between" color="gray.600">
					{(content?.address || content?.primaryName) && (
						<HStack>
							<Icon as={BiWallet} boxSize={4} />
							<Text>
								{toShortAddress(content?.address || content?.primaryName, 10)}
							</Text>
						</HStack>
					)}
					<HStack pr={1} fontWeight="semibold">
						<Text>Events</Text>
						<Text color="blackAlpha.800">{content?.length || 0}</Text>
					</HStack>
				</HStack>
				<Flex
					w="full"
					className="poap no-scrollbar"
					mt={3}
					bg="#fff"
					rowGap={7}
					columnGap={6}
					p={5}
					justify="flex-start"
					flexFlow="row wrap"
					borderRadius={10}
					maxH="230px"
					minW="200px"
					color="gray.700"
					fontSize="13px"
					overflowY="scroll"
				>
					{content?.poaps &&
						content?.poaps?.map((item: any, index: number) => {
							return <Item data={item} key={index} />;
						})}

					{content?.poaps && content?.poaps?.length === 0 && (
						<Flex px={3} w="full" mt={1} overflow="hidden">
							<Empty height="70px" message="No poap info" />
						</Flex>
					)}
				</Flex>
			</Box>
		</Box>
	);
}
