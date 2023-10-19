import { SET_DOWNLOADING_CHAPTERS } from './actionTypes';

export const setDownloadingChapters = (chapters: any) => ({
    type: SET_DOWNLOADING_CHAPTERS,
    payload: chapters,
});