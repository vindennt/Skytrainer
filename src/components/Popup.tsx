import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Button,
  IconButton,
  Button as PaperButton,
  useTheme,
} from "react-native-paper";

interface PopupProps {
  visible: boolean;
  // text: string;
  onClose: () => void;
  backgroundColours?: string[];
  children?: React.ReactNode;
  closeOnTapAnywhere?: boolean;
  closeButtonVisible?: boolean;
}

export const Popup: React.FC<PopupProps> = ({
  visible,
  // text,
  onClose,
  backgroundColours = ["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.8)"], // default backgroudn colour is fade
  children,
  closeOnTapAnywhere = true,
  closeButtonVisible = false,
}) => {
  const theme = useTheme();

  const popupContent = (
    // <View style={[styles.popupOverlay, { backgroundColor: backgroundColour }]}>
    <LinearGradient style={styles.popupOverlay} colors={backgroundColours}>
      <View style={styles.popup}>
        {children}
        {closeButtonVisible && (
          <IconButton
            icon="close"
            size={20}
            // size={10}
            mode="outlined"
            onPress={onClose}
            style={styles.closeButton}
          />
          // <Button onPress={onClose}>Close</Button>
        )}
      </View>
      {closeOnTapAnywhere && (
        <Text style={[styles.text, styles.outsideMessage]}>
          Tap anywhere to close
        </Text>
      )}
    </LinearGradient>
    // </View>
  );

  return closeOnTapAnywhere ? (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        {popupContent}
      </TouchableWithoutFeedback>
    </Modal>
  ) : (
    <Modal animationType="fade" transparent={true} visible={visible}>
      {popupContent}
    </Modal>
  );
};

const styles = StyleSheet.create({
  popupOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "white",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    // backgroundColor: "#fff",
    padding: 30,
    // margin: 20,
    borderRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 30,
    color: "blue",
    textAlign: "center",
    backgroundColor: "transparent",
    borderWidth: 1,

    // position: "absolute",
    // right: 20,
    // top: -4,
  },
  outsideMessage: {
    color: "white",
    margin: 30,
    position: "absolute",
    bottom: 70,
  },
});
