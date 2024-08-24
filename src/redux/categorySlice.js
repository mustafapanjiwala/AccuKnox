import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
    name: 'categories',
    initialState: {}
    ,
    reducers: {
        addWidgetData: (state, action) => {
            const { selectedWidgets, data } = action.payload;
            state[selectedWidgets] = data;
        },
    },
});

export const { addWidgetData } = categorySlice.actions;
export default categorySlice.reducer;
