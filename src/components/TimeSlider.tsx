import Slider from "@react-native-community/slider";
import { UserState, setSlider } from "@src/features/user/userSlice";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

// interface SliderProps {
//   onValueChange: (value: number) => void;
// }

// export const TimeSlider: React.FC<SliderProps> = ({ onValueChange }) => {
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
    <Slider
      style={styles.slider}
      minimumValue={slider.min}
      maximumValue={slider.max}
      lowerLimit={slider.min}
      upperLimit={slider.max}
      value={sliderInitial} // initial value
      step={slider.visualStep}
      minimumTrackTintColor="whitesmoke"
      maximumTrackTintColor="gray"
      tapToSeek={true}
      thumbTintColor="whitesmoke"
      onValueChange={(value) => {
        getNewValue(value);
      }}
      // onSlidingStart={() => setSliding("Sliding")}
      // onSlidingComplete={() => setSliding("Inactive")}
    />
  );
};

const styles = StyleSheet.create({
  slider: {
    width: "90%",
    height: 40,
    paddingHorizontal: 10,
  },
});
