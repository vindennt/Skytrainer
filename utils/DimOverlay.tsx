import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";

interface DimOverlayProps {
  onClose: () => void;
}

const DimOverlay: React.FC<DimOverlayProps> = ({ onClose }) => {
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay} />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent black color for the dim effect
  },
});

export default DimOverlay;
