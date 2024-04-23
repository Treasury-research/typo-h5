import {
  useBoolean,
  Icon,
  Box,
  Flex,
  Image,
  Text,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import { useUserInfoStore } from "store/userInfoStore";
import { chainList, ChainInfo } from "lib/chain";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useState, useMemo } from "react";
import { toShortAddress } from "lib";
import { BiWallet } from "react-icons/bi";
import useWallet from "hooks/useWallet";
import { AiOutlineGlobal } from "react-icons/ai";
import { useBalance } from "wagmi";
import { Address } from "viem";

export const Network = ({
  chainIds,
  showAddress = true,

  showBalance = false,
  setSelectChainId,
}: {
  chainIds: number[];
  showAddress?: boolean;
  isSwitchChain?: boolean;
  selectChainId?: number;
  showBalance?: boolean;
  setSelectChainId?: (chainId: number) => void;
}) => {
  const { chainId, switchNetwork, address } = useWallet();
  const { account } = useUserInfoStore();

  const handleSelect = (chainId: number) => {
    switchNetwork(chainId);
  };

  const result = useBalance({
    address,
    chainId: chainId,
    token: chainList[chainId]?.UContract as Address,
  });

  const balance = useMemo(() => {
    return Number(BigInt(result.data?.value || 0)) / 1000000;
  }, [result]);

  return (
    <HStack w="full" cursor="pointer" mt="10px" justify="space-between">
      <Menu>
        <MenuButton
          colorScheme="gray"
          variant="outline"
          as={Button}
          size="sm"
          rightIcon={<ChevronDownIcon />}
        >
          {chainIds.includes(chainId) ? (
            <HStack>
              <Image src={chainList[chainId].imgUrl} boxSize={5} />
              <Text fontWeight="semibold">{chainList[chainId].name}</Text>
            </HStack>
          ) : (
            <HStack>
              <Icon as={AiOutlineGlobal} boxSize={5} />
              <Text>Networks</Text>
            </HStack>
          )}
        </MenuButton>
        <MenuList minW="140px">
          {chainIds.map((item) => {
            return (
              <MenuItem key={item} onClick={() => handleSelect(item)}>
                <HStack spacing={3} pl={1}>
                  <Image src={chainList[item].imgUrl} boxSize={5} />
                  <Text fontWeight="semibold">{chainList[item].name}</Text>
                </HStack>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>

      {showAddress && (
        <HStack>
          <Icon as={BiWallet} color="#357E7F" boxSize={5} />

          {showBalance ? (
            <Text fontWeight="semibold">
              {chainIds.includes(chainId)
              ? parseFloat(String(balance)).toFixed(2)
              : "--"}{" "}
              USDT
            </Text>
          ) : (
            <Text>{toShortAddress(account, 12)}</Text>
          )}
        </HStack>
      )}
    </HStack>
  );
};
