import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const baseStyle = defineStyle({
  borderRadius: 50,
  fontWeight: "normal",
});

const md = defineStyle({
  fontSize: "sm",
});

const primary = defineStyle({
  bg: "primary",
  color: "white",
  _hover: {
    bg: "primary-hover",
  },
});

const secondary = defineStyle({
  bg: "transparent",
  color: "primary",
  border: "1px solid",
  borderColor: "primary",
  _hover: {
    bg: "primary",
    color: "white",
  },
});

export const buttonTheme = defineStyleConfig({
  baseStyle,
  variants: { primary, secondary },
  sizes: { md },
});
