import { selectAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  field: {
    cursor: "pointer",
  },
  icon: {
    color: "purple-light",
  },
});

const outline = definePartsStyle({
  // define the part you're going to style
  field: {
    borderRadius: "50px",
    border: "1px solid",
    borderColor: "violate-light",
    color: "grey",
    cursor: "pointer",
    _hover: {
      borderColor: "purple-light",
    },
    _focus: {
      borderColor: "purple",
      color: "purple",
      boxShadow: "none",
    },
  },
  icon: {
    color: "purple-light",
  },
});

const sizes = {
  md: definePartsStyle({
    field: {
      fontSize: "sm",
      px: "4",
      h: "10",
    },
  }),
};

export const selectTheme = defineMultiStyleConfig({
  baseStyle,
  variants: { outline },
  sizes,
});
