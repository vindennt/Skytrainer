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
  const isAbsolute: boolean = position === "absolute";

  return (
    <View style={[styles.container]}>
      {children}
      {isAbsolute && (
        <BlurView
          // intensity={isDark ? 35 : 50}
          // tint="default"
          // style={[
          //   styles.glassLine,
          //   !isDark && { backgroundColor: "rgba(0, 0, 0, 0.2)" },
          // ]}
          intensity={60}
          tint={isDark ? "dark" : "default"}
          style={[
            styles.glassLine,
            {
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.10)",
            },
          ]}
        />
      )}

      <BlurView
        intensity={80}
        tint={isDark ? "dark" : isAbsolute ? "light" : "default"}
        style={[
          styles.footer,
          isAbsolute && { position: "absolute", bottom: 0 },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  footer: {
    height: 85, // adjust height as needed
    width: "100%",
  },
  glassLine: {
    height: 1.5,
    bottom: 85,
    backgroundColor: "transparent",
  },
});

export default Layout;
