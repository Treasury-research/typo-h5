import {
	Icon,
	Text,
	Flex,
	VStack,
	Image,
	Center,
	Box,
	Badge,
} from "@chakra-ui/react";
import { BsCommand } from "react-icons/bs";

import { Carousel } from "react-responsive-carousel";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useMemo } from "react";

import "react-responsive-carousel/lib/styles/carousel.min.css";

const commands = [
	[
		"What's KNN3 Network?",
		"What's TypoGraphy AI?",
		// "How is ChatGpt different from TypoGraph ai?",
	],
	["What can I do with TypoGraphy AI now?", "/Profile my"],
];

const sandBoxCommands = [
	[
		"I'm interested in AI and Web3 development.",
		"Suggest DeFi related events for me.",
	],
	["I'm looking to meet new GameFi friends. ", "I want to do some exercise."],
];

const slides = [
	{
		url: "/images/aisql/guide4.webp",
		link: "https://knexus.xyz/create?utm_source=typo+quest&utm_campaign=kn+mbti",
	},
	{
		url: "/images/aisql/guide1.webp",
		link: "",
	},
	{
		url: "/images/aisql/guide2.webp",
		link: "",
	},
	{
		url: "/images/aisql/guide3.webp",
		link: "",
	},
];

const sandboxSlides = [
	{
		url: "/images/aisql/token2049.png",
		link: "",
	},
	{
		url: "/images/aisql/token1.png",
		link: "",
	},
	{
		url: "/images/aisql/token2.png",
		link: "",
	},
	{
		url: "/images/aisql/token3.png",
		link: "",
	},
];

export function Guide({
	onSend,
	setInput,
	isSandBox,
}: {
	isSandBox: boolean;
	onSend: (isReGenerate?: boolean) => void;
	setInput: (value: string) => void;
}) {
	const list = useMemo(() => {
		return isSandBox ? sandboxSlides : slides;
	}, [isSandBox]);

	const cmds = useMemo(() => {
		return isSandBox ? sandBoxCommands : commands;
	}, [isSandBox]);

	return (
		<VStack
			w="full"
			h="full"
			justify="flex-start"
			alignItems="center"
			pt="20px"
		>
			<Box className="carousel-panel" w="full">
				<Carousel
					autoPlay
					showStatus={false}
					showArrows={false}
					showIndicators={true}
					showThumbs={true}
					infiniteLoop
				>
					{list.map((item) => {
						return (
							<Box
								h="full"
								px="4px"
								cursor="pointer"
								key={item.url}
								onClick={() => item.link && window.open(item.link)}
							>
								<Image h="full" alt="" src={item.url} borderRadius={10} />
							</Box>
						);
					})}
				</Carousel>
			</Box>

			<Flex w="full" justify="center" flexFlow="row wrap" gap={4} mt="50px!">
				{cmds.map((item, index) => {
					return (
						<VStack w="320px" key={index} justify="center" spacing={2}>
							{item.map((text) => {
								return (
									<Box
										w="full"
										key={text}
										p={1}
										id={isSandBox && index === 0 ? "commands" : ""}
									>
										<Flex
											w="full"
											pos="relative"
											justify="flex-start"
											alignItems="center"
											cursor="pointer"
											bg="bg.white"
											mt="3px"
											px={3}
											color="blackAlpha.800"
											_hover={{ color: "text.black", transform: "scale(1.01)" }}
											borderRadius={6}
											fontSize="13px"
											onClick={() => {
												setInput(text);
												onSend();
											}}
										>
											{isSandBox && (
												<Badge
													pos="absolute"
													right="-16px"
													top="-9px"
													colorScheme="green"
													fontSize="xs"
													transform="scale(0.76)"
												>
													token2049
												</Badge>
											)}
											<Icon as={BsCommand} />
											<Text
												maxW="full"
												borderRadius={4}
												p="10px"
												whiteSpace="nowrap"
											>
												{text}
											</Text>
										</Flex>
									</Box>
								);
							})}
						</VStack>
					);
				})}
			</Flex>
		</VStack>
	);
}
