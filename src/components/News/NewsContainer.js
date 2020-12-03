import React, { useEffect, useState } from 'react';
import News from './News';
import { setEmptyChildrens, requestItems, requestKids, reloadPage } from '../../redux/news-reducer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getItems } from '../../redux/news-selectors';
import { getIsPreloaded, getIsPreloadedBottom, getIsDisabled } from '../../redux/news-selectors';
import mainPreloader from '../../assets/main-preloader.gif';
import { compose } from 'redux';

const NewsContainer = ({ reloadPage, requestItems, setEmptyChildrens, items,
    isPreloaded, isDisabled, requestKids, isPreloadedBottom, ...props }) => {

    const [isClicked, setIsClicked] = useState({});
    const addChildrens = async (id, items, isDisabled) => {
        if (isDisabled) return null
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

    useEffect(() => {
        requestItems(props.match.params.id);
    }, [props.match.params.id, requestItems])
    useEffect(() => {
        const interval = setTimeout(() => {
            if (isDisabled) return null
            reloadPage(props.match.params.id, items);
        }, 60000)
        return () => clearTimeout(interval)
    }, [items.length, isDisabled, JSON.stringify(items), props.match.params.id, reloadPage])
    useEffect(() => {
        items.length !== 0 && requestKids(props.match.params.id, items); 
    }, [items.length, props.match.params.id, requestKids])

    return isPreloaded
        ? <img className='preloader' src={mainPreloader} alt='' />
        : <News items={items} isPreloaded={isPreloaded} reloadPage={reloadPage} idOfStory={props.match.params.id}
            isDisabled={isDisabled} addChildrens={addChildrens} isClicked={isClicked} isPreloadedBottom={isPreloadedBottom} />
}


const mapStateToProps = (state) => ({
    items: getItems(state),
    isPreloaded: getIsPreloaded(state),
    isPreloadedBottom: getIsPreloadedBottom(state),
    isDisabled: getIsDisabled(state)
})

export default compose(
    connect(mapStateToProps, { reloadPage, requestItems, setEmptyChildrens, requestKids }),
    withRouter
)(NewsContainer);
