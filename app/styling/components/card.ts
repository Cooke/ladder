import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    border: "none",
    borderRadius: 8
  },
});

const sizes = {
  md: definePartsStyle({}),
};

export const cardTheme = defineMultiStyleConfig({
  baseStyle,
  sizes,
  defaultProps: {
    variant: "outline",
  },
});
