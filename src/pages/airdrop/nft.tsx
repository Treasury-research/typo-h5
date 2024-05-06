import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import ChatProvider from "components/chat/Context";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { Box, Image, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import { Header } from "components/airdrop/Header";
import Info1Icon from "components/icons/NFT/Info1";
import Info2Icon from "components/icons/NFT/Info2";
import Info3Icon from "components/icons/NFT/Info3";
import Info4Icon from "components/icons/NFT/Info4";
import Info5Icon from "components/icons/NFT/Info5";
import Info6Icon from "components/icons/NFT/Info6";
import Info7Icon from "components/icons/NFT/Info7";
import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';

export default function Home() {
  const router = useRouter();
  const [showPage1, setShowPage1] = useState(false)
  const [showPage2, setShowPage2] = useState(false)

  const onSlideChange = useCallback((swiper: any) => {
    if (swiper.activeIndex === 1) {
      setShowPage1(true)
    } else if (swiper.activeIndex === 2) {
      setShowPage2(true)
    }
  }, [])

  return (
    <>
      <NextSeo title={"TypoX AI"} />
      <Header />
      <VStack w="100vw" h="100vh" bg="#000">
        <Box
          className="no-scrollbar relative overflow-auto"
          h="100vh"
          w="100vw"
        >
          <Swiper
            // onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={onSlideChange}
            direction="vertical"
            style={{
              height: '100%'
            }}
          >
            <SwiperSlide>
              <VStack
                w="full"
                // h="100vh"
                minHeight="100vh"
                position="relative"
                color="#fff"
                paddingTop="92px"
              >
                <Box
                  position="absolute"
                  top="96px"
                  left="0"
                  opacity="0.3"
                  background="#FC62FF"
                  width="240px"
                  height="40px"
                />
                <Box
                  position="absolute"
                  bottom="0"
                  width="100%"
                  opacity="0.3"
                >
                  <Box
                    width="0px"
                    height="0px"
                    borderStyle="solid"
                    borderWidth={`0 100vw 100px 0px`}
                    borderColor="transparent transparent #6268FF transparent"
                    transform="rotate(0deg)"
                  />
                  <Box
                    width="100%"
                    height="20px"
                    background="#6268FF"
                  />
                </Box>
                <Box
                  width="100%"
                  padding="20px"
                  fontFamily="JetBrainsMonoBold"
                >
                  <Box fontSize="32px">TYPOX AI</Box>
                  <Box fontSize="24px">DYOR NFT</Box>
                </Box>
                <Box
                  width="100%"
                  padding="0 20px"
                >
                  <Box
                    width="106px"
                    height="32px"
                    background="linear-gradient(92deg, #FF56F6 21.43%, #B936EE 50.63%, #3BACE2 100%, #406AFF 117.04%)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="16px"
                    borderRadius="24px"
                    fontFamily="JetBrainsMono"
                  >
                    Mint
                  </Box>
                </Box>
                <Box
                  zIndex="1"
                  height="calc(100vh - 400px)"
                  display="flex"
                  alignItems="center"
                  padding="20px"
                  justifyContent="center"
                >
                  <Image
                    height="100%"
                    src="/images/genesis_nft.png"
                  />
                </Box>
                <Box
                  width="100%"
                  padding="0 20px"
                  display="flex"
                  flexWrap="wrap"
                  zIndex="1"
                  marginBottom="20px"
                  marginTop="auto"
                >
                  <Box
                    fontFamily="JetBrainsMono"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    width="50%"
                  >
                    <Box fontSize="12px" marginRight="12px">SUPPLY</Box>
                    <Box
                      fontSize="16px"
                      background="linear-gradient(92deg, #FF56F6 21.43%, #B936EE 50.63%, #3BACE2 100%, #406AFF 117.04%)"
                      backgroundClip="text"
                      sx={{
                        "-webkit-background-clip": "text",
                        "-webkit-text-fill-color": "transparent"
                      }}
                    >
                      1024
                    </Box>
                  </Box>
                  <Box
                    fontFamily="JetBrainsMono"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    width="50%"
                  >
                    <Box fontSize="12px" marginRight="12px">NETWORK</Box>
                    <Box
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="49" height="12" viewBox="0 0 49 12" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.9607 6C12.9607 9.3137 10.0543 12 6.46906 12C3.06759 12 0.277134 9.58204 0 6.50435H8.5805V5.49564H0C0.277134 2.41795 3.06759 0 6.46906 0C10.0543 0 12.9607 2.68629 12.9607 6ZM37.0279 10.9129C39.2773 10.9129 40.7525 9.79049 40.7525 8.10002C40.7525 6.53125 39.6424 5.78745 37.9626 5.5305L36.4727 5.30058C35.3335 5.12478 34.5739 4.66497 34.5739 3.65068C34.5739 2.62288 35.4211 1.8385 37.0279 1.8385C38.5907 1.8385 39.3941 2.56878 39.4818 3.61011H40.6064C40.5188 2.23069 39.3795 1.00002 37.0425 1.00002C34.7345 1.00002 33.4638 2.20363 33.4638 3.69126C33.4638 5.27354 34.6177 6.00383 36.1952 6.24725L37.6997 6.46363C38.9558 6.66649 39.657 7.13982 39.657 8.14059C39.657 9.31716 38.6199 10.0745 37.0425 10.0745C35.4065 10.0745 34.384 9.34421 34.2963 8.10002H33.1863C33.2739 9.72288 34.6177 10.9129 37.0279 10.9129ZM20.445 10.7236H16.3553V1.20288H20.299C22.0372 1.20288 23.2496 2.14954 23.2496 3.66421C23.2496 4.75964 22.5776 5.48992 21.4967 5.73334V5.77392C22.7821 6.00383 23.5709 6.81526 23.5709 8.08649C23.5709 9.72287 22.2709 10.7236 20.445 10.7236ZM20.1529 5.38173C21.3945 5.38173 22.154 4.75964 22.154 3.78592V3.65068C22.154 2.67697 21.3945 2.0684 20.1529 2.0684H17.4507V5.38173H20.1529ZM20.2844 9.85811C21.6428 9.85811 22.4753 9.1684 22.4753 8.11354V7.9783C22.4753 6.88287 21.6282 6.22021 20.2697 6.22021H17.4507V9.85811H20.2844ZM32.4173 10.7236H31.2488L30.3723 8.14059H26.2825L25.4061 10.7236H24.296L27.6702 1.20288H28.9994L32.4173 10.7236ZM28.3858 2.24421H28.2982L26.5746 7.28859H30.0948L28.3858 2.24421ZM42.3978 10.7236V1.20288H49V2.08192H43.4934V5.35469H48.5618V6.22021H43.4934V9.84458H49V10.7236H42.3978Z" fill="white"/>
                      </svg>
                    </Box>
                  </Box>
                  <Box
                    fontFamily="JetBrainsMono"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    width="50%"
                  >
                    <Box fontSize="12px" marginRight="12px">MINT PRICE</Box>
                    <Box
                      fontSize="16px"
                      background="linear-gradient(92deg, #FF56F6 21.43%, #B936EE 50.63%, #3BACE2 100%, #406AFF 117.04%)"
                      backgroundClip="text"
                      sx={{
                        "-webkit-background-clip": "text",
                        "-webkit-text-fill-color": "transparent"
                      }}
                    >
                      FREE
                    </Box>
                  </Box>

                  <Box
                    fontFamily="JetBrainsMono"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    width="50%"
                  >
                    <Box fontSize="12px" marginRight="12px" whiteSpace="pre">WHITELIST MINT</Box>
                    <Box
                      fontSize="14px"
                      background="linear-gradient(92deg, #FF56F6 21.43%, #B936EE 50.63%, #3BACE2 100%, #406AFF 117.04%)"
                      backgroundClip="text"
                      sx={{
                        "-webkit-background-clip": "text",
                        "-webkit-text-fill-color": "transparent"
                      }}
                      whiteSpace="pre"
                      position="relative"
                    >
                      May 15<Text as ="span" fontSize="10px" paddingBottom="4px" marginLeft="2px">th</Text>
                    </Box>
                  </Box>
                  <Box
                    width="100%"
                    height="40px"
                    display="block"
                  />
                </Box>
              </VStack>
            </SwiperSlide>
            <SwiperSlide>
              <VStack
                w="full"
                // h="100vh"
                minHeight="100vh"
                position="relative"
                color="#fff"
                paddingTop="92px"
                height="100vh"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  position="absolute"
                  top="0"
                  width="100%"
                  opacity="0.3"
                >
                  <Box
                    width="100%"
                    height="20px"
                    background="#6268FF"
                  />
                  <Box
                    width="0px"
                    height="0px"
                    borderStyle="solid"
                    borderWidth={`0 100vw 100px 0`}
                    borderColor="transparent transparent #6268FF transparent"
                    transform="rotate(180deg)"
                  />
                </Box>
                <Box
                  width="100%"
                  height="100%"
                  padding="20px"
                  fontFamily="JetBrainsMono"
                  zIndex="1"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    width="100%"
                    transform={showPage1 ? 'translateX(0px)' : 'translateX(-60px)'}
                    opacity={showPage1 ? '1' : '0'}
                    transition="all 0.3s ease"
                  >
                    <Box
                      width="120px"
                      height="120px"
                    >
                      <Info1Icon />
                    </Box>
                    <Box
                      width="calc(100% - 110px)"
                    >
                      <Box
                        fontSize="14px"
                        fontWeight="700"
                        marginBottom="8px"
                      >
                        New Product
                      </Box>
                      <Box
                        fontSize="12px"
                      >
                        Priority access to new product experiences
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    width="100%"
                    transform={showPage1 ? 'translateX(0px)' : 'translateX(-60px)'}
                    opacity={showPage1 ? '1' : '0'}
                    transition="all 0.3s ease 0.2s"
                  >
                    <Box
                      width="120px"
                      height="120px"
                    >
                      <Info2Icon />
                    </Box>
                    <Box
                      width="calc(100% - 110px)"
                    >
                      <Box
                        fontSize="14px"
                        fontWeight="700"
                        marginBottom="8px"
                      >
                        Airdrop
                      </Box>
                      <Box
                        fontSize="12px"
                      >
                        Potential Airdrop entitlements for TypoX and future partners
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    width="100%"
                    transform={showPage1 ? 'translateX(0px)' : 'translateX(-60px)'}
                    opacity={showPage1 ? '1' : '0'}
                    transition="all 0.3s ease 0.4s"
                  >
                    <Box
                      width="120px"
                      height="120px"
                    >
                      <Info3Icon />
                    </Box>
                    <Box
                      width="calc(100% - 110px)"
                    >
                      <Box
                        fontSize="14px"
                        fontWeight="700"
                        marginBottom="8px"
                      >
                        Ecosystem
                      </Box>
                      <Box
                        fontSize="12px"
                      >
                        Future ecosystem advantages of KNN3 Network
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    width="100%"
                    transform={showPage1 ? 'translateX(0px)' : 'translateX(-60px)'}
                    opacity={showPage1 ? '1' : '0'}
                    transition="all 0.3s ease 0.6s"
                  >
                    <Box
                      width="120px"
                      height="120px"
                    >
                      <Info4Icon />
                    </Box>
                    <Box
                      width="calc(100% - 110px)"
                    >
                      <Box
                        fontSize="14px"
                        fontWeight="700"
                        marginBottom="8px"
                      >
                        Launchpad
                      </Box>
                      <Box
                        fontSize="12px"
                      >
                        Launchpad quota perks
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </VStack>
            </SwiperSlide>
            <SwiperSlide>
              <VStack
                w="full"
                // h="100vh"
                minHeight="100vh"
                position="relative"
                color="#fff"
              >
                <Box
                  position="absolute"
                  bottom="0px"
                  width="100%"
                  opacity="0.3"
                >
                  <Box
                    width="0px"
                    height="0px"
                    borderStyle="solid"
                    borderWidth={`0 100vw 100px 0px`}
                    borderColor="transparent transparent #6268FF transparent"
                    transform="rotate(0deg)"
                  />
                  <Box
                    width="100%"
                    height="20px"
                    background="#6268FF"
                  />
                </Box>
                <Box
                  width="100%"
                  padding="20px"
                  fontFamily="JetBrainsMono"
                  height="100vh"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  zIndex="1"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    width="100%"
                    transform={showPage2 ? 'translateX(0px)' : 'translateX(-60px)'}
                    opacity={showPage2 ? '1' : '0'}
                    transition="all 0.3s ease"
                  >
                    <Box
                      width="120px"
                      height="120px"
                    >
                      <Info5Icon />
                    </Box>
                    <Box
                      width="calc(100% - 110px)"
                    >
                      <Box
                        fontSize="14px"
                        fontWeight="700"
                        marginBottom="8px"
                      >
                        Whitelist
                      </Box>
                      <Box
                        fontSize="12px"
                      >
                        Future event whitelist privileges
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    width="100%"
                    transform={showPage2 ? 'translateX(0px)' : 'translateX(-60px)'}
                    opacity={showPage2 ? '1' : '0'}
                    transition="all 0.3s ease 0.2s"
                  >
                    <Box
                      width="118px"
                      height="120px"
                    >
                      <Info6Icon />
                    </Box>
                    <Box
                      width="calc(100% - 110px)"
                    >
                      <Box
                        fontSize="14px"
                        fontWeight="700"
                        marginBottom="8px"
                      >
                        DePIN
                      </Box>
                      <Box
                        fontSize="12px"
                      >
                        Early testing and participation benefits for DePIN nodes
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    width="100%"
                    transform={showPage2 ? 'translateX(0px)' : 'translateX(-60px)'}
                    opacity={showPage2 ? '1' : '0'}
                    transition="all 0.3s ease 0.4s"
                  >
                    <Box
                      width="120px"
                      height="120px"
                    >
                      <Info7Icon />
                    </Box>
                    <Box
                      width="calc(100% - 110px)"
                    >
                      <Box
                        fontSize="14px"
                        fontWeight="700"
                        marginBottom="8px"
                      >
                        VIP
                      </Box>
                      <Box
                        fontSize="12px"
                        width="100%"
                      >
                        VIP perks for offline events
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </VStack>
            </SwiperSlide>
          </Swiper>
        </Box>
      </VStack>
    </>
  );
}
