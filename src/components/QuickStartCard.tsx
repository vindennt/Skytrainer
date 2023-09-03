import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Button, Title, IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Session } from "@supabase/supabase-js";
import { AuthState } from "@src/features/auth/authSlice";

interface QuickStartButtonProps {
  id?: string;
  name: string;
  duration?: number;
  isAdd?: boolean;
}

export const QuickStartCard: React.FC = ({}) => {
  const dispatch = useDispatch<any>();
  const session: Session | null = useSelector(
    (state: { auth: AuthState }) => state.auth.session
  );

  const QuickStartButton: React.FC<QuickStartButtonProps> = ({
    id = "",
    name,
    duration = 0,
    isAdd = false,
  }) => {
    return (
      <View style={styles.quickButtonStyleContainer}>
        <TouchableOpacity
          onPress={() => {
            console.log("Pressed quicxkstart");
          }}
          style={{ alignItems: "center" }}
        >
          <View style={styles.quickButtonStyle}>
            <Text style={isAdd ? { fontSize: 20 } : styles.text}>
              {isAdd ? "+" : duration}
            </Text>
          </View>
          <Text style={[styles.text, { marginTop: 5 }]}>{name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Quickstart</Text>
          <Button
            icon="chevron-forward-outline"
            onPress={() => {}}
            contentStyle={{ flexDirection: "row-reverse" }}
            labelStyle={{ marginVertical: 2 }}
          >
            Edit
          </Button>
        </View>
        <View style={styles.quickstartContainer}>
          <QuickStartButton isAdd={true} name="Add" />
          <QuickStartButton id="d" name="Study" duration={120} />
          {/* TODO: Onl render this if theres <4 quickstarts  */}
        </View>
      </View>
    </View>
  );
};

export default QuickStartCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#454045",
    // padding: 20,
    padding: 20,
    paddingBottom: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "green",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quickstartContainer: {
    flexDirection: "row",
    // alignItems: "flex-end",
    // flex: 1,
    // justifyContent: "space-between",
    backgroundColor: "gray",
  },
  quickButtonStyle: {
    width: 60,
    height: 60,
    backgroundColor: "royalblue",
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    // flex: 1,
  },
  quickButtonStyleContainer: {
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: "center",
    // marginHorizontal: 20,
    // marginRight: 10,
  },
  text: {
    fontSize: 16,
  },
});
