import { selectDarkTheme } from "@src/navigation/navSlice";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

interface Props {
  children: React.ReactNode;
  position?: "absolute" | "relative";
}

const Layout: React.FC<Props> = ({ children, position }) => {
  const theme = useTheme();
  const isDark: boolean = useSelector(selectDarkTheme);

  return (
    <View style={[styles.container]}>
      {children}
      <BlurView
        intensity={100}
        tint={isDark ? "dark" : "light"}
        style={[
          styles.footer,
          { backgroundColor: theme.colors.primaryContainer },
          position === "absolute" && { position: "absolute", bottom: 0 },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    height: 85, // adjust height as needed
    width: "100%",
  },
});

export default Layout;
