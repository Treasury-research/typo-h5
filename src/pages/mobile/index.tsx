import React from "react";
import { Box, Center, Flex, Image } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import { NextSeo } from "components";

export default function MobileComponent() {
	return (
		<>
			<NextSeo title={"TypoGraphy AI Mobile"} />
			<Box
				className="fixed top-0 left-0 right-0 bottom-0 bg-[#FFE3AC] flex items-center flex-col gap-3 justify-center"
				fontFamily="SpaceGrotesk"
			>
				<Image
					src="/images/mobile/vectorTL.png"
					alt=""
					className="fixed top-0 left-0"
				/>
				<Image
					src="/images/mobile/vectorBR.png"
					alt=""
					className="fixed bottom-0 right-0"
				/>
				<div className="flex gap-4 flex-col text-[#357E7F]">
					<div className="bg-white rounded-lg p-6 w-11/12 m-auto text-[16px] relative">
						<Image
							className="absolute left-1/2 top-0"
							style={{ translate: "-50% -50%" }}
							src="/images/mobile/computer.png"
							alt=""
						/>
						<p className="mb-6 mt-6">
							Our product is exclusively web-based and optimized for desktop
							use.{" "}
						</p>
						<p>
							For the best experience, we recommend accessing it through a
							computer or laptop.{" "}
						</p>
						<div className="flex items-center justify-between w-full mt-8">
							<Image src="/images/mobile/logo.svg" alt="" />
							<div className="text-[12px]">by TypoGraphy Team</div>
						</div>
					</div>
					<div className="rounded-lg w-11/12 m-auto">
						<h3 className="text-[20px] text-[#357E7F] font-medium px-4">
							Our current campaign
						</h3>
						<div>
							<Carousel
								autoPlay
								showStatus={false}
								showIndicators={false}
								showThumbs={false}
								interval={5000}
								infiniteLoop
								renderArrowPrev={() => null}
								renderArrowNext={() => null}
							>
								<Box h="full">
									<Image
										h="full"
										alt=""
										src="/images/mobile/Step1.png"
										borderRadius={10}
									/>
								</Box>
								<Box h="full">
									<Image
										h="full"
										alt=""
										src="/images/mobile/Step2.png"
										borderRadius={10}
									/>
								</Box>
							</Carousel>
						</div>
					</div>
				</div>
			</Box>
		</>
	);
}
