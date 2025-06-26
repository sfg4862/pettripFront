import { useState, createContext, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, HashRouter } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage/HomePage";
import FAQPage from "./pages/FAQPage/FAQPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import RecordDailyPage from "./pages/RecordDailyPage/RecordDailyPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import CommunityPage from "./pages/CommunityPage/CommunityPage";
import CommunityPostWritePage from "./pages/CommunityPostWritePage/CommunityPostWritePage";
import Navbar from "./layout/Navbar/Navbar";
import Footer from "./layout/Footer/Footer";
import CommunityPostDetail from "./components/CommunityPostDetail/CommunityPostDetail";
import CommunityPostEdit from "./components/CommunityPostEdit/CommunityPostEdit";
import PetSitterReservePage from "./pages/PetSitterReservePage/PetSitterReservePage";
import PetSitterDetail from "./components/PetSitterDetail/PetSitterDetail";
import SearchResultAccommodationPage from "./pages/SearchResultAccommodationPage/SearchResultAccommodationPage";
import SearchResultRestaurantPage from "./pages/SearchResultRestaurantPage/SearchResultRestaurantPage";
import HealthCheckupPage from "./pages/HealthCheckupPage/HealthCheckupPage";
import ProfileModifyPage from "./pages/ProfileModifyPage/ProfileModifyPage";
import ReserveLookupPage from "./pages/ReserveLookupPage/ReserveLookupPage";
import PetSitterMainPage from "./pages/PetSitterMainPage/PetSitterMainPage";
import PetSitterRegisterPage from "./pages/PetSitterRegisterPage/PetSitterRegisterPage";

export const AuthContext = createContext(null);

function ProtectedRoute({ children }) {
  const location = useLocation();

  // sessionStorage에서 로그인 상태 확인
  const isLoggedIn = !!sessionStorage.getItem("user_id");

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </>
  );
}

function PostDetailLayout() {
  return (
    <MainLayout>
      <CommunityPostDetail />
    </MainLayout>
  );
}

function PetSitterDetailLayout() {
  return (
    <MainLayout>
      <PetSitterDetail />
    </MainLayout>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const userId = sessionStorage.getItem("user_id");
      if (userId) {
        setIsLoggedIn(true);
        setUser({
          id: userId,
          nickname: sessionStorage.getItem("user_nickname") || "사용자",
          profileImage:
            sessionStorage.getItem("user_profile_image") ||
            "/api/placeholder/50/50",
        });
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkLoginStatus();

    // storage 이벤트 리스너 추가
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const login = (userData) => {
    // sessionStorage에 사용자 정보 저장
    sessionStorage.setItem("user_id", userData.id);
    sessionStorage.setItem("user_nickname", userData.nickname);
    if (userData.profileImage) {
      sessionStorage.setItem("user_profile_image", userData.profileImage);
    }

    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    // sessionStorage에서 사용자 정보 제거
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("user_nickname");
    sessionStorage.removeItem("user_profile_image");

    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout> 
          }
        />
        <Route
          path="/faq"
          element={
            <MainLayout>
              <FAQPage />
            </MainLayout>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/search"
          element={
            <MainLayout>
              <SearchPage />
            </MainLayout>
          }
        />

        <Route
          path="/search/accommodation/:location"
          element={
            <MainLayout>
              <SearchResultAccommodationPage />
            </MainLayout>
          }
        />
        <Route
          path="/search/restaurant/:location"
          element={
            <MainLayout>
              <SearchResultRestaurantPage />
            </MainLayout>
          }
        />
        <Route
          path="/petsitter/search"
          element={
            <MainLayout>
              <PetSitterReservePage />
            </MainLayout>
          }
        />
        <Route
          path="/petsitter"
          element={
            <MainLayout>
              <PetSitterMainPage />
            </MainLayout>
          }
        />
        <Route
          path="/petsitter/register"
          element={
            <MainLayout>
              <PetSitterRegisterPage />
            </MainLayout>
          }
        />
        <Route
          path="/petsitter/:id"
          element={<PetSitterDetailLayout />}
        />

        <Route
          path="/health-checkup"
          element={
            <MainLayout>
              <HealthCheckupPage />
            </MainLayout>
          }
        />

        <Route
          path="/community"
          element={
            <MainLayout>
              <CommunityPage />
            </MainLayout>
          }
        />
        <Route path="/community/post/:postId" element={<PostDetailLayout />} />
        <Route path="/community/post/edit/:postId" element={
            <MainLayout>
              <CommunityPostEdit />
            </MainLayout>
        } />
        <Route
          path="/community/write"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CommunityPostWritePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/record_daily"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RecordDailyPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* 사이드바 메뉴에서 접근할 수 있는 라우트들 */}
        <Route
          path="/reservations"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ReserveLookupPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-edit"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfileModifyPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorite-posts"
          element={
            <ProtectedRoute>
              <MainLayout>
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <h2>관심 피드</h2>
                  <p>개발 예정입니다.</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-posts"
          element={
            <ProtectedRoute>
              <MainLayout>
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <h2>게시물 관리</h2>
                  <p>개발 예정입니다.</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/points"
          element={
            <ProtectedRoute>
              <MainLayout>
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <h2>적립금</h2>
                  <p>개발 예정입니다.</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/coupons"
          element={
            <ProtectedRoute>
              <MainLayout>
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <h2>쿠폰</h2>
                  <p>개발 예정입니다.</p>
                </div>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer-service"
          element={
            <MainLayout>
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <h2>고객센터</h2>
                <p>개발 예정입니다.</p>
              </div>
            </MainLayout>
          }
        />

        <Route
          path="*"
          element={
            <MainLayout>
              <div className="not-found">
                <h1>404</h1>
                <p>페이지를 찾을 수 없습니다.</p>
              </div>
            </MainLayout>
          }
        />
      </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}

export default App;
