import React, { useState } from 'react';
import c from './News.module.css';
import { NavLink } from 'react-router-dom';
import { getDateOfStory } from '../../utils/getDate';
import Comments from './Comments/Comments';

const News = ({ items, isPreloaded, isDisabled, idOfStory, requestAllKids, isClicked, addChildrens, setIsClicked }) => {

    if (items.length < 1) return null
    return <div className={c.news}>
        <div className={c.top}>
            <div className={c.text__wrapper}>
                <button disabled={isDisabled} className={c.button + ' ' + (isDisabled && c.disabled_button)}
                    onClick={async () => {
                        await requestAllKids(idOfStory, items);
                        setIsClicked({})
                    }}>
                    {isDisabled ? 'страница обновляется...' : 'обновить'}
                </button>
                <span className={c.link}><NavLink to='/Main'>Список новостей</NavLink></span>
                <span className={c.link}>{items[0] && <a href={items[0].url}>Ссылка на новость</a>}</span>
                {items.length > 0 && (items[0].title ? <span>Название: <span className={c.title}>{items[0].title}</span> </span> : <span>DELETED</span>)}
                {items.length > 0 && <span>Дата публикации: <span className={c.data}>{getDateOfStory(items[0].time)}</span></span>}
                {items.length > 0 && (items[0].by ? <span>Автор: <span className={c.author}>{items[0].by}</span></span> : <span>DELETED</span>)}
                {items.length > 0 && <span>Колличество комментариев: <span className={c.count}>{items.length - 1}</span></span>}
            </div>
        </div>
        <Comments items={items} isPreloaded={isPreloaded} addChildrens={addChildrens} isClicked={isClicked} />
    </div>
}

export default News;