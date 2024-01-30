import { Flex, Image, Box } from "@chakra-ui/react";
import { useQuoteStore } from "store/quoteStore";
import CancelIcon from "components/icons/Cancel";

export function QuoteTem({
	content,
	type,
	showDeleteIcon,
}: {
	content: string;
	type: string;
	showDeleteIcon: boolean;
}) {
	const { setIsShowInputQuote, setQuoteContent, setQuoteType } =
		useQuoteStore();
	console.log("showDeleteIcon", showDeleteIcon);
	const getQuote = () => {
		if (content) {
			let str = content.replace(
				/<span class="click-item-1 underline text-blue-600">|<\/span>/g,
				""
			);
			str = str.replace(
				/<span class="click-item-2 underline text-blue-600">|<\/span>/g,
				""
			);
			str = str.replace(/<span class="click-item-1">|<\/span>/g, "");
			str = str.replace(/<span class="click-item-2">|<\/span>/g, "");
			return str.slice(0, 34);
		} else {
			return "";
		}
	};

	return (
		<>
			<Box
				fontSize="14px"
				className="w-[fit-content] bg-[#EDF2F2] p-2 pl-2 pr-10 text-[#487C7E] relative rounded-[8px]"
				position="relative"
			>
				<Box mb="7px">{content ? `${getQuote()}...` : "--"}</Box>
				<Flex fontSize="12px" className="items-center">
					<Image w="14px" h="14px" mr="2" src="/images/typo-small.png" alt="" />
					<Box>{type}</Box>
				</Flex>
				{showDeleteIcon && (
					<Box
						position="absolute"
						right="2px"
						top="2px"
						onClick={() => {
							setIsShowInputQuote(false);
							setQuoteContent("");
							setQuoteType("");
						}}
					>
						<CancelIcon/>
					</Box>
				)}
			</Box>
		</>
	);
}
