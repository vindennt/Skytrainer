import { createSlice } from "@reduxjs/toolkit";
import { BannerInfo } from "@src/utils/gacha";
import { fetchLimitedBanner } from "./shopSliceHelpers";

export interface ShopState {
  limitedBanner: BannerInfo | null;
}

const initialState: ShopState = {
  limitedBanner: null,
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    // setLimitedBanner: (state, action) => {
    //   state.limitedBanner = action.payload;
    // },
  },
  extraReducers(builder) {
    builder.addCase(fetchLimitedBanner.fulfilled, (state, action) => {
      if (action.payload) {
        console.log("fetchLimitedBanner fulfilled");
        console.log(JSON.stringify(action.payload));
        // state.limitedBanner = {
        //   type: "limited",
        //   ...action.payload,
        // } as BannerInfo;
      }
    });
  },
});

export { fetchLimitedBanner } from "./shopSliceHelpers";
// export const { setLimitedBanner } = shopSlice.actions;
export default shopSlice.reducer;
