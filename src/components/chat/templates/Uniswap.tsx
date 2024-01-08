import { Box, Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { BarLoader } from "react-spinners";

import "@uniswap/widgets/fonts.css";

const Uni = dynamic(
  () =>
    import("@uniswap/widgets").then((mod) => {
      return mod.SwapWidget;
    }),
  {
    ssr: false,
    loading: () => (
      <Flex
        w="360px"
        h="300px"
        background="hsl(0, 0%, 100%)"
        border="1px solid hsla(225, 18%, 44%, 0.24)"
        borderRadius="1rem"
        boxShadow="0px 40px 120px 0px hsla(328, 97%, 53%, 0.12)"
        alignItems="center"
        justify="center"
      >
        <BarLoader color="#0000003d" width="80px" />
      </Flex>
    ),
  }
);

export function Uniswap({ content }: { content: any }) {
  return (
    <Box width="full">
      <Uni width={340}/>
    </Box>
  );
}
