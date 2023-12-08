import { Box, Container, Image, VStack } from "@chakra-ui/react";
import { NextSeo } from "components";

export default function Home() {
  return (
    <>
      <NextSeo title={"TypoGraphy AI"} />
      <Container
        w="100vw"
        pr={0}
        pl={0}
        overflow="hidden"
        className="no-scrollbar"
      >
        <Box h="full">
          <Image
            className="absolute top-[30px] left-1/2"
            style={{ transform: "translateX(-50%)" }}
            src="./images/logo.svg"
            alt=""
          />
          <VStack
            justifyContent="center"
            h="full"
            background="url('./images/jiguang.png') no-repeat center fixed"
            backgroundSize="cover"
          >
            <div className="w-10/12 blur-[10px] rounded-l bg-[rgba(255,255,255,0.3)] p-7 font-medium">
              <br />
              <p className="mt-10">
                We encourage all users to take advantage of the benefits of
                accessing the web on a computer rather than a mobile device
              </p>
              <br />
              <p>
                by accessing the web through a desktop or laptop computer, you
                will have a more seamless and efficient experience
              </p>
              <br />
              <p className="text-right font-medium">KNN3 Team</p>
            </div>
          </VStack>
        </Box>
      </Container>
    </>
  );
}
