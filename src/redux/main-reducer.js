import { API } from "../api/api";

const SET_IDS = 'MAIN-REDUCER/SET_IDS';
const SET_STORIES = 'MAIN-REDUCER/SET_STORIES';
const TOGGLE_PRELOADER = 'MAIN-REDUCER/TOGGLE_PRELOADER';
const TOGGLE_PRELOADER_BOTTOM = 'MAIN-REDUCER/TOGGLE_PRELOADER_BOTTOM';
const TOGGLE_DISABLE = 'MAIN_REDUCER?TOGGLE_DISABLE';

const initialState = {
    idsOfNewStories: [],
    stories: [],
    isPreloaded: true,
    isPreloadedBottom: true,
    isDisabled: true,
}

const mainReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_IDS:
            return { ...state, idsOfNewStories: action.ids }
        case SET_STORIES:
            return {
                ...state, stories: state.stories.length < 100
                    ? [...state.stories, ...action.stories]
                    : action.stories
            }
        case TOGGLE_PRELOADER:
            return { ...state, isPreloaded: action.isPreloaded }
        case TOGGLE_PRELOADER_BOTTOM:
            return { ...state, isPreloadedBottom: action.isPreloadedBottom }
        case TOGGLE_DISABLE:
            return { ...state, isDisabled: action.isDisabled }
        default: return state
    }
}

export const setIds = (ids) => ({
    type: SET_IDS,
    ids
})
export const setStories = (stories) => ({
    type: SET_STORIES,
    stories
})
export const togglePreloader = (isPreloaded) => ({
    type: TOGGLE_PRELOADER,
    isPreloaded
})
export const togglePreloaderBottom = (isPreloadedBottom) => ({
    type: TOGGLE_PRELOADER_BOTTOM,
    isPreloadedBottom
})
export const toggleDisable = (isDisabled) => ({
    type: TOGGLE_DISABLE,
    isDisabled
})

export const requestIds = () => async (dispatch) => {
    const response = await API.getIdsOfNewStories();
    dispatch(setIds(response.data));
}
const requestStoriesPattern = async (ids, dispatch, API, denominator) => {
    dispatch(toggleDisable(true));
    let i = 0;
    let chunk = [];
    await dispatch(requestIds());
    while (i < 100) {
        const response = await API.getItem(ids[i]);
        chunk.push(response.data);
        if (chunk.length % denominator === 0) {
            dispatch(setStories(chunk));
            denominator === 10 && dispatch(togglePreloader(false)); 
            chunk = [];
        }
        i++
    }
    dispatch(toggleDisable(false));
    dispatch(togglePreloaderBottom(false));
}
export const requestStories = (ids) => async (dispatch) => {
    dispatch(togglePreloader(true));
    dispatch(togglePreloaderBottom(true));
    requestStoriesPattern(ids, dispatch, API, 10);  
}
export const reloadStories = (ids) => async (dispatch) => {
    requestStoriesPattern(ids, dispatch, API, 100);  
}

export default mainReducer;