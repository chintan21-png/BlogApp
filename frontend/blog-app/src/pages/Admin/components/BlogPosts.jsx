import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { LuGalleryVerticalEnd, LuLoaderCircle, LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosinstance";
import { API_PATHS } from "../../../utils/apiPaths";
import toast from "react-hot-toast";
import Modal from "../../../components/Modal";
import Tabs from "../../../components/Tabs";
import moment from "moment";
import BlogPostSummaryCard from "../../../components/Cards/BlogPostSummaryCard";
import DeleteAlertContent from "../../../components/DeleteAlertContent";

const BlogPosts = () => {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [blogPostList, setBlogPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const getAllPosts = async (pageNumber = 1) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
        params: {
          status: filterStatus.toLowerCase(),
          page: pageNumber,
        },
      });

      const { posts, totalPages, counts } = response.data;
      setBlogPostList((prevPosts) =>
        pageNumber === 1 ? posts : [...prevPosts, ...posts]
      );
      setTotalPages(totalPages);
      setPage(pageNumber);

      const statusSummary = counts || {};

      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Published", count: statusSummary.published || 0 },
        { label: "Draft", count: statusSummary.draft || 0 },
      ];
      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axiosInstance.delete(API_PATHS.POSTS.DELETE(postId));
      toast.success("Blog Post Deleted Successfully");
      setOpenDeleteAlert({
        open: false,
        data: null,
      });
      getAllPosts();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error("Failed to delete post");
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      getAllPosts(page + 1);
    }
  };

  useEffect(() => {
    getAllPosts(1);
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Blog Posts">
      <div className="w-auto sm:max-w-[900px] mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mt-5 mb-5">Blog Posts</h2>
          <button
            className="btn-small"
            onClick={() => navigate("/admin/create")}
          >
            <LuPlus className="text-[18px]" /> Create Post
          </button>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={filterStatus}
          setActiveTab={setFilterStatus}
        />

        <div className="mt-5 space-y-4">
          {blogPostList.length === 0 && !isLoading ? (
            <div className="text-center py-12 text-gray-500">
              No blog posts found. Create your first post!
            </div>
          ) : (
            blogPostList.map((post) => (
              <BlogPostSummaryCard
                key={post._id}
                title={post.title}
                imgUrl={post.coverImageUrl}
                updateOn={
                  post.updatedAt
                    ? moment(post.updatedAt).format("Do MMM YYYY")
                    : "-"
                }
                tags={post.tags}
                likes={post.likes}
                views={post.views}
                onClick={() => navigate(`/admin/edit/${post.slug}`)}
                onDelete={() =>
                  setOpenDeleteAlert({ open: true, data: post._id })
                }
              />
            ))
          )}

          {page < totalPages && (
            <div className="flex items-center justify-center mb-8">
              <button
                className="flex items-center gap-3 text-sm text-white font-medium bg-black px-7 py-2.5 rounded-full text-nowrap hover:scale-105 transition-all cursor-pointer"
                disabled={isLoading}
                onClick={handleLoadMore}
              >
                {isLoading ? (
                  <LuLoaderCircle className="animate-spin text-[15px]" />
                ) : (
                  <LuGalleryVerticalEnd className="text-lg" />
                )}
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {openDeleteAlert.open && (
        <Modal
          isOpen={openDeleteAlert?.open}
          onClose={() => {
            setOpenDeleteAlert({ open: false, data: null });
          }}
          title="Delete Alert"
          size="sm"
        >
          <div className="p-4">
            <p className="text-[14px] text-gray-700 mb-6">
              Are you sure you want to delete this blog post?
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                onClick={() => setOpenDeleteAlert({ open: false, data: null })}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                onClick={() => deletePost(openDeleteAlert.data)}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default BlogPosts;
