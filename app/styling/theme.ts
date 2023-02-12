import { extendTheme } from "@chakra-ui/react";
import { buttonTheme } from "./components/button";
import { cardTheme } from "./components/card";
import { formLabelTheme } from "./components/formLabel";
import { selectTheme } from "./components/select";

const colors = {
  nero: "#222222",
  "cyber-grape-20": "#ddd6e3",
  "deep-purple": "#602770",
  grey: "#676767",
  "grey-light": "#f6f6f9",
  "grey-light-30": "#fcfcfd",
  "grey-light-50": "#fafafc",
  "grey-dark": "#e2e2e2",
  violet: "#9081AC",
  "violate-light": "#E1DCE2",
  purple: "#691f74",
  "purple-dark": "#30183f",
  "purple-light": "rgba(105, 31, 116, 0.3)",
  orange: "#E34B31",
  "orange-dark": "#D6432A",
  "orange-light": "#E34B31",
  "organge-talent": "#FE3B1F",
  "oragnge-salmon": "#FAD4C5",
  blue: "#0DA0BA",
  yellow: "#DB9714",
  green: "#60D3BF",
};

const theme = extendTheme({
  colors,

  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`,
  },

  // fontSizes: {
  //   md: "14px",
  // },

  styles: {
    global: {
      body: {
        bg: "grey-light",
      },
    },
  },

  components: {
    Button: buttonTheme,
    Select: selectTheme,
    Card: cardTheme,
    FormLabel: formLabelTheme,
    Heading: {
      baseStyle: {
        color: "purple-dark",
      },
    },
  },

  semanticTokens: {
    colors: {
      primary: "orange",
      "primary-hover": "orange-dark",
      secondary: "deep-purple",
      "secondary-hover": "purple",
      "text-soft": "grey",
    },
    space: {
      xs: 2,
      sm: 4,
      md: 6,
      lg: 8,
    },
  },
});

export default theme;
