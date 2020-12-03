import React from 'react';
import c from './Comments.module.css';
import { getDiffOfDate } from '../../../utils/getDate';
import preloaderBottom from '../../../assets/preloader-bottom-news.gif'

const Comments = ({ items, isPreloaded, isClicked, addChildrens, isPreloadedBottom, isDisabled}) => {
    if (isPreloaded || !items[0] || !items[0].kids || !items[0].childrens) return null
    return <div className={c.wrapper}>
        <div className={c.title}><h2>Comments</h2></div>
        <ActiveComment addChildrens={addChildrens} items={items} comments={items[0].childrens} isClicked={isClicked} isDisabled={isDisabled}/>
        {isPreloadedBottom && <img className='preloader__bottom-news' src={preloaderBottom} alt='' />}
    </div>
}

const ActiveComment = ({ comments, addChildrens, items, isClicked, isDisabled }) => {
    let copyOfComments = comments.slice()
    return copyOfComments.sort((a, b) => b.time - a.time).map(comment => (
        <div className={c.comment__wrapper} key={comment.id}>
            <div className={c.top}><span className={c.author}>{comment.by}</span><span className={c.time}>{getDiffOfDate(comment.time)}</span></div>

            <div className={(comment.kids && c.comment__parent) + ' ' + (comment.parent === items[0].id ? c.comment__initial : c.comment__low) + ' '
                + (isClicked[comment.id] && comment.kids && c.comment__clicked) + ' ' + (comment.kids && isDisabled && c.comment__disabled)}
                disabled={true} onClick={() => { addChildrens(comment.id, items, isDisabled) }} key={comment.id}
                dangerouslySetInnerHTML={{ __html: comment.text ? comment.text : 'Comment deleted' }} />

            {items.map(item => {
                if (item.id === comment.id && item.childrens) return <ActiveComment
                    addChildrens={addChildrens} items={items} comments={item.childrens} isClicked={isClicked} key={item.id} isDisabled={isDisabled}/>
            })}
        </div>
    ))
}



export default Comments;