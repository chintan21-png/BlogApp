import React, { useContext, useEffect, useState } from 'react'
import { LuCircleAlert, LuDot, LuSparkles } from 'react-icons/lu'
import { UserContext } from '@/context/userContext'
import CommentReplyInput from '@/components/Inputs/CommentReplyInput'
import toast from "react-hot-toast"
import TrendingPostsSection from './components/TrendingPostsSection'
import SkeletonLoader from '@/components/Loader/SkeletonLoader'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '@/utils/axiosinstance'
import { API_PATHS } from '@/utils/apiPaths'
import BlogLayout from "@/components/layouts/BlogLayout/BlogLayout";
import moment from 'moment'
const BlogPostView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blogPostData, setBlogPostData] = useState(null);
  const [comments, setComments] = useState(null);

  const {user, setOpenAuthForm} = useContext(UserContext);
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [openSummarizeDrawer, setOpenSummarizeDrawer] = useState(false);
  const [summaryContent, setSummaryContent] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  //Get Post Data By slug
  const fetchPostDetailsBySlug = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_BY_SLUG(slug)
      );

      if(response.data) {
        const data = response.data;
        setBlogPostData(data);
        fetchCommentByPostId(data._id);
        incrementViews(data._id);
      }
    }
    catch(error) {
      console.error("Error:", error);
    }
  };

  //Get Comment by Post ID
  const fetchCommentByPostId = async (postId) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.COMMENTS.GET_ALL_BY_POST(postId)
      );

      if(response.data) {
        const data = response.data;
        setComments(data);
      }
    }
    catch(error) {
      console.error("Error:",error);
    }
  };

  //Generate Blog Post summary
  const generateBlogPostSummary = async () => {

  };

  //Increment views
  const incrementViews = async (postId) => {
    if(!postId) return;
    try {
      const response = await axiosInstance.post(
        API_PATHS.POSTS.INCREMENT_VIEW(postId)
      );
    }
    catch(error) {
      console.error("Error:", error);
    }
  };

  //Handles canceling a reply
  const handleCancelReply = () => {
    setReplyText("");
    setShowReplyForm(false);
  };
  //Add reply

  const handleAddReply = async () => {

  };

  useEffect(() => {
    fetchPostDetailsBySlug();
    return () => {};
  },[slug]);

  return (
    <BlogLayout>
      {blogPostData && (
        <>
          <title>{blogPostData.title}</title>
          <meta name='description' content={blogPostData.title}></meta>
          <meta property='og:title' content={blogPostData.title}></meta>
          <meta property='og:image' content={blogPostData.coverImageUrl}></meta>
          <meta property='og:type' content="article"></meta>
          <div className='grid grid-cols-12 gap-8 relative'>
            <div className='col-span-12 md:col-span-8 relative'>
              <h1 className='text-lg md:text-2xl font-bold mb-2 line-clamp-3'>
                {blogPostData.title}
              </h1>
              <div className='flex items-center gap-1 flex-wrap mt-3 mb-5'>
                <span className='text-[13px] text-gray-500 font-medium'>
                  {moment(blogPostData.updatedAt || "").format("Do MMM YYYY")}
                </span>
                <LuDot className='text-xl text-gray-400'/>

                <div className='flex items-center flex-wrap gap-2'>
                  {blogPostData.tags.slice(0,3).map((tag, index) => (
                    <button
                      key={index}
                      className='bg-sky-200/50 text-sky-800/80 text-xs font-medium px-3 py-0.5 rounded-full text-nowrap cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tag/${tag}`);
                      }}
                    >
                      # {tag}
                    </button>
                  ))}
                </div>
                <LuDot className='text-xl text-gray-400'/>
                <button
                  className='flex items-center gap-2 bg-linear-to-r from-sky-500 to-cyan-400 text-xs text-white font-medium px-3 py-0.5 rounded-full text-nowrap cursor-pointer hover:scale-[1.02] transition-all my-1'
                  onClick={generateBlogPostSummary}
                >
                  <LuSparkles /> Summarize Post
                </button>
              </div>
              <img
                src={blogPostData.coverImageUrl || ""}
                alt={blogPostData.title}
                className='w-full h-96  object-cover mb-6 rounded-lg'
              ></img>
            </div>
            <div className='col-span-12 md:col-span-4'>
              <TrendingPostsSection />
            </div>
          </div>
        </>
      )}
    </BlogLayout>
  )
}

export default BlogPostView