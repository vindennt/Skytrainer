import React, { useState } from "react";
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
import { Character, characterList } from "./TripMenu";
import { getTier } from "./SKYTRAIN_DATA";
import { Tier } from "./GachaHandler";

type GridSelectorProps = {
  //   visible: boolean;
  characters: Character[];
  //   onSelect: (image: ImageData) => void;
  onSelect: (character: Character) => void;
  columns: number;
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
    <Text style={[styles.title, { color: textColor }]}>{item.name}</Text>
  </TouchableOpacity>
);

const GridSelector: React.FC<GridSelectorProps> = ({
  characters,
  onSelect,
  columns,
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<string>("001");
  const renderItem = ({ item }: { item: Character }) => {
    // background colour based on tier
    const backgroundColor = () => {
      if (item.id === selectedCharacter) {
        return "lightblue";
      } else if (getTier(item.id) === Tier.FIVE_STAR) {
        return "navy";
      } else {
        return "royalblue";
      }
    };

    const color = item.id === selectedCharacter ? "black" : "white";

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedCharacter(item.id);
          onSelect(item);
        }}
        backgroundColor={backgroundColor()}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={characterList}
        numColumns={columns}
        keyExtractor={(item) => item.name}
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
