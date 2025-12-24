import { Text } from "./Text";

interface ErrorMessageProps {
  message?: string;
  testID?: string;
}

export function ErrorMessage({ message, testID }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <Text variant="small" color="error" className="mt-xs" testID={testID}>
      {message}
    </Text>
  );
}
