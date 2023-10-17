import { Badge as PaperBadge, useTheme } from "react-native-paper";

export const Badge: React.FC = () => {
  const theme = useTheme();

  return (
    <PaperBadge
      size={10}
      style={{
        position: "absolute",
        zIndex: 999,
        backgroundColor: theme.colors.tertiary,
      }}
    />
  );
};
