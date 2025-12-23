import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosinstance";
import { API_PATHS } from "@/utils/apiPaths";

const TRENDING_CACHE_KEY = "cached_trending_posts";

const TrendingPostsSection = () => {
  const navigate = useNavigate();
  const [postList, setPostList] = useState([]);

  //fetch trending blog posts
  const getTrendingPosts = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_TRENDING_POSTS,
        { timeout: 60000 }
      );

      const posts = response.data?.length ? response.data : [];

      setPostList(posts);

      // cache
      localStorage.setItem(TRENDING_CACHE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error("Trending API failed, loading cache", error);

      const cached = localStorage.getItem(TRENDING_CACHE_KEY);
      if (cached) {
        setPostList(JSON.parse(cached));
      }
    }
  };

  //handle post click
  const handleClick = (post) => {
    navigate(`/${post.slug}`);
  };

  useEffect(() => {
    const cached = localStorage.getItem(TRENDING_CACHE_KEY);
    if (cached) {
      setPostList(JSON.parse(cached));
    }

    getTrendingPosts();
  }, []);

  return (
    <div>
      <h4 className="text-base text-black font-medium mb-3">Recent Posts</h4>
      {postList.length === 0 && (
        <p className="text-sm text-gray-400">Loading posts…</p>
      )}

      {postList.length > 0 &&
        postList.map((item) => (
          <PostCard
            key={item._id}
            title={item.title}
            coverImageUrl={item.coverImageUrl}
            tags={item.tags}
            onClick={() => handleClick(item)}
          />
        ))}
    </div>
  );
};

export default TrendingPostsSection;

const PostCard = ({ title, coverImageUrl, tags, onClick }) => {
  return (
    <div className="cursor-pointer mb-3" onClick={onClick}>
      <h6 className="text-[10px] font-semibold text-sky-500">
        {tags[0]?.toUpperCase() || "BLOG"}
      </h6>
      <div className="flex items-center gap-4 mt-2">
        <img
          src={coverImageUrl}
          alt={title}
          className="w-14 h-14 object-cover rounded"
        ></img>
        <h2 className="text-sm md:text-sm font-medium mb-2 line-clamp-3">
          {title}
        </h2>
      </div>
    </div>
  );
};
