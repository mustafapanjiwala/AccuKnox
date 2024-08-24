import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name: "categories",
    initialState: {
        1: {
            1: true,
            2: true,
            3: true,
        },
        2: {
            1: true,
            2: true,
        },
        3: {
            1: true,
        },

    },
    reducers: {
        addWidgetData: (state, action) => {
            return { ...action.payload };
        },
    },
});

export const { addWidgetData } = categorySlice.actions;
export default categorySlice.reducer;
