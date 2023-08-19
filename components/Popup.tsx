import React from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { IconButton, Button as PaperButton } from "react-native-paper";

interface PopupProps {
  visible: boolean;
  // text: string;
  onClose: () => void;
  backgroundColour?: string;
  children?: React.ReactNode;
  closeOnTapAnywhere?: boolean;
  closeButtonVisible?: boolean;
}

const Popup: React.FC<PopupProps> = ({
  visible,
  // text,
  onClose,
  backgroundColour = "rgba(0, 0, 0, 0.8)", // default backgroudn colour is fade
  children,
  closeOnTapAnywhere = true,
  closeButtonVisible = false,
}) => {
  const popupContent = (
    <View style={[styles.popupOverlay, { backgroundColor: backgroundColour }]}>
      <View style={styles.popup}>
        {children}
        {closeButtonVisible && (
          <IconButton
            icon="window-close"
            size={20}
            onPress={onClose}
            style={styles.closeButton}
          />
        )}
      </View>
      {closeOnTapAnywhere && (
        <Text style={[styles.text, { color: "white", margin: 30 }]}>
          Tap anywhere to close
        </Text>
      )}
    </View>
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
    backgroundColor: "#fff",
    padding: 20,
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
    backgroundColor: "lightgray",
    borderWidth: 1,
  },
});

export default Popup;
