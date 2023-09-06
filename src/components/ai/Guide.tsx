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
import { Cell, Typography, Space } from "react-vant";

import "react-responsive-carousel/lib/styles/carousel.min.css";

const commands = [
	"What's KNN3 Network?",
	"What's TypoGraphy AI?",
	"What can I do with TypoGraphy AI now?",
	"/Profile my",
	// "How is ChatGpt different from TypoGraph ai?",
];

const sandBoxCommands = [
	"I'm interested in AI and Web3 development.",
	"Suggest DeFi related events for me.",
	"I'm looking to meet new GameFi friends. ",
	"I want to do some exercise.",
];

const slides = [
	{
		url: "/images/aisql/guide4.png",
		link: "https://knexus.xyz/create?utm_source=typo+quest&utm_campaign=kn+mbti",
	},
	{
		url: "/images/aisql/guide1.png",
		link: "",
	},
	{
		url: "/images/aisql/guide2.png",
		link: "",
	},
	{
		url: "/images/aisql/guide3.png",
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
			pt="30px"
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
								cursor="pointer"
								key={item.url}
								onClick={() => item.link && window.open(item.link)}
							>
								<Image h="full" alt="" src={item.url} />
							</Box>
						);
					})}
				</Carousel>
			</Box>

			<VStack w="full" justify="center" flexDir="column" spacing={5} mt="30px!">
				{/* <Text fontWeight="semibold" w="full" fontSize="lg" pl={3}>
					Shortcut command
				</Text> */}
				{cmds.map((text, index) => {
					return (
						<Box key={index} w="full" pos="relative">
							{isSandBox && (
								<Badge
									pos="absolute"
									right="-5px"
									top="-12px"
									colorScheme="green"
									fontSize="xs"
									transform="scale(0.76)"
									zIndex={5}
								>
									token2049
								</Badge>
							)}
							<Cell
								title={text}
								icon={<BsCommand />}
								size="large"
								isLink
								onClick={() => {
									setInput(text);
									onSend();
								}}
							/>
						</Box>
					);
				})}
			</VStack>
		</VStack>
	);
}
