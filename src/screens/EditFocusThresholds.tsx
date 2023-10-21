import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, Text, useTheme } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import DailyFocusThresholdPicker, {
  OPTIONS_FIVE_ONE_TWENTY,
  PickerItem,
} from "@src/components/DailyFocusThresholdPicker";
import {
  selectDailyFocusClaimed,
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
import { readjustClaimedMinutes } from "@src/utils/missionRewards";

const EditFocusThresholds = () => {
  const theme = useTheme();
  const dispatch = useDispatch<any>();
  const navigation = useNavigation();
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );
  const dailyFocusClaimed: number = useSelector(selectDailyFocusClaimed);

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

  const firstMilestoneInt = parseInt(firstMilestone);
  const secondMilestoneInt = parseInt(secondMilestone);
  const thirdMilestoneInt = parseInt(thirdMilestone);
  const [loading, setLoading] = useState<boolean>(false);
  const validMilestoneOrder: boolean =
    firstMilestoneInt < secondMilestoneInt &&
    secondMilestoneInt < thirdMilestoneInt;

  const numberOptions: PickerItem[] = OPTIONS_FIVE_ONE_TWENTY;

  const handleSubmission = async () => {
    setLoading(true);

    if (validMilestoneOrder) {
      const readjustedClaimedMins: number = readjustClaimedMinutes(
        FIRST_MILESTONE,
        SECOND_MILESTONE,
        THIRD_MILESTONE,
        firstMilestoneInt,
        secondMilestoneInt,
        thirdMilestoneInt,
        dailyFocusClaimed
      );

      const updateRequest: UpdateUserRequest = {
        session: session,
        update: {
          first_milestone: firstMilestoneInt,
          second_milestone: secondMilestoneInt,
          third_milestone: thirdMilestoneInt,
          daily_focus_claimed: readjustedClaimedMins,
        },
      };
      await dispatch(updateUserData(updateRequest));
      navigation.goBack();
    } else {
      alert("Please check that the milestones are in ascending order.");
    }
    // setLoading(false);
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
        <HelperText type="error" visible={!validMilestoneOrder}>
          {"Milestones must be in ascending order."}
        </HelperText>
        <Text style={{ padding: 30, color: theme.colors.onBackground }}>
          Note: Any Daily Focus Rewards that are already claimed will not be
          able to be claimed again until the next day.
        </Text>

        <View
          style={[
            styles.horizontalContainer,
            {
              justifyContent: "space-evenly",
              paddingBottom: 40,
              width: "100%",
            },
          ]}
        >
          <Button
            mode="outlined"
            onPress={handleCancel}
            labelStyle={{ color: theme.colors.onPrimary }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmission}
            disabled={loading || !validMilestoneOrder}
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
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  pickerContainer: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});
