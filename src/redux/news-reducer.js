import { API } from "../api/api";

const SET_ITEMS = 'NEWS-REDUCER/SET_ITEMS';
const TOGGLE_PRELOADER = 'NEWS_REDUCER/TOGGLE_PRELOADER';
const TOGGLE_DISABLE = 'NEWS_REDUCER/TOGGLE_DISABLE';
const ADD_KIDS = 'NEWS_REDUCER/ADD_KID';


// const SET_CHUNK = 'NEWS-REDUCER/SET_CHUNK'

const initialState = {
    items: [],
    isPreloaded: true,
    isDisabled: true
}
const newsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ITEMS:
            return {
                ...state, items: [...action.item]
                // ...state, items: state.items.length !== 0 && action.item.type === 'story'
                //     ? [action.item]
                //     : [...state.items, action.item]
            }
        case ADD_KIDS:
            return {
                ...state, items: state.items.map(item => item.id === +action.id
                    ? { ...item, childrens: [...action.chunk] }
                    : item)
            }
        case TOGGLE_PRELOADER:
            return { ...state, isPreloaded: action.isPreloaded }
        case TOGGLE_DISABLE:
            return { ...state, isDisabled: action.isDisabled }
        default: return state
    }
}

const setItems = (item) => ({
    type: SET_ITEMS,
    item
})
const addKids = (chunk, id) => ({
    type: ADD_KIDS,
    chunk,
    id
})
const togglePreloader = (isPreloaded) => ({
    type: TOGGLE_PRELOADER,
    isPreloaded
})
const toggleDisable = (isDisabled) => ({
    type: TOGGLE_DISABLE,
    isDisabled
})


let chunkOfItems = [] // global
export const reloadItems = (id) => async (dispatch) => {
    dispatch(toggleDisable(true));
    const response = await API.getItem(id);
    // dispatch(setItems(response.data))
    chunkOfItems.push(response.data);
    if (response.data && response.data.kids) {
        for (let i = 0; i < response.data.kids.length; i++) {
            await dispatch(reloadItems(response.data.kids[i])); // первым получаю story, дальше идут comments
        }
    }
    dispatch(toggleDisable(false));
}
export const requestItems = (id) => async (dispatch) => {
    debugger
    await dispatch(reloadItems(id));
    dispatch(setItems(chunkOfItems));
    chunkOfItems = [];
    dispatch(togglePreloader(false));
}
export const requestMainKids = (id, items) => async (dispatch) => {
    dispatch(togglePreloader(true));
    //let chunkOfKids = [];
    //const response = await API.getItem(id);
    debugger
    await dispatch(requestItems(id)); //стирает childrensov
    // if (response.data && response.data.kids) {
    //     for (let i = 0; i < response.data.kids.length; i++) {
    //         items.forEach(item => item.id === response.data.kids[i] && chunkOfKids.push(item));
    //     }
    //     dispatch(addKids(chunkOfKids, id));
    // }
}
export const requestKids = (id, items) => async (dispatch) => {
    let chunkOfKids = [];
    debugger
    const response = await API.getItem(id);
    if (response.data && response.data.kids) {
        debugger
        for (let i = 0; i < response.data.kids.length; i++) {
            items.forEach(item => item.id === response.data.kids[i] && chunkOfKids.push(item));
        }
        dispatch(addKids(chunkOfKids, id));
    }
}
export const requestAllKids = (id, items) => async (dispatch) => {
    debugger
     await dispatch(requestItems(id)) ///////// hz //стирает childrensov
     await dispatch(requestKids(id, items))
 }
export const setEmptyChildrens = (id) => (dispatch) => {
    let emptyChunk = [];
    dispatch(addKids(emptyChunk, id));
}


export default newsReducer;