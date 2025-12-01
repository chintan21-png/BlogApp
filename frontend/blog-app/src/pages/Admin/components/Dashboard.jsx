// Dashboard.jsx - Updated with loading state
import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { UserContext } from '../../../context/userContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosinstance';
import { API_PATHS } from '../../../utils/apiPaths';
import moment from "moment";
import { LuChartLine, LuCheckCheck, LuGalleryVerticalEnd, LuHeart } from 'react-icons/lu';
import TagInsights from '../../../components/Cards/TagInsights';
import DashboardSummaryCard from '../../../components/Cards/DashboardSummaryCard';
import TopPostCard from '../../../components/Cards/TopPostCard';

const Dashboard = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [maxViews, setMaxViews] = useState(0);

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DASHBOARD_DATA);
      if(response.data) {
        setDashboardData(response.data);
        const topPosts = response.data?.topPosts || [];
        const totalViews = Math.max(...topPosts.map((p) => p.views), 1);
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
      {dashboardData && (
        <>
          <div className='bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 mt-5'>
            <div>
              <div className='col-span-3'>
                <h2 className='text-xl md:text-2xl font-medium'>Good Morning! {user.name}</h2>
                <p className='text-xs md:text-[13px] font-medium text-gray-400 mt-1.5'>
                  {moment().format('dddd MMM YYYY')}
                </p>
              </div>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5'>
              <DashboardSummaryCard
                icon={<LuGalleryVerticalEnd />}
                label='Total Posts'
                value={dashboardData?.stats?.totalPosts || 0}
                bgColor="bg-sky-100/60"
                color="text-sky-500"
              />
              <DashboardSummaryCard
                icon={<LuCheckCheck />}
                label="Published"
                value={dashboardData?.stats?.published || 0}
                bgColor="bg-sky-100/60"
                color="text-sky-500"
              />

              <DashboardSummaryCard
                icon={<LuChartLine />}
                label="Total Views"
                value={dashboardData?.stats?.totalViews || 0}
                bgColor="bg-sky-100/60"
                color="text-sky-500"
              />
              <DashboardSummaryCard
                icon={<LuHeart />}
                label="Total Likes"
                value={dashboardData?.stats?.totalLikes || 0}
                bgColor="bg-sky-100/60"
                color="text-sky-500"
              />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-6 my-4 md:my-6 mb-32'>
            <div className='col-span-12 md:col-span-7 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50'>
              <div className='flex items-center justify-between'>
                <h5 className='font-medium'>Tag Insights</h5>
              </div>
              <TagInsights tagUsage={dashboardData?.tagUsage || []} />
            </div>
            <div className='col-span-12 md:col-span-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50'>
              <div className='flex items-center justify-between'>
                <h5 className='font-medium'>Top Posts</h5>
              </div>
              {dashboardData?.topPosts?.slice(0,3)?.map((post) => (
                <TopPostCard
                  key={post._id}
                  title={post.title}
                  coverImageUrl={post.coverImageUrl}
                  views={post.views}
                  likes={post.likes}
                  maxViews={maxViews}
                />
              ))}
            </div>

            <div className='col-span-12 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50'>
              <div className='flex items-center justify-between'>
                <h5 className='font-medium'>Recent Comments</h5>
              </div>
            </div>
          </div>
        </>
      )}
     </DashboardLayout>
  )
}

export default Dashboard