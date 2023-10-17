import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

interface TabControlProps {
  index: number;
  onChange: (index: number) => void;
  options: string[];
}

const TabControl: React.FC<TabControlProps> = ({
  index,
  onChange,
  options,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surfaceVariant },
      ]}
    >
      {options.map((option, indexKey) => (
        <TouchableOpacity
          key={indexKey}
          style={[
            styles.tab,
            index === indexKey && {
              backgroundColor: theme.colors.onSurfaceVariant,
            },
          ]}
          onPress={() => onChange(indexKey)}
        >
          <Text style={[styles.tabText, { color: theme.colors.onBackground }]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 2,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    borderRadius: 10,
    padding: 1,
  },
  tabText: {
    fontSize: 16,
  },
});

export default TabControl;
