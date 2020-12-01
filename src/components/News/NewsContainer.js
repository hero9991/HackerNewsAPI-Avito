import React, { useEffect, useState } from 'react';
import News from './News';
import { setEmptyChildrens, requestMainKids, requestKids, requestFirstKids } from '../../redux/news-reducer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getItems } from '../../redux/news-selectors';
import { getIsPreloaded, getIsPreloadedBottom, getIsDisabled } from '../../redux/news-selectors';
import mainPreloader from '../../assets/main-preloader.gif';
import { compose } from 'redux';

const NewsContainer = ({ requestFirstKids, requestMainKids, setEmptyChildrens, items,
    isPreloaded, isDisabled, requestKids, isPreloadedBottom, ...props }) => {

    const [isClicked, setIsClicked] = useState({});
    const addChildrens = async (id, items) => {
        const stateForClick = {};
        if (isClicked[id]) {
            setEmptyChildrens(id);
            stateForClick[id] = false;
            setIsClicked({ ...isClicked, ...stateForClick });
        } else {
            await requestKids(id, items);
            stateForClick[id] = true;
            setIsClicked({ ...isClicked, ...stateForClick });
        }
    }
//// pidumat naschet isdisable
    useEffect(() => {
        requestMainKids(props.match.params.id, items);
    }, [])
    useEffect(() => {
        const interval = setInterval(async () => {
            debugger
            if(isDisabled) return null
            await requestFirstKids(props.match.params.id, items);  //// PROBLEMS!!!!
            setIsClicked({})
        }, 60000)
        return () => clearInterval(interval)
    }, [items.length, isDisabled])
    useEffect(() => {
        items.length !== 0 && requestKids(props.match.params.id, items);
    }, [items.length, items.length && items[0].childrens && items[0].childrens.length, props.match.params.id])

    return isPreloaded
        ? <img className='preloader' src={mainPreloader} alt='' />
        : <News items={items} isPreloaded={isPreloaded}
        requestFirstKids={requestFirstKids} idOfStory={props.match.params.id} isDisabled={isDisabled} addChildrens={addChildrens} isClicked={isClicked} setIsClicked={setIsClicked} isPreloadedBottom={isPreloadedBottom} />
}


const mapStateToProps = (state) => ({
    items: getItems(state),
    isPreloaded: getIsPreloaded(state),
    isPreloadedBottom: getIsPreloadedBottom(state),
    isDisabled: getIsDisabled(state)
})

export default compose(
    connect(mapStateToProps, { requestFirstKids, requestMainKids, setEmptyChildrens, requestKids }),
    withRouter
)(NewsContainer);
