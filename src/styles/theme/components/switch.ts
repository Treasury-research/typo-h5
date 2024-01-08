import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Switch: ComponentStyleConfig = {
  baseStyle: {
    track: {
      bg: "bg.lightGray",
      _checked: {
	bg: "bg.green",
      },
    },
  },
};
