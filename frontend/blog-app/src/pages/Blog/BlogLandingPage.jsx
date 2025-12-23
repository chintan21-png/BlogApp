import React, { useEffect, useState } from "react";
import BlogLayout from "@/components/layouts/BlogLayout/BlogLayout";
import { useNavigate } from "react-router-dom";
import { LuGalleryVerticalEnd, LuLoaderCircle } from "react-icons/lu";
import axiosInstance from "@/utils/axiosinstance";
import { API_PATHS } from "@/utils/apiPaths";
import moment from "moment";
import FeaturedBlogPost from "./components/FeaturedBlogPost";
import BlogPostSummaryCard from "./components/BlogPostSummaryCard";
import TrendingPostsSection from "./components/TrendingPostsSection";

const POSTS_CACHE_KEY = "cached_blog_posts";
const POSTS_META_KEY = "cached_blog_meta";

const BlogLandingPage = () => {
  const navigate = useNavigate();
  const [blogPostList, setBlogPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAllPosts = async (pageNumber = 1) => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
        params: {
          status: "published",
          page: pageNumber,
        },
        timeout: 60000,
      });

      const { posts, totalPages } = response.data;

      const updatedPosts =
        pageNumber === 1 ? posts : [...blogPostList, ...posts];

      setBlogPostList(updatedPosts);
      setTotalPages(totalPages);
      setPage(pageNumber);

      localStorage.setItem(POSTS_CACHE_KEY, JSON.stringify(updatedPosts));
      localStorage.setItem(
        POSTS_META_KEY,
        JSON.stringify({ page: pageNumber, totalPages })
      );
    } catch (error) {
      console.error("Error fetching posts, using cache", error);

      // FALLBACK TO CACHE
      const cachedPosts = localStorage.getItem(POSTS_CACHE_KEY);
      const cachedMeta = localStorage.getItem(POSTS_META_KEY);

      if (cachedPosts) {
        setBlogPostList(JSON.parse(cachedPosts));
      }
      if (cachedMeta) {
        const meta = JSON.parse(cachedMeta);
        setPage(meta.page);
        setTotalPages(meta.totalPages);
      }
    } finally {
      setIsLoading(false);
    }
  };
  //Load more posts

  const handleLoadMore = () => {
    if (page < totalPages) {
      getAllPosts(page + 1);
    }
  };

  //Initial load
  useEffect(() => {
    // Load cached posts instantly
    const cachedPosts = localStorage.getItem(POSTS_CACHE_KEY);
    const cachedMeta = localStorage.getItem(POSTS_META_KEY);

    if (cachedPosts) {
      setBlogPostList(JSON.parse(cachedPosts));
    }
    if (cachedMeta) {
      const meta = JSON.parse(cachedMeta);
      setPage(meta.page);
      setTotalPages(meta.totalPages);
    }

    // Fetch fresh data in background
    getAllPosts(1);
  }, []);

  const handleClick = (post) => {
    navigate(`/${post.slug}`);
  };
  return (
    <BlogLayout>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-9">
          {!isLoading && blogPostList.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              Waking up server, please wait…
            </p>
          )}
          {blogPostList.length > 0 && (
            <FeaturedBlogPost
              title={blogPostList[0].title}
              coverImageUrl={blogPostList[0].coverImageUrl}
              description={blogPostList[0].content}
              tags={blogPostList[0].tags}
              updatedOn={
                blogPostList[0].updatedAt
                  ? moment(blogPostList[0].updatedAt).format("Do MMM YYYY")
                  : "-"
              }
              authorName={blogPostList[0].author.name}
              authProfileImg={blogPostList[0].author.profileImageUrl}
              onClick={() => handleClick(blogPostList[0])}
            />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {blogPostList.length > 0 &&
              blogPostList
                .slice(1)
                .map((item) => (
                  <BlogPostSummaryCard
                    key={item._id}
                    title={item.title}
                    coverImageUrl={item.coverImageUrl}
                    description={item.content}
                    tags={item.tags}
                    updatedOn={
                      item.updatedAt
                        ? moment(item.updatedAt).format("Do MMM YYYY")
                        : "-"
                    }
                    authorName={item.author.name}
                    authProfileImg={item.author.profileImageUrl}
                    onClick={() => handleClick(item)}
                  />
                ))}
          </div>

          {page < totalPages && (
            <div className="flex items-center justify-center mt-5">
              <button
                className="flex items-center gap-3 text-sm text-white font-medium bg-black px-7 py-2.5 mt-6 rounded-full text-nowrap hover:scale-105 transition-all cursor-pointer"
                disabled={isLoading}
                onClick={handleLoadMore}
              >
                {isLoading ? (
                  <LuLoaderCircle className="animate-spin text-[15px]" />
                ) : (
                  <LuGalleryVerticalEnd className="text-lg" />
                )}{" "}
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
        <div className="col-span-12 md:col-span-3">
          <TrendingPostsSection />
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogLandingPage;
