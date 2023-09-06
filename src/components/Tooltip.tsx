import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

interface TooltipProps {
  content: React.ReactNode;
  //   content: string;
  timeout?: number;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  timeout = 2000,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, timeout);
  };

  return (
    <View style={{ alignItems: "center" }}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (!isVisible) showTooltip();
        }}
      >
        {children}
      </TouchableWithoutFeedback>
      {isVisible && (
        <View
          style={{
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: 10,
            borderRadius: 12,
            zIndex: 999, // Adjust this to control overlay order
            bottom: 80,
          }}
        >
          {/* <Text>{content}</Text> */}
          {content}
        </View>
      )}
    </View>
  );
};
