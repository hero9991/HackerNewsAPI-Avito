import React from 'react';
import c from './Comments.module.css';
import { getDiffOfDate } from '../../../utils/getDate';
import preloader1 from '../../../assets/preloader-bottom-news.gif'

const Comments = ({ items, isPreloaded, isClicked, addChildrens, isPreloadedBottom}) => {


    if (isPreloaded || !items[0] || !items[0].kids || !items[0].childrens) return null
    return <div className={c.wrapper}>
        <div className={c.title}><h1>Comments</h1></div>
        <ActiveComment addChildrens={addChildrens} items={items} comments={items[0].childrens} isClicked={isClicked} />
        {isPreloadedBottom && <img className='preloader__bottom-news' src={preloader1} alt='' />}
    </div>
}

const ActiveComment = ({ comments, addChildrens, items, isClicked }) => {
    let copyOfComments = comments.slice()
    return copyOfComments.sort((a, b) => b.time - a.time).map(comment => (
        <div className={c.comments} key={comment.id}>
            <div className={c.top}><span className={c.author}>{comment.by}</span><span className={c.time}>{getDiffOfDate(comment.time)}</span></div>

            <div className={(comment.kids && c.comment__items) + ' ' + (comment.parent === items[0].id ? c.comment__initial : c.low) + ' '
                + (isClicked[comment.id] && comment.kids ? c.clicked : c.notClicked)}
                disabled={true} onClick={() => { addChildrens(comment.id, items); }} key={comment.id}
                dangerouslySetInnerHTML={{ __html: comment.text ? comment.text : 'COMMENT DELETED' }} />

            {items.map(item => {
                if (item.id === comment.id && item.childrens) return <ActiveComment
                    addChildrens={addChildrens} items={items} comments={item.childrens} isClicked={isClicked} key={item.id} />
            })}
        </div>
    ))
}



export default Comments;