import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
// import * as React from "react";
import React, { Component } from "react";

interface Props {
  onTouchOutside: () => void; // Add the onTouchOutside property to Props
  title: string;
  data: Item[];
  // Add any other props your component expects here
}

interface Item {
  id: number;
  name: string;
}

interface State {
  show: boolean;
}

const deviceHeight = Dimensions.get("window").height;
export class BottomPopup extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  show = () => {
    this.setState({ show: true });
  };

  close = () => {
    this.setState({ show: false });
  };

  renderOutsideTouchable(onTouch: any) {
    const view = <View style={{ flex: 1, width: "100%" }} />;
    if (!onTouch) {
      return view;
    }

    return (
      <TouchableWithoutFeedback style={{ flex: 1, width: "100%" }}>
        {view}
      </TouchableWithoutFeedback>
    );
  }

  renderTitle = () => {
    const { title } = this.props;
    return (
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            color: "#182E44",
            fontSize: 20,
            fontWeight: "500",
            marginTop: 15,
            marginBottom: 30,
          }}
        >
          {title}
        </Text>
      </View>
    );
  };
  renderContent = () => {
    const { data } = this.props;
    return (
      <View>
        <FlatList
          style={{ marginBottom: 20 }}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={this.renderItem}
          extraData={data}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.renderSeparator}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
        />
      </View>
    );
  };

  renderItem = ({ item }: { item: Item }) => {
    return (
      <View style={{ height: 50, flex: 1, alignItems: "flex-start" }}>
        <Text
          style={{ fontSize: 18, fontWeight: "normal", color: "#182E44" }}
        ></Text>
        <Text>{item.name}</Text>
      </View>
    );
  };
  renderSeparator = () => {
    return (
      <View
        style={{ opacity: 0.1, backgroundColor: "#182E44", height: 1 }}
      ></View>
    );
  };

  render() {
    let { show } = this.state;
    const { onTouchOutside, title } = this.props;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.show}
        onRequestClose={this.close}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "gray",
            justifyContent: "flex-end",
          }}
        >
          {this.renderOutsideTouchable(onTouchOutside)}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              width: "100%",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              paddingHorizontal: 10,
              maxHeight: deviceHeight * 0.4,
            }}
          >
            {this.renderTitle()}
            {this.renderContent()}
          </View>
        </View>
      </Modal>
    );
  }
}
