import { useContext } from "react";
import { Web3Context } from "lib/Web3Context";

export default function useWeb3Context() {
  return useContext(Web3Context);
}
