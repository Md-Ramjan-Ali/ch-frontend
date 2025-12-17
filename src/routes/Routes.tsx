import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import NotFound from "../pages/NotFound";
import UserLayout from "@/Layout/UserLayout/UserLayout";
import { UserOverview } from "@/components/UserDashbord/Overviwe/UserOverview";
import { UserAnalytics } from "@/components/UserDashbord/UserAnalytics";
import { UserLeaderboard } from "@/components/UserDashbord/UserLeaderboard";
 import AdminLayout from "@/Layout/AdminLayout/AdminLayout";
import AdminUserManagement from "@/components/AdminDashbord/Admin/AdminUserManagement";
import AdminSubscription from "@/components/AdminDashbord/SubscriptionManagement/AdminSubscription";
import AdminAnalytics from "@/components/AdminDashbord/Admin/AdminAnalytics";
import AdminOverview from "@/components/AdminDashbord/Overview/AdminOverview";
import AdminSupport from "@/components/AdminDashbord/Admin/AdminSupport";
import AdminSettings from "@/components/AdminDashbord/Admin/AdminSettings";
  import UserDetailsPage from "@/components/AdminDashbord/UserManagementDashboard/UserDetailsPage/UserDetailsPage";
import ContentManagementPage from "@/components/AdminDashbord/ContentManagementPage/ContentManagementPage";
 import UserFlashcards from "@/components/UserDashbord/UserFlashcards";
import UserStudyPlanner from "@/components/UserDashbord/UserStudyPlanner";
import FreeUserLayout from "@/Layout/FreeUserLayout/FreeUserLayout";
import FreeUserOverviwe from "@/components/FreeUserDashbord/Overview/FreeUserOverviwe";
import FreeUserAnalytics from "@/components/FreeUserDashbord/FreeUserAnalytics/FreeUserAnalytics";
import FlashcardApp from "@/components/UserDashbord/UserFlashCard/FlashcardApp";
import SettingsPage from "@/components/FreeUserDashbord/FreeUserSitting/SettingsPage";
import ProtectedRoute from "@/components/Athontication copy/ProtectedRoute";
import Login from "@/components/Athontication copy/login/Login";
import Signup from "@/components/Athontication copy/Signup";
import VerifyAccount from "@/components/Athontication copy/VerifyAccount";
import ResetPasswordForm from "@/components/Athontication copy/login/ResetPasswordForm";
import Unauthorized from "@/components/Athontication copy/Unauthorized";
import ForgotPasswordForm from "@/components/Athontication copy/login/ForgotPasswordForm";
import UserSupportDashbord from "@/components/UserDashbord/UserSupport/UserSupportDashbord";
 import EliteItalianMastery from "@/Layout/Home";
import CategoryDetail from "@/components/AdminDashbord/ContentManagementPage/components/CategoryDetail";

import FlashcardDecks from "@/components/AdminDashbord/ContentManagementPage/components/FlashcardDecks";
 import PhraseOfTheDay from "@/components/AdminDashbord/ContentManagementPage/components/PhraseOfTheDay";
import LessonsContainer from "@/components/AdminDashbord/ContentManagementPage/components/Lession/LessonsContainer";
import UserItalianPractice from "@/components/UserDashbord/ItalianPractice/UserItalianPractice";
import UserReadingPractice from "@/components/UserDashbord/ItalianPractice/ReadingMood/UserReadingPractice";
import ListeningPractice from "@/components/UserDashbord/ItalianPractice/ListeningMood/ListeningPractice";
import ExercisesContainer from "@/components/UserDashbord/ItalianPractice/WritingMood/ExercisesContainer";
import SpeakingPractice from "@/components/UserDashbord/ItalianPractice/SpeakingMood/SpeakingPractice";
import PaymentSuccess from "@/components/UserDashbord/Subscription/PaymentSuccess";
import { UserSettings } from "@/components/UserDashbord/UserSettings";
 
      // import Home from "../pages/Home";
 
const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // { index: true, element: <Home /> },
      { index: true, element: <EliteItalianMastery /> },
      {
  // path: '/payment-success',
  path: 'subscribe/success',

  element: <PaymentSuccess />
},
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },

      // In your routing file
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "verified",
        element: <VerifyAccount />,
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "reset",
        element: <ResetPasswordForm />,
      },
      {
        path: "forgot-password", // Fixed typo from "fotgetPassword"
        element: <ForgotPasswordForm />,
      },

      {
        path: "freeuser",
        element: (
          <ProtectedRoute allowedRoles={["freeuser"]}>
            <FreeUserLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <FreeUserOverviwe /> },
          { path: "analytics", element: <FreeUserAnalytics /> },
          { path: "flashcards", element: <FlashcardApp /> },
          { path: "settings", element: <SettingsPage /> },
          {
            path: "practice",
            element: <UserItalianPractice />,
            children: [
              { path: "reading", element: <UserReadingPractice /> },
              { path: "listening", element: <ListeningPractice /> },
              { path: "writing", element: <ExercisesContainer /> },
              { path: "speaking", element: <SpeakingPractice /> },
            ],
          },
        ],
      },

      // User Routes
      // {
      //   path: "user",
      //   element: (
      //     <ProtectedRoute allowedRoles={["USER"]}>
      //       <UserLayout />
      //     </ProtectedRoute>
      //   ),
      //   children: [
      //     { index: true, element: <UserOverview /> },
      //     { path: "analytics", element: <UserAnalytics /> },
      //     { path: "flashcards", element: <UserFlashcards /> },
      //     { path: "leaderboard", element: <UserLeaderboard /> },
      //     { path: "planner", element: <UserStudyPlanner /> },
      //     { path: "settings", element: <UserSettings /> },
      //     { path: "support", element: <UserSupportDashbord /> },
      //      {
      //       path: "practice",
      //       element: <UserItalianPractice />,
      //       children: [
      //         { path: "reading", element: <UserReadingPractice /> },
      //         { path: "listening", element: <ListeningPractice /> },
      //         { path: "writing", element: <WritingPractice /> },
      //         { path: "speaking", element: <SpeakingPractice /> },
      //       ],
      //     },
      //   ],
      // },





      {
        path: "user",
        element: (
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <UserOverview /> },
          { path: "analytics", element: <UserAnalytics /> },
          { path: "flashcards", element: <UserFlashcards /> },
          { path: "leaderboard", element: <UserLeaderboard /> },
          { path: "planner", element: <UserStudyPlanner /> },
          { path: "settings", element: <UserSettings /> },
          { path: "support", element: <UserSupportDashbord /> },
           {
            path: "practice",
            // element: <UserItalianPractice />,
           element: <UserItalianPractice />,

            children: [
              { path: "reading", element: <UserReadingPractice /> },
              { path: "listening", element: <ListeningPractice /> },
              { path: "writing", element: <ExercisesContainer /> },
              { path: "speaking", element: <SpeakingPractice /> },
            ],
          },
        ],
      },

     

{
  path: "admin",
  element: (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "SUPPORT_MANAGER", "CONTENT_MANAGER"]}>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <AdminOverview /> },
    { path: "users", element: <AdminUserManagement /> },
    {
      path: "users/:id",
      element: <UserDetailsPage />,
    },
    { 
      path: "content",
      children: [
        { 
          index: true, 
          element: <ContentManagementPage /> 
        },
        {
          path: "flashcards",
          children: [
            { 
              index: true, 
              element: <FlashcardDecks /> 
            },
            {
              path: "category/:id",
              element: <CategoryDetail />,
            },
            {
              path: "category/:id/edit",
              element: <CategoryDetail />,
            },
          ]
        },
        { 
          path: "lessons", 
          element: <LessonsContainer />
        },
        // { 
        //   path: "lessons", 
        //   element: <Lessons />
        // },
        { 
          path: "phrase-of-the-day", 
          element: <PhraseOfTheDay />
        },
      ]
    },
    { path: "subscription", element: <AdminSubscription /> },
    { path: "analytics", element: <AdminAnalytics /> },
    { path: "support", element: <AdminSupport /> },
    { path: "settings", element: <AdminSettings /> },
  ],
},




    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default routes;
