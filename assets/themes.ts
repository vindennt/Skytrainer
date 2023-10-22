import { Platform } from "react-native";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const LIGHT_THEME = {
  ...MD3LightTheme,
  colors: {
    background: "#FFFFFF",
    onBackground: "#000000",
    surface: "#F8FAFD",
    onSurface: "#000000",
    surfaceVariant: "#DADEE3",
    onSurfaceVariant: "#FFFFFF",
    // primary: "#085DA9",
    // onPrimary: "white",
    primary: "#DFE5ED",
    onPrimary: "#085DA9",
    secondary: "#F8FAFD",
    onSecondary: "#085DA9",
    outlineVariant: "#6D7383", // secondary text
    outline: "#D4DDE0", // divider
    backdrop: "#849097", // icon disabled
    tertiary: "#0099C6", // notification
    tertiaryContainer: "#FDC426", // gold
    onTertiaryContainer: "#17375C", // navy
    surfaceDisabled: "#F0F4FB", // non touchable
    onSurfaceDisabled: "#87919C", // on non touchable
    text: "#000000",
    primaryContainer: "rgba(248, 250, 253, 0.4)",
    inverseSurface: "rgba(255, 255, 255, 0)",

    // primary: "rgb(120, 69, 172)",
    // onPrimary: "rgb(255, 255, 255)",
    // primaryContainer: "rgb(240, 219, 255)",
    onPrimaryContainer: "rgb(44, 0, 81)",
    // secondary: "rgb(102, 90, 111)",
    // onSecondary: "rgb(255, 255, 255)",
    // secondaryContainer: "rgb(237, 221, 246)",
    onSecondaryContainer: "rgb(33, 24, 42)",
    // tertiary: "rgb(128, 81, 88)",
    onTertiary: "rgb(255, 255, 255)",
    // tertiaryContainer: "rgb(255, 217, 221)",
    // onTertiaryContainer: "rgb(50, 16, 23)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    // background: "rgb(255, 251, 255)",
    // onBackground: "rgb(29, 27, 30)",
    // surface: "rgb(255, 251, 255)",
    // onSurface: "rgb(29, 27, 30)",
    // surfaceVariant: "rgb(233, 223, 235)",
    // onSurfaceVariant: "rgb(74, 69, 78)",
    // outline: "rgb(124, 117, 126)",
    // outlineVariant: "rgb(204, 196, 206)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    // inverseSurface: "rgb(50, 47, 51)",
    inverseOnSurface: "rgb(245, 239, 244)",
    inversePrimary: "rgb(220, 184, 255)",
    elevation: {
      level0: "transparent",
      level1: "#F8FAFD",
      level2: "#F8FAFD",
      level3: "#F8FAFD",
      level4: "#F8FAFD",
      level5: "#F8FAFD",
    },
    // surfaceDisabled: "rgba(29, 27, 30, 0.12)",
    // onSurfaceDisabled: "rgba(29, 27, 30, 0.38)",
    // backdrop: "rgba(51, 47, 55, 0.4)",
    newColor: "rgb(120, 69, 172)",
    onNewColor: "rgb(255, 255, 255)",
    newColorContainer: "rgb(240, 219, 255)",
    onNewColorContainer: "rgb(44, 0, 81)",
  },
  // fonts: configureFonts({ config: fontConfig }),
};

// export const BUTTON_LIGHT_THEME = {
//   colors: {
//     ...LIGHT_THEME.colors,
//     primary: LIGHT_THEME.colors.onPrimary,
//   },
// };

export const TEXTBOX_LIGHT_THEME = {
  colors: {
    ...LIGHT_THEME.colors,
    primary: LIGHT_THEME.colors.onPrimary,
    background: LIGHT_THEME.colors.primary,
    onSurfaceVariant: LIGHT_THEME.colors.backdrop,
    outline: "transparent",
  },
};

export const DARK_THEME = {
  ...MD3DarkTheme,
  colors: {
    background: "#1C1C23",
    onBackground: "#FFFFFF",
    surface: "#21212B",
    onSurface: "#FFFFFF",
    surfaceVariant: "#30303F",
    onSurfaceVariant: "#5A5A71",
    primary: "#353546",
    onPrimary: "#1F99DE",
    secondary: "#30303F",
    onSecondary: "#1F99DE",
    outlineVariant: "#8A93A8",
    outline: "#585873",
    backdrop: "#8F8FA3",
    tertiary: "#0099C6",
    tertiaryContainer: "#FDC426",
    onTertiaryContainer: "#17375C",
    surfaceDisabled: "#272734",
    onSurfaceDisabled: "#87919C",
    text: "#FFFFFF",
    primaryContainer: "rgba(30, 30, 62, 0.1)",
    inverseSurface: "rgba(28, 28, 35, 0)",

    // primary: "rgb(220, 184, 255)",
    // onPrimary: "rgb(71, 12, 122)",
    // primaryContainer: "rgb(95, 43, 146)",
    onPrimaryContainer: "rgb(240, 219, 255)",
    // secondary: "rgb(208, 193, 218)",
    // onSecondary: "rgb(54, 44, 63)",
    secondaryContainer: "rgb(77, 67, 87)",
    onSecondaryContainer: "rgb(237, 221, 246)",
    // tertiary: "rgb(243, 183, 190)",
    onTertiary: "rgb(75, 37, 43)",
    // tertiaryContainer: "rgb(101, 58, 65)",
    // onTertiaryContainer: "rgb(255, 217, 221)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    // background: "#1B1B1F",
    // onBackground: "rgb(231, 225, 229)",
    // surface: "rgb(29, 27, 30)",
    // onSurface: "rgb(231, 225, 229)",
    // surfaceVariant: "#1E1E27",
    // onSurfaceVariant: "rgb(204, 196, 206)",
    // outline: "rgb(150, 142, 152)",
    // outlineVariant: "rgb(74, 69, 78)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    // inverseSurface: "rgb(231, 225, 229)",
    inverseOnSurface: "rgb(50, 47, 51)",
    inversePrimary: "rgb(120, 69, 172)",
    elevation: {
      level0: "transparent",
      level1: "#1E1E27",
      level2: "#1E1E27",
      level3: "#1E1E27",
      level4: "#1E1E27",
      level5: "#1E1E27",
    },
    // surfaceDisabled: "rgba(231, 225, 229, 0.12)",
    // onSurfaceDisabled: "rgba(231, 225, 229, 0.38)",
    // backdrop: "rgba(51, 47, 55, 0.4)",
    newColor: "rgb(220, 184, 255)",
    onNewColor: "rgb(71, 12, 122)",
    newColorContainer: "rgb(95, 43, 146)",
    onNewColorContainer: "rgb(240, 219, 255)",
  },
};

// export const BUTTON_DARK_THEME = {
//   colors: {
//     ...DARK_THEME.colors,
//     primary: DARK_THEME.colors.onPrimary,
//   },
// };

export const TEXTBOX_DARK_THEME = {
  colors: {
    ...DARK_THEME.colors,
    primary: DARK_THEME.colors.onPrimary,
    background: DARK_THEME.colors.primary,
    onSurfaceVariant: DARK_THEME.colors.backdrop,
    outline: "transparent",
  },
};
