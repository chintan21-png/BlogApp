import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import CommetInfoCard from "@/components/Cards/CommetInfoCard";
import axiosInstance from "@/utils/axiosinstance";
import { API_PATHS } from "@/utils/apiPaths";
import toast from "react-hot-toast";
import Modal from '@/components/Modal';

const Comments = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const getAllComments = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.COMMENTS.GET_ALL);
      setComments(response.data?.length > 0 ? response.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(API_PATHS.COMMENTS.DELETE(commentId));
      toast.success("Comment Deleted Successfully");
      setOpenDeleteAlert({
        open: false,
        data: null,
      });
      getAllComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  useEffect(() => {
    getAllComments();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Comments">
      <div className="w-auto sm:max-w-[900px] mx-auto">
        <h2 className="text-2xl font-semibold mt-5 mb-5">Comments</h2>

        {comments.map((comment) => (
          <CommetInfoCard
            key={comment._id}
            commentId={comment._id || null}
            authorName={comment.author.name}
            authorPhoto={comment.author.profileImageUrl}
            content={comment.content}
            updatedOn={
              comment.updatedAt
                ? moment(comment.updatedAt).format("Do MMM YYYY")
                : "-"
            }
            post={comment.post}
            replies={comment.replies || []}
            getAllComments={getAllComments}
            onDelete={(commentId) =>
              setOpenDeleteAlert({ open: true, data: commentId || comment._id })
            }
          />
        ))}
      </div>

      <Modal
        isOpen={openDeleteAlert.open}
        onClose={() => {
          setOpenDeleteAlert({ open: false, data: null });
        }}
        title="Delete Alert"
        size="sm"
      >
        <div className="p-4">
          <p className="text-[14px] text-gray-700 mb-6">
            Are you sure you want to delete this blog post comment?
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
              onClick={() => deleteComment(openDeleteAlert.data)}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Comments;
