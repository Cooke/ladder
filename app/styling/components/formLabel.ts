import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const baseStyle = defineStyle({
  borderRadius: 50,
  fontWeight: "500",
  fontSize: "xs",
  ml: 4,
});

export const formLabelTheme = defineStyleConfig({
  baseStyle,
});
