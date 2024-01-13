import dynamic from "next/dynamic";
import useChatContext from "hooks/useChatContext";

const ConnectAccount = dynamic(() => import("./Account"), {
  ssr: false,
});

export const DynamicAccount = () => {
  return (
    <>
      <ConnectAccount />
    </>
  );
};
