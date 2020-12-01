const { default: newsReducer, toggleDisable, togglePreloaderBottom, togglePreloader, setChunkOfItems, addKids, setItems } = require("./news-reducer")
 
const state = {
    items: [],
    isPreloaded: true,
    isPreloadedBottom: false,
    isDisabled: true,
}
it('preloader should return right bollean', () => {
    let action = togglePreloader(true)
    let newState = newsReducer(state, action)
    expect(newState.isPreloaded).toBe(true)
})
it('bottom preloader should return right bollean', () => {
    let action = togglePreloaderBottom(true)
    let newState = newsReducer(state, action)
    expect(newState.isPreloadedBottom).not.toBe(false)
})
it('disable should return right bollean', () => {
    let action = toggleDisable(true)
    let newState = newsReducer(state, action)
    expect(newState.isDisabled).toBe(true)
})
it('chunk should be setted', () => {
    let action = setChunkOfItems([{}, {}])
    let newState = newsReducer(state, action)
    expect(newState.items.length).toBe(2)
})
it('childrens should be added for certain id', () => {
    let action = addKids([{}, {}, {}], 5)
    state.items = [{ id: 1 }, { id: 5 }]
    let newState = newsReducer(state, action)
    expect(newState.items).toEqual([{ id: 1 }, { childrens: [{}, {}, {}], id: 5 }])
})
it('item should be added', () => {
    let action = setItems({id:6})
    state.items = [{ id: 1 }, { id: 5 }]
    let newState = newsReducer(state, action)
    expect(newState.items).toEqual([{ id: 1 }, { id: 5 }, {id:6}])
})
it('story should replace items', () => {
    let action = setItems({type:'story'})
    state.items = [{ id: 1 }, { id: 5 }]
    let newState = newsReducer(state, action) 
    expect(newState.items).toEqual([{type:'story'}])
})
 

