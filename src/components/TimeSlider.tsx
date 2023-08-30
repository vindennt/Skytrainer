import Slider from "@react-native-community/slider";
import { UserState, setSlider } from "@src/features/user/userSlice";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";

export const TimeSlider: React.FC = () => {
  const dispatch = useDispatch();
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

  const getNewValue = (value: number) => {
    const newValue =
      Math.round(((value / slider.max) * slider.proportion) / slider.step) *
      slider.step;
    dispatch(setSlider(newValue));
  };

  return (
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
          getNewValue(value);
        }}
        // onSlidingStart={() => setSliding("Sliding")}
        // onSlidingComplete={() => setSliding("Inactive")}
      />
      <View style={styles.icon}>
        <Icon name="timer-outline" size={18} color="gray" style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slider: {
    // width: "90%",
    height: 40,
    paddingHorizontal: 10,
    // backgroundColor: "whitesmoke",
    // borderRadius: 20,
    bottom: 5,
    // zIndex: 1,
  },
  sliderBackdrop: {
    height: 29,
    // paddingHorizontal: 10,
    backgroundColor: "whitesmoke",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "gray",
  },
  icon: {
    padding: 4,
    marginLeft: 0.5,
    position: "absolute",
  },
});
