import { API } from "../api/api";

const SET_ITEMS = 'NEWS-REDUCER/SET_ITEMS';
const SET_CHUNK = 'NEWS-REDUCER/SET_CHUNK'
const TOGGLE_PRELOADER = 'NEWS_REDUCER/TOGGLE_PRELOADER';
const TOGGLE_PRELOADER_BOTTOM = 'NEWS_REDUCER/TOGGLE_PRELOADER_BOTTOM';
const TOGGLE_DISABLE = 'NEWS_REDUCER/TOGGLE_DISABLE';
const ADD_KIDS = 'NEWS_REDUCER/ADD_KID';


// const SET_CHUNK = 'NEWS-REDUCER/SET_CHUNK'

const initialState = {
    items: [],
    isPreloaded: true,
    isPreloadedBottom: false,
    isDisabled: true,
}
const newsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ITEMS:
            return {
                ...state, items: state.items.length !== 0 && action.item.type === 'story'
                    ? [action.item]
                    : [...state.items, action.item]
            }
        case SET_CHUNK:
            return { ...state, items: [...action.chunk] }
        case ADD_KIDS:
            return {
                ...state, items: state.items.map(item => item.id === +action.id
                    ? { ...item, childrens: [...action.chunk] }
                    : item)
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

export const setItems = (item) => ({
    type: SET_ITEMS,
    item
})
export const setChunkOfItems = (chunk) => ({
    type: SET_CHUNK,
    chunk
})
export const addKids = (chunk, id) => ({
    type: ADD_KIDS,
    chunk,
    id
})
export const togglePreloaderBottom = (isPreloadedBottom) => ({
    type: TOGGLE_PRELOADER_BOTTOM,
    isPreloadedBottom
})
export const togglePreloader = (isPreloaded) => ({
    type: TOGGLE_PRELOADER,
    isPreloaded
})
export const toggleDisable = (isDisabled) => ({
    type: TOGGLE_DISABLE,
    isDisabled
})


let chunkOfItems = []
export const requestItemsByItem = (id) => async (dispatch) => {
    dispatch(togglePreloaderBottom(true));
    dispatch(toggleDisable(true));
    const response = await API.getItem(id);
    dispatch(setItems(response.data))
    response.data.type === 'story' && dispatch(togglePreloader(false));
    if (response.data && response.data.kids) {
        for (let i = 0; i < response.data.kids.length; i++) {
            await dispatch(requestItemsByItem(response.data.kids[i]));
        }
    }
    dispatch(toggleDisable(false));
    dispatch(togglePreloaderBottom(false));
}
export const requestItemsByChunk = (id) => async (dispatch) => {
    dispatch(toggleDisable(true));
    const response = await API.getItem(id);
    chunkOfItems.push(response.data);
    if (response.data && response.data.kids) {
        for (let i = 0; i < response.data.kids.length; i++) {
            await dispatch(requestItemsByChunk(response.data.kids[i]));
        }
    }
    dispatch(toggleDisable(false));
}
export const requestItemsForReload = (id) => async (dispatch) => {
    await dispatch(requestItemsByChunk(id));
    dispatch(setChunkOfItems(chunkOfItems));
    chunkOfItems = [];
}
export const requestMainKids = (id, items) => async (dispatch) => {
    dispatch(togglePreloader(true));
    await dispatch(requestItemsByItem(id)); //стирает childrensov
}
export const requestKids = (id, items) => async (dispatch) => {
    let chunkOfKids = [];
    const response = await API.getItem(id);
    if (response.data && response.data.kids) {
        for (let i = 0; i < response.data.kids.length; i++) {
            items.forEach(item => item.id === response.data.kids[i] && chunkOfKids.push(item));
        }
        dispatch(addKids(chunkOfKids, id));
    }
}
export const requestAllKids = (id, items) => async (dispatch) => {
    await dispatch(requestItemsForReload(id)) //стирает childrensov
    await dispatch(requestKids(id, items))
}
export const setEmptyChildrens = (id) => (dispatch) => {
    let emptyChunk = [];
    dispatch(addKids(emptyChunk, id));
}


export default newsReducer;