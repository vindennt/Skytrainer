import React from "react";
import {
  View,
  Modal,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { Character } from "./TripMenu";

// ImageData type
type ImageData = {
  id: number;
  imageSource: number; // Assuming imageSource is the image resource identifier (e.g., require('./images/image1.jpg'))
};

type GridSelectorProps = {
  visible: boolean;
  images: Character[];
  onClose: () => void;
  //   onSelect: (image: ImageData) => void;
  onSelect: (chracter: Character) => void;
};

const GridSelector: React.FC<GridSelectorProps> = ({
  visible,
  images,
  onClose,
  onSelect,
}) => {
  return (
    // <Modal visible={visible} animationType="slide" transparent>
    // <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

    <FlatList
      data={images}
      numColumns={2}
      keyExtractor={(item) => item.label}
      contentContainerStyle={{
        alignItems: "center",
        // flex: 1,
        flexGrow: 1,
        // width: "50%",
      }}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelect(item)}>
          {/* <Image
                  source={item.imageSource}
                  style={{ width: 150, height: 150 }}
                /> */}
          <View
            style={{ flexGrow: 1, marginVertical: 8, marginHorizontal: 30 }}
          >
            <Text>{item.label}</Text>
            <Text>{item.value}</Text>
          </View>
        </TouchableOpacity>
      )}
    />

    // </View>
    // {/* </Modal> */}
  );
};

export default GridSelector;
