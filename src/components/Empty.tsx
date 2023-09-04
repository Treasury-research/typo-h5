import { VStack, Image, Text } from "@chakra-ui/react";

export const Empty = ({
	message,
	height,
	bg,
	showMessage = true,
}: {
	message?: string;
	height?: string | number;
	bg?: string;
	showMessage?: boolean;
}) => {
	return (
		<VStack
			h={height || "90%"}
			w="full"
			justifyContent="center"
			alignItems="center"
			bg={bg}
			spacing={0}
		>
			<Image src="/images/empty.png" opacity={0.4} width="30px" alt="" mt={2}/>
			{showMessage && (
				<Text fontSize="sm" color="blackAlpha.500" pt={1}>
					{message || "No Data"}
				</Text>
			)}
		</VStack>
	);
};
