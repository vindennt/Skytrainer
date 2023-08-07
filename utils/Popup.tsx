import React from "react";
import { Modal, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { IconButton, Button as PaperButton } from "react-native-paper";

interface PopupProps {
  visible: boolean;
  text: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ visible, text, onClose }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.popupOverlay}>
        <View style={styles.popup}>
          <Text style={styles.text}>{text}</Text>

          <IconButton
            icon="window-close"
            size={20}
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popupOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
