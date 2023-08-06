import React, { useMemo, useState } from "react";
import {
  View,
  Modal,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import TripMenu, { Character, characterList } from "./TripMenu";
import { render } from "react-dom";

// ImageData type
type ImageData = {
  id: number;
  imageSource: number; // Assuming imageSource is the image resource identifier (e.g., require('./images/image1.jpg'))
};

type GridSelectorProps = {
  visible: boolean;
  images: Character[];
  //   onSelect: (image: ImageData) => void;
  onSelect: (chracter: Character) => void;
};

type ItemProps = {
  item: Character;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = ({ item, onPress, backgroundColor, textColor }: ItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, { backgroundColor }]}
  >
    <Text style={[styles.title, { color: textColor }]}>{item.id}</Text>
  </TouchableOpacity>
);

const GridSelector: React.FC<GridSelectorProps> = ({
  visible,
  images,
  onSelect,
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<string>("000");
  const renderItem = ({ item }: { item: Character }) => {
    const backgroundColor =
      item.name === selectedCharacter ? "lightblue" : "royalblue";
    const color = item.name === selectedCharacter ? "black" : "white";

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedCharacter(item.name);
          onSelect(item);
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={characterList}
        numColumns={2}
        keyExtractor={(item) => item.id}
        extraData={selectedCharacter}
        contentContainerStyle={{
          alignItems: "center",
          // flex: 1,
          flexGrow: 1,
          // width: "50%",
        }}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

// </View>
// {/* </Modal> */}

export default GridSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
  },
  selectedCharacter: {
    backgroundColor: "green",
  },
  item: {
    padding: 10,
    marginVertical: 3,
    marginHorizontal: 15,
    borderRadius: 12,
    width: 100,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
  },
});
