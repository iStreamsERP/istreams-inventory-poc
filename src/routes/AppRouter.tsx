import { DefaultLayout } from "@/layouts";
import {
  DashboardPage,
  ForgetPasswordPage,
  LoginFormPage,
  MaterialIssueNote,
  MaterialMaster,
  MaterialRequisition,
  NotFoundPage,
  PurchaseOrderPage,
  RfqPage,
  SignUpPage,
} from "@/pages";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginFormPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/forget-password",
    element: <ForgetPasswordPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DefaultLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "/material-master", element: <MaterialMaster /> },
          { path: "/material-requisition", element: <MaterialRequisition /> },
          { path: "/material-issue-note", element: <MaterialIssueNote /> },
          { path: "/purchase-order", element: <PurchaseOrderPage /> },
          { path: "/rfq-rate-viewer", element: <RfqPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
