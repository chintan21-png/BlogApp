import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import BlogLandingPage from "./pages/Blog/components/BlogLandingPage";
import BlogPostView from "./pages/Blog/components/BlogPostView";
import PostByTags from "./pages/Blog/components/PostByTags";
import SearchPosts from "./pages/Blog/components/SearchPosts";
import AdminLogin from "./pages/Admin/AdminLogin";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Admin/Dashboard";
import BlogPosts from "./pages/Admin/BlogPosts";
import BlogPostEditor from "./pages/Admin/BlogPostEditor";
import Comments from "./pages/Admin/Comments";
import UserProvider from "./context/userContext";

const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          {/*Default Route*/}
          <Route path="/" element={<BlogLandingPage/>}></Route>
          <Route path="/:slug" element={<BlogPostView />}></Route>
          <Route path="/tag/:tagName" element={<PostByTags />}></Route>
          <Route path="/search" element={<SearchPosts /> }></Route>

          {/*Admin Routes*/}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />}></Route>
            <Route path="/admin/posts" element={<BlogPosts />}></Route>
            <Route path="/admin/create" element={<BlogPostEditor />}></Route>
            <Route path="/admin/edit/:postSlug" element={<BlogPostEditor isEdit={true}/>}></Route>
            <Route path="/admin/comments" element={<Comments />}></Route>
          </Route>
          <Route path="/admin-login" element={<AdminLogin />}></Route>
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          className:"",
          style: {
            fontSize: "13px",
          },
        }}
      ></Toaster>
    </div>
    </UserProvider>
  )
}

export default App