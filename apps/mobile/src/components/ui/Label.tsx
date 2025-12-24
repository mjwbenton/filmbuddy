import { Text } from "./Text";

interface LabelProps {
  children: React.ReactNode;
}

export function Label({ children }: LabelProps) {
  return (
    <Text variant="caption" className="mb-xs font-medium">
      {children}
    </Text>
  );
}
