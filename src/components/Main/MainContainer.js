import React, { useEffect } from 'react';
import Main from './Main';
import { connect } from 'react-redux';
import { requestIds, requestStories, reloadStories } from '../../redux/main-reducer';
import { getIds, getStories, getIsPreloaded, getIsPreloadedBottom, getIsDisabled } from '../../redux/main-selectors';
import preloader from '../../assets/preloader.gif';

const MainContainer = ({ requestIds, requestStories, reloadStories, idsOfNewStories,
    stories, isPreloaded, isDisabled, isPreloadedBottom }) => {
    useEffect(() => {
        if (idsOfNewStories.length === 0) requestIds();
        if (idsOfNewStories.length > 100 && stories.length === 0) requestStories(idsOfNewStories);
        if (stories.length > 0) reloadStories(idsOfNewStories)
    }, [requestIds, requestStories, idsOfNewStories.length])
    useEffect(() => {
        const interval = setInterval(() => {
            if (idsOfNewStories.length > 100) {
                reloadStories(idsOfNewStories);  //PROVERIT
            }
        }, 60000)
        return () => clearInterval(interval);
    }, [idsOfNewStories.length])

    if (isPreloaded) return <img className='preloader' src={preloader} alt='' />
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