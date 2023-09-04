import {
	Box,
	Flex,
	HStack,
	Text,
	Avatar,
	Icon,
	VStack,
	Link,
	Divider,
	useBoolean,
} from "@chakra-ui/react";
import { Empty } from "components/Empty";
import { toShortAddress } from "lib";
import { BiWallet } from "react-icons/bi";
import moment from "moment";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { BsFillLightningChargeFill } from "react-icons/bs";

const SpaceCard = ({ space }: { space: any }) => {
	const [isHover, setIsHover] = useBoolean(false);
	return (
		<Link target="_blank" href={space?.url}>
			<Box
				bg="bg.white"
				w="180px"
				borderRadius={8}
				px={3}
				py={2}
				onMouseMove={setIsHover.on}
				onMouseLeave={setIsHover.off}
				_hover={{ bg: "whiteAlpha.700", color: "text.link" }}
			>
				<HStack>
					<Avatar
						icon={<BsFillLightningChargeFill />}
						src={space?.spaceAvatar}
						size="sm"
					/>
					<Text
						fontWeight="semibold"
						flex={1}
						whiteSpace="nowrap"
						overflow="hidden"
						textOverflow="ellipsis"
					>
						{space?.spaceName}
					</Text>
					{isHover && <ArrowForwardIcon boxSize={4} color="text.link" />}
				</HStack>

				<Flex
					w="full"
					justify="space-between"
					mt={2}
					whiteSpace="nowrap"
					fontWeight="semibold"
					px="2px"
				>
					<Text>{space?.voteCount ? space?.voteCount + " Votes" : "-"}</Text>
					<Box>
						{space?.proposalCount ? (
							space?.proposalCount + " Proposals"
						) : (
							<Text mr={2}>-</Text>
						)}
					</Box>
				</Flex>
			</Box>
		</Link>
	);
};

const ActivityItem = ({ data }: { data: any }) => {
	const [isHover, setIsHover] = useBoolean(false);
	const [hoverIndex, setHoverIndex] = useState<number | null>(null);

	return (
		<Box
			w="full"
			py={3}
			borderRadius={5}
			className="snapshot-table"
			minW="450px"
			maxW="full"
		>
			<Text px={4} fontSize="sm" fontWeight="semibold">
				Activity
			</Text>
			<Divider mt={2} />
			<VStack
				spacing={1}
				px={2}
				mt={1}
				color="gray.700"
				fontSize="13px"
				maxH="215px"
				overflowY="scroll"
				className="no-scrollbar"
			>
				{data?.map((item: any, index: number) => {
					return (
						<Link w="full" target="_blank" href={item?.url} key={index}>
							<VStack
								w="full"
								px={2}
								pt={2}
								borderRadius={5}
								alignItems="flex-start"
								spacing={0}
								_hover={{ bg: "bg.lightYellow", color: "text.link" }}
								onMouseMove={() => {
									setIsHover.on();
									setHoverIndex(index);
								}}
								onMouseLeave={() => {
									setIsHover.off();
									setHoverIndex(null);
								}}
							>
								<Flex
									justify="space-between"
									w="full"
									fontSize="xs"
									whiteSpace="nowrap"
									color={
										isHover && hoverIndex === index ? "text.link" : "gray.600"
									}
								>
									<Flex>
										{item.type === "vote" ? "Voted" : "Proposed"} in
										<Text
											ml={1}
											fontWeight="semibold"
											whiteSpace="nowrap"
											overflow="hidden"
											textOverflow="ellipsis"
										>
											[{item.spaceId}]
										</Text>
									</Flex>
									<Text>
										{item.created
											? moment(item.created).format("YYYY-MM-DD")
											: "-"}
									</Text>
								</Flex>
								<Flex justify="space-between" w="full" alignItems="center">
									<Text
										fontSize="sm"
										pb={2}
										w="90%"
										whiteSpace="nowrap"
										overflow="hidden"
										textOverflow="ellipsis"
									>
										{item.proposalTitle}
									</Text>
									{isHover && hoverIndex === index && (
										<ArrowForwardIcon boxSize={4} color="text.link" />
									)}
								</Flex>

								<Divider borderBottomWidth="1.4px" />
							</VStack>
						</Link>
					);
				})}
			</VStack>
		</Box>
	);
};

export function Snapshot({ content }: { content: any }) {
	return (
		<Box width="full" padding="5px">
			<VStack
				alignItems="flex-start"
				className="chat-card"
				bg="bg.lightYellow"
				maxW="full"
				w="full"
				borderRadius={6}
				my={3}
				p={4}
			>
				<HStack justify="space-between" color="gray.600">
					{(content?.address || content?.primaryName) && (
						<HStack>
							<Icon as={BiWallet} boxSize={4} />
							<Text>
								{toShortAddress(content?.address || content?.primaryName, 10)}
							</Text>
						</HStack>
					)}
				</HStack>

				<Flex
					w="full"
					overflowX="scroll"
					minW="200px"
					columnGap={3}
					className="no-scrollbar"
				>
					{content?.space &&
						content?.space?.map((item: any, index: number) => {
							return <SpaceCard space={item} key={index} />;
						})}
				</Flex>

				{content?.history?.length > 0 ? (
					<Flex
						w="full"
						bg="bg.white"
						borderRadius={8}
						minW="200px"
						fontSize="13px"
					>
						<ActivityItem data={content?.history} />
					</Flex>
				) : (
					<Flex w="full" overflow="hidden" borderRadius={5}>
						<Empty height="70px" message="No snapshot info" bg="#fff" />
					</Flex>
				)}
			</VStack>
		</Box>
	);
}
