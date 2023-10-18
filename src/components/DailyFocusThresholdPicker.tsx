import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

export interface PickerItem {
  label: string;
  value: string;
}

export interface DailyFocusThresholdPickerProps {
  value: string;
  onChange: (value: string) => void;
  items: PickerItem[];
}

// Generate the list of numbers for the picker
const step = 5;
let curr = 5;
const max = 120;
export const OPTIONS_FIVE_ONE_TWENTY: PickerItem[] = Array.from(
  { length: (max - curr) / step + 1 },
  (_, index) => ({
    label: `${curr + index * step}`,
    value: `${curr + index * step}`,
  })
);

const DailyFocusThresholdPicker: React.FC<DailyFocusThresholdPickerProps> = ({
  value,
  onChange,
  items,
}) => {
  const theme = useTheme();

  return (
    <Picker
      selectedValue={value}
      onValueChange={(itemValue, itemIndex) => onChange(itemValue)}
      itemStyle={{
        color: theme.colors.onBackground,
        width: 100,
      }}
    >
      {items.map((item) => (
        <Picker.Item key={item.value} label={item.label} value={item.value} />
      ))}
    </Picker>
  );
};

export default DailyFocusThresholdPicker;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    justifyContent: "center",
  },
});
