import Slider from "@react-native-community/slider";
import { useState } from "react";
import { View, StyleSheet } from "react-native";

interface SliderProps {
  onValueChange: (value: number) => void;
}

export const TimeSlider: React.FC<SliderProps> = ({ onValueChange }) => {
  const slider = {
    min: 0,
    max: 300,
    proportion: 120,
    visualStep: 1,
    step: 5,
  };
  const sliderInitial: number = (25 / slider.proportion) * slider.max;

  const getNewValue = (value: number) => {
    const newValue =
      Math.round(((value / slider.max) * slider.proportion) / slider.step) *
      slider.step;
    onValueChange(newValue);
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
      minimumTrackTintColor="#085cac"
      maximumTrackTintColor="silver"
      tapToSeek={true}
      thumbTintColor="#085cac"
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
