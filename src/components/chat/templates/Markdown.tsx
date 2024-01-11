import React from "react";
import dynamic from "next/dynamic";
import { Flex, useToast } from "@chakra-ui/react";
import { BarLoader } from "react-spinners";
import { useUserInfoStore } from "store/userInfoStore";
import { useStore } from "store";
import { useConnectModalStore } from "store/modalStore";
import useChatContext from "hooks/useChatContext";

const MDPreview = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  {
    ssr: false,
    loading: () => (
      <Flex h="20px" alignItems="center" justify="center">
        <BarLoader color="#0000003d" width="60px" />
      </Flex>
    ),
  }
);

export const Markdown = ({ value }: any) => {
  const { submitMessage, activeChat, channel } = useChatContext();
  const { userId } = useUserInfoStore();
  const showToast = useToast();
  const { setOpenConnectModal } = useConnectModalStore();

  const customComponent = ({ children, ...props }: any) => {
    if (props.className == "tooltip") {
      return (
        <span {...props}>
          <a href={children[0]["props"]["href"]} target="_blank">
            {children[0]["props"]["children"][0]}
          </a>
        </span>
      );
    } else if (props.className == "click-item-1") {
      return (
        <span
          onClick={() => {
            if (!userId) {
              showToast({
                position: 'top',
                title: `You're not logged in yet.`,
                variant: 'subtle',
                status: 'warning'
              })
              setOpenConnectModal(true);
              return;
            }
            if (activeChat && activeChat.isShare) {
              showToast({
                position: 'top',
                title: 'Please start your thread',
                variant: 'subtle',
              })
              return;
            }

            submitMessage({
              isRelationsQuestion: channel !== "magicWand",
              question: children[0],
              entriType: 1,
            });
          }}
          {...props}
        >
          {children[0]}
        </span>
      );
    } else if (props.className == "click-item-2") {
      return (
        <span
          onClick={() => {
            if (!userId) {
              showToast({
                position: 'top',
                title: `You're not logged in yet.`,
                variant: 'subtle',
                status: 'warning'
              })
              setOpenConnectModal(true);
              return;
            }
            if (activeChat && activeChat.isShare) {
              showToast({
                position: 'top',
                title: 'Please start your thread',
                variant: 'subtle',
              })
              return;
            }

            let question;

            if (children[0].toUpperCase() === "KNN3") {
              question = `What's ${children[0]} network?`;
            } else {
              question = `What's ${children[0]} ?`;
            }

            submitMessage({
              question,
              entriType: 2,
              isRelationsQuestion: channel !== "magicWand",
            });
          }}
          {...props}
        >
          {children[0]}
        </span>
      );
    }
  };

  return (
    <div data-color-mode="light">
      <div className="wmde-markdown-var"> </div>
      <MDPreview
        style={{ background: "transparent" }}
        source={(value && value.trim()) || ""}
        className="md-preview"
        linkTarget="_blank"
        components={{ span: customComponent as any }}
      />
      {/* <div dangerouslySetInnerHTML={{ __html: value }}></div> */}
    </div>
  );
};
