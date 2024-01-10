import {
  Box,
  Button,
  Flex,
  VStack,
  Icon,
  HStack,
  Tooltip,
  Text,
  Center,
} from "@chakra-ui/react";
import {
  InviteModal,
  RemindModal,
  BindEmailModal,
  VerificationEmailModal,
  ConnectModal,
} from "components";
import { useJwtStore } from "store/jwtStore";
import { toShortAddress } from "lib";
import { BiLogOut, BiLogIn } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";
import { TfiEmail } from "react-icons/tfi";
import { useStore } from "store";
import { useAiStore } from "store/aiStore";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

import { useConnectModalStore } from "store/modalStore";
import { useUserInfoStore } from "store/userInfoStore";
import { useEffect, useMemo } from "react";
import { AiFillTwitterCircle } from "react-icons/ai";
import { BsTelegram } from "react-icons/bs";
import { SiSubstack } from "react-icons/si";
import { BiWallet } from "react-icons/bi";
import useWallet from "hooks/useWallet";
import api from "api";

const Account = ({
  isSandBox,
  closeNav,
}: {
  isSandBox: boolean;
  closeNav: () => void;
}) => {
  const { setJwt } = useJwtStore();
  const { doLogout } = useWallet();
  const { email, userId, setUserId, setEmail, account } = useUserInfoStore();
  const { setOpenInviteModal, setOpenBindEmailModal } = useStore();
  const { setOpenRemindModal, setOpenConnectModal } = useConnectModalStore();
  const { totalCoupon, usedCoupon, setTotalCoupon, setUsedCoupon } =
    useAiStore();

  const getUserInfo = async () => {
    const res: any = await api.get(`/api/auth`);
    if (res?.code === 200) {
      setJwt(res.data.token);
      setTotalCoupon(res?.data?.totalCoupon);
      setUsedCoupon(res?.data?.usedCoupon);
      setUserId(res?.data?.user_id);
      setEmail(res?.data?.email);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserInfo();
    }
  }, [userId, email]);

  // useEffect(() => {
  // 	if (userId) {
  // 		setOpenRemindModal(true);
  // 	}
  // }, [userId]);

  return (
    <VStack w="full" h="full" pt={4} alignItems="center" justify="flex-end">
      {userId ? (
	<VStack w="full" px={3} mb={1}>
	  <Box w="full" bg="whiteAlpha.300" color="#fff" borderRadius={10}>
	    <Flex className="w-full justify-between items-center" py={3} px={4}>
	      <HStack>
		<Jazzicon diameter={40} seed={jsNumberForAddress(account)} />
		<Box className="flex-col justify-around">
		  <Box className="text-[16px] font-bold">
		    {toShortAddress(account, 10)}
		  </Box>
		  <Box className="text-[12px]">
		    {usedCoupon}/{totalCoupon} Credits
		  </Box>
		</Box>
	      </HStack>

	      <Icon
	        as={BiLogOut}
	        className="text-[21px] cursor-pointer h-6"
	      _hover={{ transform: "scale(1.1)" }}
	        onClick={() => {
		  doLogout();
		  closeNav();
	        }}
	      />
	    </Flex>
	    <VStack
	      w="full"
	      py={3}
	      px={4}
	      borderColor="whiteAlpha.300"
	      borderTopWidth="1px"
	      fontSize="13px"
	      spacing={2}
	    >
	      <HStack w="full" justify="space-between">
		<HStack spacing={1} whiteSpace="nowrap">
		  <Icon as={LuUsers} boxSize={4} />
		  <Text transform="scale(0.95)">Refer friends</Text>
		</HStack>
		<Button
		  variant="whitePrimary"
		  size="xs"
		  px={3}
		  h="20px"
		  w="55px"
		  onClick={() => {
		    setOpenInviteModal(true);
		  }}
		>
		  Invite
		</Button>
	      </HStack>
	      <HStack w="full" justify="space-between">
		<HStack spacing={1} whiteSpace="nowrap">
		  <Icon as={TfiEmail} boxSize={4} transform="scale(0.93)" />
		  <Text transform="scale(0.93)">Verify Email</Text>
		</HStack>
		{email ? (
		  <Tooltip placement="top" fontSize="xs" label={email} hasArrow>
		    <Text
		      fontSize="xs"
		      w="100px"
		      whiteSpace="nowrap"
		      overflow="hidden"
		      textOverflow="ellipsis"
		      transform="scale(0.94)"
		      cursor="pointer"
		    >
		      {email}
		    </Text>
		  </Tooltip>
		) : (
		  <Button
		    variant="whitePrimary"
		    size="xs"
		    px={3}
		    isDisabled={email}
		    h="20px"
		    w="55px"
		    onClick={() => {
		      setOpenBindEmailModal(true);
		    }}
		  >
		    Verify
		  </Button>
		)}
	      </HStack>
	    </VStack>
	  </Box>
	</VStack>
      ) : (
	<Button
	  mb={2}
	  leftIcon={<Icon as={BiWallet} boxSize={5} />}
	  variant="whitePrimary"
	  w="80%"
	  size="sm"
	  borderRadius={16}
	  onClick={() => setOpenConnectModal(true)}
	>
	  Sign in
	</Button>
      )}

      <HStack
	w="full"
	color="bg.white"
	justify="center"
	py={3}
	borderColor="whiteAlpha.300"
	borderTopWidth="1px"
	gap={12}
      >
	<Icon
	as={AiFillTwitterCircle}
	className="cursor-pointer"
	onClick={() => window.open("https://twitter.com/Knn3Network")}
	boxSize={9}
	/>

	<Icon
	as={BsTelegram}
	className="cursor-pointer"
	onClick={() => window.open("https://t.me/+zR-uaI0Bt_hjMjY9")}
	boxSize={8}
	/>

	<Center
	  borderRadius="full"
	  bg="#fff"
	  w="34px"
	  h="34px"
	  onClick={() => window.open("https://knn3.substack.com/")}
	>
	  <Icon
	    as={SiSubstack}
	    color="#000"
	    className="cursor-pointer"
	    boxSize={4}
	  />
	</Center>
      </HStack>

      <InviteModal isSandBox={isSandBox} />
      <ConnectModal closeNav={closeNav} />
      <BindEmailModal />
      <RemindModal />
      <VerificationEmailModal />
    </VStack>
  );
};

export default Account;
