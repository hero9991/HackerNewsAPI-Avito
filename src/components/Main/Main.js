import React from 'react';
import c from './Main.module.css';
import { NavLink } from 'react-router-dom';
import { getDateOfStory } from '../../utils/getDate';
import preloader1 from '../../assets/preloader1.gif';

const Main = ({ stories, reloadStories, idsOfNewStories, isDisabled, isPreloadedBottom }) => {
    if (stories.length < 1) return null
    return <div className={c.main}>
        <button className={c.button + ' ' + (isDisabled && c.disabled_button)} disabled={isDisabled} onClick={() => reloadStories(idsOfNewStories)}>
            {isDisabled ? 'The page is updating...' : 'Update'}
        </button>
        <div className={c.news__items}>
            {stories.map(newsItem => newsItem ? <NavLink className={c.news__item} to={newsItem ? `/News/${newsItem.id}` : '/News'} key={newsItem.id}><div className={c.news__text}>
                <div className={c.news__title}>{newsItem.title}</div>
                <div className={c.news__bottom}>
                    <div className={c.news__time}>{getDateOfStory(newsItem.time)}</div>
                    <div className={c.news__author}>author: <span>{newsItem.by}</span></div>
                </div>
            </div>
                <div className={c.news__score}><span className={c.news__scoreN}>{newsItem.score}</span><span className={c.news__scoreL}>score</span></div>
            </NavLink> : null)}

        </div>
        {isPreloadedBottom && <img className={c.preloader__bottom} src={preloader1} alt=''/>}
    </div>
}

export default Main;