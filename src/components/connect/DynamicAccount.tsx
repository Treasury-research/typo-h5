import dynamic from "next/dynamic";
import useChatContext from "hooks/useChatContext";

const ConnectAccount = dynamic(() => import("./Account"), {
  ssr: false,
});

export const DynamicAccount = () => {
  const { isSandBox, closeNav } = useChatContext()

  return (
    <>
      <ConnectAccount isSandBox={isSandBox} closeNav={closeNav}/>
    </>
  );
};
