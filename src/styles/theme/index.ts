import { extendTheme } from "@chakra-ui/react";

import { colors } from "./colors";
import * as components from "./components";
import { config } from "./config";
import { fonts } from "./fonts";

const customTheme = extendTheme({
  fonts,
  colors,
  config,
  components: {
    ...components,
    Alert: {
      variants: {
        subtle: (props: any) => { // only applies to `subtle` variant
          const { colorScheme: c } = props

          return {
            container: {
              bg: `white`, // or literal color, e.g. "#0984ff"
              radii: '40px',
            },
          }
        }
      }
    }
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === "light" ? "#fff" : "#000",
      },
    }),
  },
});

export default customTheme;
