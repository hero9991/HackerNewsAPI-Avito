import mainReducer, { setIds, setStories, togglePreloader, toggleDisable, togglePreloaderBottom } from './main-reducer'

const state = {
    idsOfNewStories: [],
    stories: [],
    isPreloaded: true,
    isPreloadedBottom: true,
    isDisabled: true,
}

it('ids should be setted', () => {
    let action = setIds([44, 55, 66])
    let newState = mainReducer(state, action)
    expect(newState.idsOfNewStories.length).toBe(3)
})
it('stories should be setted if length is greater then 100', () => {
    state.stories = [{}, {}, {}] 
    let action = setStories([{}])
    let newState = mainReducer(state, action)
    expect(newState.stories.length).toBe(4)
})
it('preloader should return bollean', () => {
    let action = togglePreloader(true)
    let newState = mainReducer(state, action)
    expect(newState.isPreloaded).toBe(true) 
})
it('bottom preloader should return bollean', () => {
    let action = togglePreloaderBottom(true)
    let newState = mainReducer(state, action) 
    expect(newState.isPreloadedBottom).not.toBe(false) 
})
it('disable should return bollean', () => {
    let action = toggleDisable(true)
    let newState = mainReducer(state, action)
    expect(newState.isDisabled).toBe(true) 
}) 
  

