import { Text as RNText } from "react-native";

type TextVariant =
  | "display"
  | "heading"
  | "subheading"
  | "body"
  | "caption"
  | "small";
type TextColor = "ink" | "stone" | "error" | "success" | "warning" | "white";

interface TextProps {
  variant?: TextVariant;
  color?: TextColor;
  children: React.ReactNode;
  className?: string;
  testID?: string;
}

const variantStyles: Record<TextVariant, string> = {
  display: "font-heading text-display",
  heading: "font-heading text-heading",
  subheading: "font-heading-medium text-subheading",
  body: "text-body",
  caption: "text-caption",
  small: "text-small",
};

const colorStyles: Record<TextColor, string> = {
  ink: "text-ink",
  stone: "text-stone",
  error: "text-error",
  success: "text-success",
  warning: "text-warning",
  white: "text-white",
};

export function Text({
  variant = "body",
  color = "ink",
  children,
  className = "",
  testID,
}: TextProps) {
  return (
    <RNText
      className={`${variantStyles[variant]} ${colorStyles[color]} ${className}`}
      testID={testID}
    >
      {children}
    </RNText>
  );
}
