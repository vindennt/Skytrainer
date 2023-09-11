import { useTheme } from "react-native-paper";
import { UIActivityIndicator } from "react-native-indicators";
import { View } from "react-native";

export const LoadingIndicator: React.FC = () => {
  const theme = useTheme();

  return <UIActivityIndicator color={theme.colors.onBackground} />;
};
