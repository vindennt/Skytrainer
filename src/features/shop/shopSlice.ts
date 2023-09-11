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
        const data = action.payload;
        console.log("fetchLimitedBanner fulfilled");
        console.log(JSON.stringify(action.payload));
        state.limitedBanner = {
          title: data.title,
          limitedStationId: data.limited_station_id,
          rateUpIdOne: data.rate_up_id_one,
          rateUpIdTwo: data.rate_up_id_two,
          rateUpIdThree: data.rate_up_id_three,
          startDate: new Date(data.start_date),
          endDate: new Date(data.end_date),
          description: data.description,
          type: "limited",
        } as BannerInfo;
        console.log(state.limitedBanner);
      }
    });
  },
});

export { fetchLimitedBanner } from "./shopSliceHelpers";
// export const { setLimitedBanner } = shopSlice.actions;
export default shopSlice.reducer;

export const selectLimitedBanner = (state: { shop: ShopState }) =>
  state.shop.limitedBanner;
