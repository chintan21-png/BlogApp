import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { UserContext } from '@/context/userContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axiosinstance';
import { API_PATHS } from '@/utils/apiPaths';
import moment from "moment";
import { LuChartLine, LuCheckCheck, LuGalleryVerticalEnd, LuHeart } from 'react-icons/lu';
import TagInsights from '@/components/Cards/TagInsights';
import DashboardSummaryCard from '@/components/Cards/DashboardSummaryCard';
import TopPostCard from '@/components/Cards/TopPostCard';
import RecentCommentList from '@/components/Cards/RecentCommentList';

const Dashboard = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [maxViews, setMaxViews] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin-login');
    }
  }, [user, loading, navigate]);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DASHBOARD_DATA);
      if(response.data) {
        setDashboardData(response.data);
        const topPosts = response.data?.topPosts || [];
        const totalViews = topPosts.length > 0 ? Math.max(...topPosts.map((p) => p.views || 0), 1) : 1;
        setMaxViews(totalViews);
      }
    }
    catch(error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout activeMenu='Dashboard'>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout activeMenu='Dashboard'>
      <div className='space-y-6'>
        {/* Welcome Card */}
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-200'>
          <div>
            <h2 className='text-xl md:text-2xl font-medium text-gray-800'>Good Morning! {user.name}</h2>
            <p className='text-sm font-medium text-gray-500 mt-1'>
              {moment().format('dddd, MMM YYYY')}
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-6'>
            <DashboardSummaryCard
              icon={<LuGalleryVerticalEnd className='text-lg' />}
              label='Total Posts'
              value={dashboardData?.stats?.totalPosts || 0}
              bgColor="bg-sky-100/60"
              color="text-sky-500"
            />
            <DashboardSummaryCard
              icon={<LuCheckCheck className='text-lg' />}
              label="Published"
              value={dashboardData?.stats?.published || 0}
              bgColor="bg-sky-100/60"
              color="text-sky-500"
            />
            <DashboardSummaryCard
              icon={<LuChartLine className='text-lg' />}
              label="Total Views"
              value={dashboardData?.stats?.totalViews || 0}
              bgColor="bg-sky-100/60"
              color="text-sky-500"
            />
            <DashboardSummaryCard
              icon={<LuHeart className='text-lg' />}
              label="Total Likes"
              value={dashboardData?.stats?.totalLikes || 0}
              bgColor="bg-sky-100/60"
              color="text-sky-500"
            />
          </div>
        </div>

        {/* Insights and Top Posts */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          {/* Tag Insights */}
          <div className='lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-200'>
            <h5 className='font-semibold text-gray-800 text-lg mb-4'>Tag Insights</h5>
            <TagInsights tagUsage={dashboardData?.tagUsage || []} />
          </div>

          {/* Top Posts */}
          <div className='lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between mb-4'>
              <h5 className='font-semibold text-gray-800 text-lg'>Top Posts</h5>
            </div>
            <div className='space-y-3'>
              {dashboardData?.topPosts?.slice(0, 3)?.map((post) => (
                <TopPostCard
                  key={post._id}
                  title={post.title}
                  coverImageUrl={post.coverImageUrl}
                  views={post.views || 0}
                  likes={post.likes || 0}
                  maxViews={maxViews}
                />
              ))}
              {(!dashboardData?.topPosts || dashboardData.topPosts.length === 0) && (
                <p className='text-center text-gray-500 text-sm py-4'>No posts yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Comments */}
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between mb-4'>
            <h5 className='font-semibold text-gray-800 text-lg'>Recent Comments</h5>
          </div>
          <RecentCommentList
            comments={dashboardData?.recentComments || []}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard