import { Box, Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { BarLoader } from "react-spinners";

const MDPreview = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  {
    ssr: false,
    loading: () => (
      <Flex h="20px" alignItems="center" justify="center">
	<BarLoader color="#0000003d" width="60px" />
      </Flex>
    ),
  }
);

export function Markdown({ value }: { value: string }) {
  return (
    <Box
      width="-webkit-fill-available"
      data-color-mode="light"
      // padding="10px 5px"
    >
      <MDPreview
      source={value || ""}
      className="md-preview"
      linkTarget="_blank"
      />
    </Box>
  );
}
