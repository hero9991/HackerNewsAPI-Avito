import React from 'react';
import c from './Main.module.css';
import { NavLink } from 'react-router-dom';
import { getDateOfStory } from '../../utils/getDate';
import preloaderBottom from '../../assets/preloader-bottom.gif';

const Main = ({ stories, reloadStories, idsOfNewStories, isDisabled, isPreloadedBottom }) => {
    if (stories.length < 1) return null
    return <div className={c.main}>
        <button className={c.button + ' ' + (isDisabled && c.disabled_button)} disabled={isDisabled} onClick={() => reloadStories(idsOfNewStories)}>
            {isDisabled ? 'The page is updating...' : 'Update'}
        </button>
        <div className={c.items}>
            {stories.map(newsItem => (newsItem && !newsItem.deleted) ? <NavLink className={c.item} to={newsItem ? `/News/${newsItem.id}` : '/News'} key={newsItem.id}>
                <div className={c.text}>
                    <div className={c.title}>{newsItem.title}</div>
                    <div className={c.bottom}>
                        <div className={c.time}>{getDateOfStory(newsItem.time)}</div>
                        <div className={c.author}>author: <span>{newsItem.by}</span></div>
                    </div>
                </div>
                <div className={c.score}><span className={c.score__num}>{newsItem.score}</span><span className={c.score__text}>score</span></div>
            </NavLink> : null)}

        </div>
        {isPreloadedBottom && <img className='preloader__bottom' src={preloaderBottom} alt='' />}
    </div>
}

export default Main;