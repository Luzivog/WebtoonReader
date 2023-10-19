import { SET_DOWNLOADING_CHAPTERS } from './actionTypes';

interface DownloadState {
    [key: string]: number;
}

const initialState: DownloadState = {};

export const downloadReducer = (state = initialState, action: any): DownloadState => {
    switch (action.type) {
        case SET_DOWNLOADING_CHAPTERS:
            return action.payload; // Directly returning the payload
        default:
            return state;
    }
};
