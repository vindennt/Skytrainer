import Slider from "@react-native-community/slider";
import { UserState, setSlider } from "@src/features/user/userSlice";
import { ChangeEvent, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";

interface TimeSliderProps {
  onValueChange?: (e: string | ChangeEvent<any>) => void;
}

export const TimeSlider: React.FC<TimeSliderProps> = ({ onValueChange }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const sliderValue = useSelector(
    (state: { user: UserState }) => state.user.slider
  );

  const slider = {
    min: 0,
    max: 120,
    proportion: 120,
    visualStep: 5,
    step: 5,
  };
  const sliderInitial: number = (sliderValue / slider.proportion) * slider.max;

  const getNewValue = (value: number): number => {
    const newValue =
      Math.round(((value / slider.max) * slider.proportion) / slider.step) *
      slider.step;
    return newValue;
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.sliderBackdrop}>
          <Slider
            style={styles.slider}
            minimumValue={slider.min}
            maximumValue={slider.max}
            lowerLimit={slider.min}
            upperLimit={slider.max}
            value={sliderInitial} // initial value
            step={slider.visualStep}
            minimumTrackTintColor="whitesmoke"
            maximumTrackTintColor="darkgray"
            tapToSeek={true}
            thumbTintColor="white"
            onValueChange={(value) => {
              const correctedValue = getNewValue(value);

              if (onValueChange !== undefined) {
                onValueChange(correctedValue.toString());
              } else {
                dispatch(setSlider(correctedValue));
              }
            }}
            // onSlidingStart={() => setSliding("Sliding")}
            // onSlidingComplete={() => setSliding("Inactive")}
          />
          <View style={styles.icon}>
            <Icon name="time" size={18} color="gray" style={styles.icon} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 1,
    // backgroundColor: "green",
    // width: "50%",
    // flex: 1,
    // justifyContent: "center",
    // marginRight: 10,
    // marginTop: 8,
  },
  slider: {
    height: 40,
    // paddingHorizontal: 10,
    bottom: 5,
  },
  sliderBackdrop: {
    height: 30,
    backgroundColor: "whitesmoke",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.5)",
  },
  icon: {
    padding: 4,
    marginLeft: 0.5,
    position: "absolute",
  },
});
