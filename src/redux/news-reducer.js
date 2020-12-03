import { API } from "../api/api";

const SET_ITEM = 'NEWS-REDUCER/SET_ITEM';
const SET_CHUNK = 'NEWS-REDUCER/SET_CHUNK'
const TOGGLE_PRELOADER = 'NEWS_REDUCER/TOGGLE_PRELOADER';
const TOGGLE_PRELOADER_BOTTOM = 'NEWS_REDUCER/TOGGLE_PRELOADER_BOTTOM';
const TOGGLE_DISABLE = 'NEWS_REDUCER/TOGGLE_DISABLE';
const ADD_KIDS = 'NEWS_REDUCER/ADD_KID';
const RELOAD = 'NEWS_REDUCER/RELOAD'


const initialState = {
    items: [],
    isPreloaded: true,
    isPreloadedBottom: false,
    isDisabled: true,
}
const newsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ITEM:
            return {
                ...state, items: state.items.length !== 0 && action.item.type === 'story'
                    ? [action.item]
                    : [...state.items, action.item]
            }
        case SET_CHUNK:
            return { ...state, items: action.chunk }
        case ADD_KIDS:
            return {
                ...state, items: state.items.map(item => item.id === +action.id
                    ? { ...item, childrens: action.chunk }
                    : { ...item })
            }
        case RELOAD:
            return { ...state, items: action.items }
        case TOGGLE_PRELOADER:
            return { ...state, isPreloaded: action.isPreloaded }
        case TOGGLE_PRELOADER_BOTTOM:
            return { ...state, isPreloadedBottom: action.isPreloadedBottom }
        case TOGGLE_DISABLE:
            return { ...state, isDisabled: action.isDisabled }

        default: return state
    }
}

export const setItem = (item) => ({
    type: SET_ITEM,
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
export const reload = (items) => ({
    type: RELOAD,
    items
})

let chunkOfItems = []

export const requestItems = (id) => async (dispatch) => {
    dispatch(togglePreloader(true));
    dispatch(togglePreloaderBottom(true));
    dispatch(toggleDisable(true));
    await dispatch(requestItemsByItem(id)); 
    dispatch(toggleDisable(false));
    dispatch(togglePreloaderBottom(false));
}
const callRecursiveRequest = async (response, dispatch, recursiveRequest) => {
    if (response.data && response.data.kids) {
        for (let i = 0; i < response.data.kids.length; i++) {
            await dispatch(recursiveRequest(response.data.kids[i]));
        }
    }
}
const requestItemsByItem = (id) => async (dispatch) => {
    const response = await API.getItem(id);
    dispatch(setItem(response.data))
    response.data.type === 'story' && dispatch(togglePreloader(false));
    await callRecursiveRequest(response, dispatch, requestItemsByItem)
}
const requestItemsByChunk = (id) => async (dispatch) => {
    const response = await API.getItem(id);
    chunkOfItems.push(response.data);
    await callRecursiveRequest(response, dispatch, requestItemsByChunk)
}
const addKidsInChunk = (response, chunkOfKids, items) => {
    for (let i = 0; i < response.data.kids.length; i++) {
        items.forEach(item => item.id === response.data.kids[i] && chunkOfKids.push(item));
    }
}
export const requestKids = (id, items) => async (dispatch) => {
    let chunkOfKids = [];
    const response = await API.getItem(id);
    if (response.data && response.data.kids) {
        addKidsInChunk(response, chunkOfKids, items);
        dispatch(addKids(chunkOfKids, id));
    }
}
export const setEmptyChildrens = (id) => (dispatch) => {
    let emptyChunk = [];
    dispatch(addKids(emptyChunk, id));
}
const requestForReload = (id, items, idOfParents) => async (dispatch) => {
    let chunkOfKids = [];
    const response = await API.getItem(id);
    if (response.data && response.data.kids) {
        addKidsInChunk(response, chunkOfKids, items);
        id === idOfParents[0] && await dispatch(requestItemsByChunk(id));
        chunkOfItems.forEach(item => { if (item.id === +id) item.childrens = chunkOfKids });
    }
}
export const reloadPage = (id, items) => async (dispatch) => {
    dispatch(toggleDisable(true));
    if (!items[0].childrens) {
        setTimeout(() => dispatch(toggleDisable(false)), 500
        )
        return null
    }
    const idOfParents = [id];
    items.forEach(item => item.childrens && item.childrens.length > 0 && item.type !== 'story' && idOfParents.push(item.id));
    for (let i = 0; i < idOfParents.length; i++) await dispatch(requestForReload(idOfParents[i], items, idOfParents));
    dispatch(reload(chunkOfItems));
    chunkOfItems = [];
    dispatch(toggleDisable(false));
}

export default newsReducer;






// export const requestFirstKids = (id, items) => async (dispatch) => {
//     dispatch(toggleDisable(true))
//     let chunkOfKids = [];
//     const response = await API.getItem(id);
//     if (response.data && response.data.kids) {
//         for (let i = 0; i < response.data.kids.length; i++) {
//             items.forEach(item => item.id === response.data.kids[i] && chunkOfKids.push(item));
//         }
//         await dispatch(requestItemsByChunk(id))
//         chunkOfItems[0].childrens = chunkOfKids;
//         dispatch(reload(chunkOfItems))
//         chunkOfItems = []
//     }
//     dispatch(toggleDisable(false))
// }