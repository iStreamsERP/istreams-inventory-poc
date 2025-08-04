import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

// Define interfaces for props and theme classes
interface StatusItem {
  key: string;
  icon: string;
  title: string;
  date: string;
  time?: string;
  content: ReactNode;
}

interface ThemeClasses {
  background: string;
  border: string;
  text: string;
  card: string;
}

interface OrderTrackingProps {
  orderNumber?: string;
  customerName?: string;
  statusItems?: StatusItem[];
  className?: string;
  theme?: "light" | "dark";
  showConnectorLines?: boolean;
  defaultOpenSection?: string | null;
}

// OrderTracking Component
export const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderNumber,
  statusItems = [],
  className = "",
  theme = "light",
  showConnectorLines = true,
  defaultOpenSection = null,
}) => {
  // State for open sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    statusItems.reduce((acc, item) => {
      acc[item.key] = defaultOpenSection === item.key;
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Toggle section open/close
  const toggleSection = (section: string): void => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Theme classes
  const themeClasses: Record<string, ThemeClasses> = {
    light: {
      background: "bg-white",
      border: "border-gray-200",
      text: "text-gray-600",
      card: "bg-gray-50",
    },
    dark: {
      background: "dark:bg-slate-950",
      border: "dark:border-gray-700",
      text: "dark:text-gray-300",
      card: "dark:bg-gray-800",
    },
  };

  return (
    <div
      className={`h-full overflow-y-auto rounded-lg shadow-sm border ${themeClasses[theme].border} ${themeClasses[theme].background} space-y-2 p-2 ${className}`}
    >
      <div className="pb-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center rounded-t-lg">
        <h2 className="text-sm font-semibold">Order Tracking</h2>
        {orderNumber && (
          <Badge
            variant="secondary"
            className="text-green-600 bg-green-100 text-xs font-medium"
          >
            {orderNumber}
          </Badge>
        )}
      </div>

      <div className="relative">
        {statusItems.map((item, index) => (
          <div key={item.key} className="mb-6 relative z-10">
            <div
              className="cursor-pointer rounded-lg transition-colors"
              onClick={() => toggleSection(item.key)}
            >
              <div className="flex items-center text-sm">
                <div className="mr-3 relative">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-white flex items-center justify-center shadow-sm">
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-10 h-10 rounded-full object-contain"
                    />
                  </div>
                  {showConnectorLines && index !== statusItems.length - 1 && (
                    <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-0 h-4 border-l border-dashed border-gray-500"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col justify-between text-gray-600 dark:text-gray-300 items-start">
                    <p className="font-medium">{item.title}</p>
                    <span className="text-xs">
                      {item.date}
                      {item.time && ` • ${item.time}`}
                    </span>
                  </div>
                  {openSections[item.key] && (
                    <div
                      className={`mt-1 ${themeClasses[theme].card} rounded-lg`}
                    >
                      {item.content}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};