import React from 'react';
import c from './News.module.css';
import { NavLink } from 'react-router-dom';
import { getDateOfStory } from '../../utils/getDate';
import Comments from './Comments/Comments';

const News = ({ items, reloadPage, isPreloaded, isDisabled, idOfStory, isClicked, addChildrens, isPreloadedBottom }) => {
    if (items.length < 1) return null
    if (items[0] && items[0].title && items[0].time && items[0].by) {
        return <div className={c.news}>
            <div className={c.top}>
                <div className={c.text__wrapper}>
                    <button disabled={isDisabled} className={c.button + ' ' + (isDisabled && c.disabled_button)}
                        onClick={async () => {
                            await reloadPage(idOfStory, items);
                            //setIsClicked({});
                        }}>
                        {isDisabled ? 'The page is updating...' : 'Update'}
                    </button>
                    <span className={c.link}><NavLink to='/HackerNewsAPI-Avito'>News list</NavLink></span>
                    {items[0].url && <span className={c.link}>{items[0] && <a href={items[0].url}>Link to the news</a>}</span>}
                    <span>Title: <span className={c.title}>{items[0].title}</span> </span>
                    <span>Publication date: <span className={c.data}>{getDateOfStory(items[0].time)}</span></span>
                    <span>Author: <span className={c.author}>{items[0].by}</span></span>
                    <span>{isDisabled ? 'Count of comments is computing...' : <span>Count of comments: <span className={c.count}>{items.length - 1}</span></span>} </span>
                </div>
            </div>
            <Comments items={items} isPreloaded={isPreloaded} addChildrens={addChildrens} isClicked={isClicked} isPreloadedBottom={isPreloadedBottom} isDisabled={isDisabled}/>
        </div>
    } else return <div className={c.text__wrapper}>
        <span className={c.link}><NavLink to='/HackerNewsAPI-Avito'>News list</NavLink></span>
        <span className={c.delleted}>NEWS DELETED</span>
    </div>
}

export default News;