import React, { useEffect, useState } from 'react';
import News from './News';
import { setEmptyChildrens, requestMainKids, requestKids, requestAllKids } from '../../redux/news-reducer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getItems } from '../../redux/news-selectors';
import { getIsPreloaded, getIsDisabled } from '../../redux/news-selectors';
import preloader from '../../assets/preloader.gif';
import { compose } from 'redux';

const NewsContainer = ({ requestMainKids, setEmptyChildrens, items,
    isPreloaded, isDisabled, requestKids, requestAllKids, ...props }) => {

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
        requestMainKids(props.match.params.id, items);
    }, [])
    useEffect(() => {
        const interval = setInterval(async() => {
            await requestAllKids(props.match.params.id, items);  //// PROBLEMS!!!!
            setIsClicked({})
        }, 6000000)
        return () => clearInterval(interval)
    }, [items.length])
    useEffect(() => {
        items.length !== 0 && requestKids(props.match.params.id, items);
    }, [items.length, items.length && items[0].childrens && items[0].childrens.length, props.match.params.id])

    return isPreloaded
        ? <img className='preloader' src={preloader} alt='' />
        : <News items={items} isPreloaded={isPreloaded} 
            idOfStory={props.match.params.id} isDisabled={isDisabled} requestAllKids={requestAllKids} addChildrens={addChildrens} isClicked={isClicked} setIsClicked={setIsClicked}/>
}


const mapStateToProps = (state) => ({
    items: getItems(state),
    isPreloaded: getIsPreloaded(state),
    isDisabled: getIsDisabled(state)
})

export default compose(
    connect(mapStateToProps, { requestMainKids, setEmptyChildrens, requestKids, requestAllKids }),
    withRouter
)(NewsContainer);
