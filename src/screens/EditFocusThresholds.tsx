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
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  UpdateUserRequest,
  updateUserData,
} from "@src/features/user/userSliceHelpers";
import { AuthState } from "@src/features/auth/authSlice";
import { Session } from "@supabase/supabase-js";
import { LoadingIndicator } from "@src/components/LoadingIndicator";

const EditFocusThresholds = () => {
  const theme = useTheme();
  const dispatch = useDispatch<any>();
  const navigation = useNavigation();
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  const FIRST_MILESTONE: number = useSelector(selectFirstMilestone);
  const SECOND_MILESTONE: number = useSelector(selectSecondMilestone);
  const THIRD_MILESTONE: number = useSelector(selectThirdMilestone);
  const [firstMilestone, setFirstMilestone] = useState<string>(
    FIRST_MILESTONE.toString()
  );
  const [secondMilestone, setSecondMilestone] = useState<string>(
    SECOND_MILESTONE.toString()
  );
  const [thirdMilestone, setThirdMilestone] = useState<string>(
    THIRD_MILESTONE.toString()
  );

  const [loading, setLoading] = useState<boolean>(false);

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

  const handleSubmission = async () => {
    setLoading(true);
    const firstMilestoneInt = parseInt(firstMilestone);
    const secondMilestoneInt = parseInt(secondMilestone);
    const thirdMilestoneInt = parseInt(thirdMilestone);

    if (
      firstMilestoneInt < secondMilestoneInt &&
      secondMilestoneInt < thirdMilestoneInt
    ) {
      const updateRequest: UpdateUserRequest = {
        session: session,
        update: {
          first_milestone: firstMilestoneInt,
          second_milestone: secondMilestoneInt,
          third_milestone: thirdMilestoneInt,
        },
      };
      await dispatch(updateUserData(updateRequest));
      navigation.goBack();
    } else {
      alert("Please check that the milestones are in ascending order.");
    }
    setLoading(false);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.verticalSpace}>
        <View style={styles.horizontalContainer}>
          {/* <Text>1st:</Text> */}
          <DailyFocusThresholdPicker
            value={firstMilestone}
            onChange={setFirstMilestone}
            items={numberOptions}
          />
          {/* <Text>2nd:</Text> */}
          <DailyFocusThresholdPicker
            value={secondMilestone}
            onChange={setSecondMilestone}
            items={numberOptions}
          />
          {/* <Text>3rd:</Text> */}
          <DailyFocusThresholdPicker
            value={thirdMilestone}
            onChange={setThirdMilestone}
            items={numberOptions}
          />
        </View>

        <View
          style={[
            styles.horizontalContainer,
            { justifyContent: "space-evenly", paddingBottom: 40 },
          ]}
        >
          <Button mode="outlined" onPress={handleCancel}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmission}
            disabled={loading}
            loading={loading}
          >
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
    justifyContent: "space-evenly",
  },
  pickerContainer: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});
