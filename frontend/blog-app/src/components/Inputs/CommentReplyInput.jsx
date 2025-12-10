import React, { useState } from 'react'
import { LuLoaderCircle, LuReply, LuSend, LuWandSparkles } from 'react-icons/lu'
import Input from '@/Input'
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';

const CommentReplyInput = ({
    user,
    authorName,
    content,
    replyText,
    setReplyText,
    handleAddReply,
    handleCancelReply,
    disableAutoGen,
    type='reply'
}) => {
    const [loading, setLoading] = useState(false);

    const generateReply = async () => {
        setLoading(true);

        try {
            const aiResponse = await axiosInstance.post(
                API_PATHS.AI.GENERATE_COMMENT_REPLY,
                {
                    author: {name:authorName},
                    content,
                }
            );
            const generatedReply =aiResponse.data;

            if(generatedReply?.length > 0) {
                setReplyText(generatedReply);
            }
        }
        catch(error) {
            console.log("Something went wrong. Please try again.",error);
        }
        finally {
            setLoading(false);
        }
    }
  return (
    <div>CommentReplyInput</div>
  )
}

export default CommentReplyInput