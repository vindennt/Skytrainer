import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import DailyFocusThresholdPicker, {
  PickerItem,
} from "@src/components/DailyFocusThresholdPicker";
import {
  selectFirstMilestone,
  selectSecondMilestone,
  selectThirdMilestone,
} from "@src/features/user/userSlice";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

interface EditPickerProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
}

const EditFocusThresholds = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const FIRST_MILESTONE: number = useSelector(selectFirstMilestone);
  const SECOND_MILESTONE: number = useSelector(selectSecondMilestone);
  const THIRD_MILESTONE: number = useSelector(selectThirdMilestone);
  const [firstMilestone, setFirstMilestone] = useState(FIRST_MILESTONE);
  const [secondMilestone, setSecondMilestone] = useState(SECOND_MILESTONE);
  const [thirdMilestone, setThirdMilestone] = useState(THIRD_MILESTONE);

  // Generate the list of numbers for the picker
  const step = 5;
  let curr = 5;
  const max = 120;
  const numberOptions: PickerItem[] = Array.from(
    { length: (max - curr) / step + 1 },
    (_, index) => ({
      label: `${curr + index * step}`,
      value: `${curr + index * step}`,
    })
  );

  const handleSubmission = () => {};
  const handleCancel = () => {
    navigation.goBack();
  };

  const EditPicker: React.FC<EditPickerProps> = ({
    label,
    value,
    onChange,
  }) => {
    return (
      <View style={styles.horizontalContainer}>
        <Text>{label}:</Text>
        <DailyFocusThresholdPicker
          value={value}
          onChange={onChange}
          items={numberOptions}
        />
        <Text>mins</Text>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.verticalSpace}>
        <View style={styles.pickerContainer}>
          <EditPicker
            label={"First Milestone:"}
            value={firstMilestone}
            onChange={setFirstMilestone}
          />
          <EditPicker
            label={"Second Milestone:"}
            value={secondMilestone}
            onChange={setSecondMilestone}
          />
          <EditPicker
            label={"Third Milestone:"}
            value={thirdMilestone}
            onChange={setThirdMilestone}
          />
        </View>

        <View
          style={[
            styles.horizontalContainer,
            { justifyContent: "space-between", paddingBottom: 40 },
          ]}
        >
          <Button mode="outlined" onPress={handleCancel}>
            Cancel
          </Button>
          <Button mode="contained" onPress={handleSubmission}>
            Submit
          </Button>
        </View>
      </View>
    </View>
  );
};

export default EditFocusThresholds;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  verticalSpace: {
    flex: 1,
    justifyContent: "space-between",
  },
  pickerContainer: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});
