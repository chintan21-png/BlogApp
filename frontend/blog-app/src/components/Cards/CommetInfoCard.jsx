import React from 'react'
import { LuChevronDown, LuDot, LuReply, LuTrah2 } from 'react-icons/lu';
import { UserContext } from '@/context/userContext';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { useState } from 'react';
import { comment } from '@uiw/react-md-editor';
import moment from 'moment';

const CommetInfoCard = ({
    commentId,
    authorName,
    authorPhoto,
    content,
    updatedOn,
    post,
    replies,
    getAllComments,
    onDelete,
    isSubReply
}) => {
    const {user} = useContext(UserContext);
    const [replyText, setReplyText] = useState("")
    
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showSubReplies, setShowSubReplies] = useState(false);

    //Handles canceling a reply
    const handleCancelReply = () => {
        setReplyText("");
        setShowReplyForm(false);
    };

    //Add Reply
    const handleAddReply = async() => {

    };
  return (
    <div className={`bg-white p-3 rounded-lg cursor-pointer group ${isSubReply ? 'mb-1' : 'mb-4'}`}>
        <div className=''>
            <div className=''>
                <div className=''>
                    <img
                        src={authorPhoto}
                        alt={authorName}
                        className=''
                    ></img>
                    <div className=''>
                        <div className=''>
                            <h3 className=''>
                                @{authorName}
                            </h3>
                            <LuDot className=''/>
                            <span className=''>
                                {updatedOn}
                            </span>
                        </div>
                        <p className=''>{content}</p>
                        <div className=''>
                            {!isSubReply && (
                                <>
                                    <button
                                        className=''
                                        onClick={() => setShowReplyForm((prevState) => !prevState)}
                                    >
                                        <LuReply /> Reply
                                    </button>
                                    <button
                                        className=''
                                        onClick={() => setShowSubReplies((prevState) => !prevState)}
                                    >
                                        {replies?.length || 0}{" "}
                                        {replies?.length == 1 ? "reply" : "replies"}{" "}
                                        <LuChevronDown 
                                            className={`${showSubReplies ? "rotate-180" : ""}`}
                                        />
                                    </button>{" "}
                                </>
                            )}
                            <button className='' onClick={() => onDelete()}>
                                <LuTrah2 /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {!isSubReply && (
                <div className=''>
                    <img 
                        src={post?.coverImageUrl}
                        alt='post cover'
                        className=''
                    ></img>
                    <div className=''>
                        <div className=''>
                            <h4 className=''>
                                {post?.title}
                            </h4>
                        </div>
                    </div>
                </div>
            )}
        </div>
        {!isSubReply && showReplyForm && (
            <></>
        )}

        {showSubReplies && 
            replies?.length > 0 &&
            replies.map((comment, index) => (
                <div key={comment._id} className={`ml-5 ${index == 0 ? "mt-5" : ""}`}>
                    <CommetInfoCard 
                        authorName={comment.author.name}
                        authorPhoto={comment.author.profileImageUrl}
                        content={comment.content}
                        post={comment.post}
                        replies={comment.replies || []}
                        isSubReply
                        updatedOn={
                            comment.updatedAt
                                ? moment(comment.updatedAt).format("Do MMM YYYY")
                                : "-"
                        }
                        onDelete={() => onDelete(comment._id)}
                    />
                </div>
            ))
        }
    </div>
  )
}

export default CommetInfoCard