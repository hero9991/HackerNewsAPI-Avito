import React, { useEffect, useState } from 'react';
import News from './News';
import { setEmptyChildrens, requestItems, requestKids, requestFirstKids, reloadPage } from '../../redux/news-reducer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getItems } from '../../redux/news-selectors';
import { getIsPreloaded, getIsPreloadedBottom, getIsDisabled } from '../../redux/news-selectors';
import mainPreloader from '../../assets/main-preloader.gif';
import { compose } from 'redux';

const NewsContainer = ({ reloadPage, requestFirstKids, requestItems, setEmptyChildrens, items,
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

    useEffect(() => {
        requestItems(props.match.params.id);
    }, [])
    useEffect(() => {
        const interval = setTimeout(async () => {
            if(isDisabled) return null
            await reloadPage(props.match.params.id, items); 
           // setIsClicked({})  create my own useEffect
        }, 20000)
        return () => clearTimeout(interval)
    }, [items.length, isDisabled, JSON.stringify(items)])
    useEffect(() => {
        items.length !== 0 && requestKids(props.match.params.id, items); //check it
    }, [items.length, items.length && items[0].childrens && items[0].childrens.length, props.match.params.id])

    return isPreloaded
        ? <img className='preloader' src={mainPreloader} alt='' />
        : <News items={items} isPreloaded={isPreloaded} reloadPage={reloadPage}
        requestFirstKids={requestFirstKids} idOfStory={props.match.params.id} isDisabled={isDisabled} addChildrens={addChildrens} isClicked={isClicked} setIsClicked={setIsClicked} isPreloadedBottom={isPreloadedBottom} />
}


const mapStateToProps = (state) => ({
    items: getItems(state),
    isPreloaded: getIsPreloaded(state),
    isPreloadedBottom: getIsPreloadedBottom(state),
    isDisabled: getIsDisabled(state)
})

export default compose(
    connect(mapStateToProps, { reloadPage, requestFirstKids, requestItems, setEmptyChildrens, requestKids }),
    withRouter
)(NewsContainer);
