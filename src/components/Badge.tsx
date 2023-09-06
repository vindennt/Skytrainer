import { Badge as PaperBadge } from "react-native-paper";

export const Badge: React.FC = () => {
  return (
    <PaperBadge
      size={8}
      style={{ position: "absolute", zIndex: 999, backgroundColor: "red" }}
    />
  );
};
