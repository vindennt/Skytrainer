import { createSlice } from "@reduxjs/toolkit";

export interface NavSliceState {
  routes: (
    | {
        key: string;
        title: string;
        focusedIcon: string;
        badge?: undefined;
      }
    | {
        key: string;
        title: string;
        focusedIcon: string;
        badge: boolean;
      }
  )[];
  darkTheme: boolean;
  levelingUpMode: boolean;
}

const initialState: NavSliceState = {
  routes: [
    {
      key: "home",
      title: "Skytrain",
      focusedIcon: "subway",
    },
    // {
    //   key: "missions",
    //   title: "Missions",
    //   focusedIcon: "calendar",
    //   badge: true,
    // },
    {
      key: "stations",
      title: "Stations",
      focusedIcon: "map",
    },
    {
      key: "shop",
      title: "Shop",
      focusedIcon: "pricetags",
    },
  ],
  darkTheme: true,
  levelingUpMode: false,
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setRoutes: (state, action) => {
      state.routes = action.payload;
      // console.log(state.skytrainGraph);
    },
    setIsDarkTheme: (state, action) => {
      state.darkTheme = action.payload;
      // console.log(state.skytrainGraph);
    },
    setLevelingUpMode: (state, action) => {
      state.levelingUpMode = action.payload;
      // console.log(state.skytrainGraph);
    },
    setMissionBadgeVisibility: (state, action) => {
      state.routes = [
        {
          key: "missions",
          title: "Skytrain",
          focusedIcon: "subway",
          badge: action.payload,
        },
        // {
        //   key: "missions",
        //   title: "Missions",
        //   focusedIcon: "calendar",
        //   badge: action.payload,
        // },
        {
          key: "stations",
          title: "Stations",
          focusedIcon: "map",
        },
        {
          key: "shop",
          title: "Shop",
          focusedIcon: "pricetags",
        },
      ];
    },
  },
});

export const {
  setRoutes,
  setMissionBadgeVisibility,
  setIsDarkTheme,
  setLevelingUpMode,
} = navSlice.actions;
export default navSlice.reducer;
export const selectDarkTheme = (state: { nav: NavSliceState }) =>
  state.nav.darkTheme;
export const selectLevelingUpMode = (state: { nav: NavSliceState }) =>
  state.nav.levelingUpMode;
