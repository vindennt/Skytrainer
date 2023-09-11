# Skytrainer

Mobile productivity helper app where devices will disable distracting apps to help users go on "Focus Trips." Simply set a trip timer and your device will go on a Skytrain journey,accumulating in-app rewards along the way to encourage longer Focus Trips. Rewards can be used to purchase Skytrain Stations that will all have custom commissioned artwork. By applying the habit-forming mobile gacha game design principles, the app can help users build positive habits and intrinsic discipline.

# Tools

React Native, PostgreSQL, Supabase Auth & Database, Typescript

# Background

Productivity tasks are linked to timers that block distracting apps using respective platform's blocklists (e.g. iOS Focus). Habit-forming is
encouraged by interleaving gacha design, and Station collections provides a tangible, visual form of progress to users. Rewards are in the form of character art and
upgrade materials. Using Translink's Skytrains allowed demonstration of a highly-tailored graph traversal algorithm that could produce a Skytrain
trip when given a trip duration. Using the Skytrain system also provides a sense of familiarity to users in Metro Vancouver. By querying gacha data from the SQL database,
new gacha content and Stations can be injected into the app without a single update on the user side.
Inspired by the productivity app "Forest," developed by SEEKRTECH CO.

### Notes

- In "./node_modules/react-native-paper/src/components/MaterialCommunityIcon.tsx", change "MaterialCommunity" to "Ionicons" to ensure the BottomNavBar renders the correct icons.
