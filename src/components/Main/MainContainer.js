import React, { useEffect } from 'react';
import Main from './Main';
import { connect } from 'react-redux';
import { requestIds, requestStories, reloadStories } from '../../redux/main-reducer';
import { getIds, getStories, getIsPreloaded, getIsPreloadedBottom, getIsDisabled } from '../../redux/main-selectors';
import mainPreloader from '../../assets/main-preloader.gif';

const MainContainer = ({ requestIds, requestStories, reloadStories, idsOfNewStories,
    stories, isPreloaded, isDisabled, isPreloadedBottom }) => {
    useEffect(() => {
        if (idsOfNewStories.length === 0) requestIds();
        if (idsOfNewStories.length > 100 && stories.length === 0) requestStories(idsOfNewStories);
        if (stories.length > 0) reloadStories(idsOfNewStories)
    }, [requestIds, requestStories, idsOfNewStories.length])
    useEffect(() => {
        const interval = setTimeout(() => {
            if (isDisabled) return null
            if (idsOfNewStories.length > 100) {
                reloadStories(idsOfNewStories);  
            }
        }, 60000)
        return () => clearTimeout(interval);
    }, [idsOfNewStories.length, isDisabled])

    if (isPreloaded) return <img className='preloader' src={mainPreloader} alt='' />
    return <Main stories={stories} reloadStories={reloadStories} idsOfNewStories={idsOfNewStories}
        isDisabled={isDisabled} isPreloadedBottom={isPreloadedBottom} />
}

const mapStateToProps = (state) => ({
    idsOfNewStories: getIds(state),
    stories: getStories(state),
    isPreloaded: getIsPreloaded(state),
    isDisabled: getIsDisabled(state),
    isPreloadedBottom: getIsPreloadedBottom(state)
})

export default connect(mapStateToProps, { requestIds, requestStories, reloadStories })(MainContainer);