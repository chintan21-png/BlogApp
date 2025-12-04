import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../../components/layouts/DashboardLayout'
import MDEditor, { commands } from "@uiw/react-md-editor";
import {
  LuLoaderCircle,
  LuSave,
  LuSend,
  LuSparkles,
  LuTrash2,
} from "react-icons/lu";
import { useNavigate, useParams } from 'react-router-dom';


const BlogPostEditor = (isEdit) => {
  const navigate = useNavigate();
  const { postSlug = ""} = useParams();
  const [postData, setPostData] = useState({
    id: "",
    title: "",
    content: "",
    coverImageUrl: "",
    coverPreview: "",
    tags: "",
    isDraft: "",
    generatedByAI: false,
  });

  const [postIdeas, setPostIdeas] = useState([]);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [openBlogPostGenForm, setOpenBlogPostGenForm] = useState({
    open: false,
    data: null,
  });
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setPostData((prevData) => ({ ...prevData, [key]: value}));
  };

  //Generate Blog Post Idea Using AI
  const generatePostIdeas = async () => {

  };

  //Handle blog post publish
  const handlePublish = async (isDraft) => {

  };

  //Get Post Data By slug
  const fetchPostDetailsBySlug = async () => {

  };

  //Delete Blog post
  const deletePost = async () => {

  };

  useEffect(() => {
    if(isEdit) {
      fetchPostDetailsBySlug();
    }
    else {
      generatePostIdeas();
    }
    return () => {};
  },[]);
  return (
    <DashboardLayout activeMenu='Blog Posts'>
      <div className='my-5'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-5 my-4'>
          <div className='form-card p-6 col-span-12 md:col-span-8'>
            <div className='flex items-center justify-between'>
              <h2 className='text-base md:text-lg font-medium'>
                {!isEdit ? "Add New Post" : "Edit Post"}
              </h2>
              <div className='flex items-center gap-3'>
                {isEdit && (
                  <button className='flex items-center gap-2.5 text-[13px] font-medium text-rose-500 bg-rose-50/60 rounded px-1.5 md:px-3 py-1 md:py-[3px] border border-rose-50 hover:border-rose-300 cursor-pointer hover:scale-[1.02] transition-all' disabled={loading} onClick={() => setOpenDeleteAlert(true)}>
                    <LuTrash2 className='text-sm'/>{" "}
                    <span className='hidden md:block'>Delete</span>
                  </button>
                )}

                <button
                  className='flex items-center gap-2.5 text-[13px] font-medium text-sky-500 bg-sky-50/60 rounded px-1.5 md:px-3 py-1 md:py-[3px] border border-sky-100 hover:border-sky-400 cursor-pointer hover:scale-[1.02] transition-all'
                  disabled={loading}
                  onClick={() => handlePublish(true)}
                >
                  <LuSave className='text-sm'/>{" "}
                  <span className='hidden md:block'>Save as Draft</span>
                </button>

                <button
                  className='flex items-center gap-2.5 text-[13px] font-medium text-sky-600 hover:text-white hover:bg-linear-to-r hover:from-sky-500 hover:to-indigo-500 rounded px-3 py-[3px] border border-sky-500 hover:border-sky-50 cursor-pointer transition-all'
                  disabled={loading}
                  onClick={() => handlePublish(false)}
                >
                  {loading ? (
                    <LuLoaderCircle className='animate-spin text-[15px]'/>
                  ) : (
                    <LuSend className='text-sm'/>
                  )}{" "}
                  Publish
                </button>
              </div>
            </div>
            {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
            <div className='mt-4'>
              <label className='text-xs font-medium text-slate-600'>
                Post Title
              </label>
              <input
                placeholder='How to Build a MERN App'
                className='form-input'
                value={postData.title}
                onChange={({target}) => handleValueChange("title", target.value)}
              ></input>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default BlogPostEditor