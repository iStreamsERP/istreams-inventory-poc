import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AccessDenied from "@/components/AccessDenied";
import { BarLoader } from "react-spinners";
import { usePermissions } from "@/hooks/usePermissions";
import { useTour } from "@reactour/tour";
import TreeView from "@/components/TreeView";
import { useToast } from "@/hooks/useToast";

export const DocumentTreePage = () => {
  const { toast } = useToast();
  const { setIsOpen, setSteps, setCurrentStep } = useTour();
  const location = useLocation();
  const [userRights, setUserRights] = useState("");
  const [rightsChecked, setRightsChecked] = useState(false);
  const { hasPermission } = usePermissions();

  useEffect(() => {
    fetchUserRights();
  }, []);

  const fetchUserRights = async () => {
    try {
      const result = await hasPermission("VIEW_ALL_DOCS");
      setUserRights(result ? "Allowed" : "Denied");
    } catch (error) {
      console.error("Permission check failed:", error);
      toast({
        variant: "destructive",
        title: "Permission Error",
        description: error.message || "Failed to check document permissions.",
      });
    } finally {
      setRightsChecked(true);
    }
  };

  // Define tour steps
  const dashboardSteps = [
    {
      selector: '[data-tour="restart-tour"]',
      content: "Click here anytime to restart the guided tour.",
    },
  ];

  // Run tour on first load
  useEffect(() => {
    setSteps(dashboardSteps);

    const hasSeenTour = localStorage.getItem("dashboard_tour_seen");
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem("dashboard_tour_seen", "true");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [setSteps, setIsOpen]);

  const startTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  return (
    <div className="grid grid-cols-1 gap-2">
      {!rightsChecked ? (
        <div className="flex justify-center items-start">
          <BarLoader color="#36d399" height={2} width="100%" />
        </div>
      ) : userRights !== "Allowed" ? (
        <AccessDenied />
      ) : (
        <>
          <TreeView />
        </>
      )}

      {/* Tour Trigger Button */}
      <button
        onClick={startTour}
        className="fixed bottom-8 right-24 z-[9999] p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
        data-tour="restart-tour"
      >
        <p className="text-sm">Start Tour</p>
      </button>
    </div>
  );
};
