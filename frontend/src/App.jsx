import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import BookDetails from "./pages/BookDetails";
import ReviewDetails from "./pages/ReviewDetails";
import SearchResults from "./pages/SearchResults";
import AuthContext from "./context/AuthContext";
import Chapters from "./pages/Chapters";
import ChapterDetail from "./pages/ChapterDetail";
import Dashboard from "./pages/Dashboard";
import Rankings from "./pages/Rankings";
import ForumPage from "./pages/ForumPage";
import NovelAnalytics from "./pages/NovelAnalytics";
import NotFoundPage from './pages/404Page';
import { DarkModeProvider } from "./context/DarkModeContext";
// import { AuthContext } from "./context/AuthContext";
const App = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/search" element={<SearchResults />} />

          <Route path="/novels/:id" element={isAuthenticated() ? <BookDetails /> : <Navigate to="/login" replace />} />
          <Route path="/novels/:novelId/reviews/:reviewId" element={isAuthenticated() ? <ReviewDetails /> : <Navigate to="/login" replace />} />
          <Route path="/novels/:id/chapters" element={isAuthenticated() ? <Chapters /> : <Navigate to="/login" replace />} />
          <Route path="/novels/:novelId/chapters/:chapterId" element={isAuthenticated() ? <ChapterDetail /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/forum" element={isAuthenticated() ? <ForumPage /> : <Navigate to="/login" replace />} />
          <Route path="/novel-analytics/:novelId" element={isAuthenticated() ? <NovelAnalytics /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
};

export default App;
