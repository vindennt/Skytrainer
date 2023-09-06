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
}

const initialState: NavSliceState = {
  routes: [
    {
      key: "home",
      title: "Skytrain",
      focusedIcon: "subway",
    },
    {
      key: "missions",
      title: "Missions",
      focusedIcon: "calendar",
      badge: true,
    },
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
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setRoutes: (state, action) => {
      state.routes = action.payload;
      // console.log(state.skytrainGraph);
    },
    setMissionBadgeVisibility: (state, action) => {
      state.routes = [
        {
          key: "home",
          title: "Skytrain",
          focusedIcon: "subway",
        },
        {
          key: "missions",
          title: "Missions",
          focusedIcon: "calendar",
          badge: action.payload,
        },
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

export const { setRoutes, setMissionBadgeVisibility } = navSlice.actions;
export default navSlice.reducer;
