### 21/08/2023 Update
I am currently in the process of refactoring the project to use Redux and Supabase instead of Firebase.

### Notes
- In "./node_modules/react-native-paper/src/components/MaterialCommunityIcon.tsx", change "MaterialCommunity" to "Ionicons" to ensure the BottomNavBar renders the correct icons.

# GachaSim

Productivity helper app where users set timers to stay away from their phones while the app goes on a Skytrain trip to gather in-app rewards.
Motivate was React Native and habit-forming mobile gacha game design principles. Aims to grow skills in mobile development, algorithms, and full stack development.

# Tools

ReactNative, OpenWeather, Translink Skytrain trip table, Firebase, Firestore

# Premise

Productivity tasks are linked to timers that block distracting apps using respective platform's blacklisters (e.g. iOS Focus). Habit-forming is
encouraged by interleaving gacha design, which also provides a tangible, visual form of progress to users. Rewards are in the form of character art and
upgrade materials. Using Translink's Skytrains allowed demonstration of a highly-tailored graph traversal algorithm that could produce a Skytrain
trip when given a trip duration. Using the Skytrain system also provides a sense of familiarity to users in Metro Vancouver.
Inspired by the productivity app "Forest," developed by SEEKRTECH CO.
