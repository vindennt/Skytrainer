interface ImagesMapType {
  [key: string]: string; // Specify that keys are strings and values are strings (image paths)
}

export const imageBustMap: ImagesMapType = {
  "001": require("@src/public/images/bust_001.png"),
  "002": require("@src/public/images/bust_002.png"),
  "003": require("@src/public/images/bust_003.png"),
  "004": require("@src/public/images/bust_004.png"),
  "005": require("@src/public/images/bust_005.png"),
  "006": require("@src/public/images/bust_006.png"),
  "007": require("@src/public/images/bust_007.png"),
};

export const imageIconMap: ImagesMapType = {
  "001": require("@src/public/images/icon_001.png"),
  "002": require("@src/public/images/icon_002.png"),
  "003": require("@src/public/images/icon_003.png"),
  "004": require("@src/public/images/icon_004.png"),
  "005": require("@src/public/images/icon_005.png"),
  "006": require("@src/public/images/icon_006.png"),
  "007": require("@src/public/images/icon_007.png"),
};
