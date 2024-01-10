import {
  Icon,
  Text,
  Center,
  VStack,
  Button,
  HStack,
  Box,
} from "@chakra-ui/react";
import { ChatList } from "lib/types";
import { AiOutlineMenu } from "react-icons/ai";
import { BiGift } from "react-icons/bi";
import { NavBar, Tabs,Badge } from "react-vant";
import ShareIcon from 'components/icons/Share'
import useChatContext from "hooks/useChatContext";

export function ChatTitle() {
  const {
    activeChatId,
    showNav,
    openQuest,
    openNav,
    closeNav,
    setIsSandBox
  } = useChatContext()

  return (
    <>
      <Box w="100vw">
	{showNav && (<Box w="full" h="full" pos="absolute" zIndex={5} onClick={closeNav} />)}
	<NavBar
	className="nav-bar"
	title={
	  <Tabs
	    type="jumbo"
	    color="#000"
	    onChange={(tabIndex: any) => {
	      tabIndex === 0 ? setIsSandBox.off() : setIsSandBox.on();
	    }}
	  >
	    <Tabs.TabPane title="Chat" />
	  </Tabs>
	}
	leftText={
	  <Icon
	    className="chat-menu"
	    as={AiOutlineMenu}
	    boxSize={5}
	    mr={3}
	    ml={1}
	    onClick={openNav}
	  />
	}
	rightText={
          <Box display="flex" alignItems="center">
            <Box
              marginRight="18px"
            >
              <ShareIcon />
            </Box>
            <Badge dot>
	      <Icon
	        mt={1}
	        as={BiGift}
	        boxSize={5}
	        onClick={() => {
	          openQuest();
	        }}
	      />
	    </Badge>
          </Box>
	}
	/>
      </Box>
    </>
  );
}
