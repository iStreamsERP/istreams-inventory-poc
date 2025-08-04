import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Barcode,
  Building,
  Laptop,
  Package,
  TrashIcon,
  Type,
} from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import { OrderTracking } from "@/components/OrderTracking"; // Added missing import
import { PopoverTable } from "@/components/PopoverTable"; // Added missing import
import { FormCard } from "@/components/FormCard";

// Define interfaces for data structures
interface Material {
  ITEM_CODE: string;
  ITEM_NAME: string;
  UOM: string;
  UOM_STOCK: string;
  SUB_MATERIAL_NO: string;
  CATEGORY: string;
  SUPPLIER: string;
  quantity?: number;
}

interface StatusItem {
  key: string;
  icon: string;
  title: string;
  date: string;
  time: string;
  content: JSX.Element; // Changed from unknown to JSX.Element for better type safety
}

interface OrderTrackingData {
  orderNumber: string;
  customerName: string;
  statusItems: StatusItem[];
}

interface RfqDetails {
  rfqNumber: string;
  supplier: string;
  dueDate: string;
  description: string;
}

interface Field {
  id: string;
  label: string;
  value: string;
  icon: JSX.Element; // Changed from unknown to JSX.Element for better type safety
  rows?: number;
}

interface Column {
  key: string;
  header: string;
  width: string;
  align: string;
  render?: (
    item: Material,
    index: number,
    editingQuantityId: string | null,
    setEditingQuantityId: (id: string | null) => void,
    handleRemoveMaterial: (itemCode: string, event: React.MouseEvent) => void,
    handleQuantityChange?: (itemCode: string, quantity: string) => void
  ) => JSX.Element; // Changed from unknown to JSX.Element
}

// Static available materials data
const staticAvailableMaterials: Material[] = [
  {
    ITEM_CODE: "MTL001",
    ITEM_NAME: "Steel Pipe 6 inch",
    UOM: "Meter",
    UOM_STOCK: "M",
    SUB_MATERIAL_NO: "SP001",
    CATEGORY: "Pipes",
    SUPPLIER: "Steel Corp Ltd",
  },
  {
    ITEM_CODE: "MTL002",
    ITEM_NAME: "Copper Wire 12 AWG",
    UOM: "Meter",
    UOM_STOCK: "M",
    SUB_MATERIAL_NO: "CW012",
    CATEGORY: "Electrical",
    SUPPLIER: "Electric Solutions",
  },
  {
    ITEM_CODE: "MTL003",
    ITEM_NAME: "Concrete Mix M25",
    UOM: "Cubic Meter",
    UOM_STOCK: "CUM",
    SUB_MATERIAL_NO: "CM025",
    CATEGORY: "Construction",
    SUPPLIER: "BuildCorp",
  },
  {
    ITEM_CODE: "MTL004",
    ITEM_NAME: "PVC Pipe 4 inch",
    UOM: "Meter",
    UOM_STOCK: "M",
    SUB_MATERIAL_NO: "PVC004",
    CATEGORY: "Pipes",
    SUPPLIER: "Plastic Industries",
  },
  {
    ITEM_CODE: "MTL005",
    ITEM_NAME: "Aluminum Sheet 2mm",
    UOM: "Square Meter",
    UOM_STOCK: "SQM",
    SUB_MATERIAL_NO: "AS002",
    CATEGORY: "Sheets",
    SUPPLIER: "Metal Works Ltd",
  },
  {
    ITEM_CODE: "MTL006",
    ITEM_NAME: "Cement Portland",
    UOM: "Bag",
    UOM_STOCK: "BAG",
    SUB_MATERIAL_NO: "CP050",
    CATEGORY: "Construction",
    SUPPLIER: "Cement Industries",
  },
  {
    ITEM_CODE: "MTL007",
    ITEM_NAME: "Wood Plank Oak",
    UOM: "Piece",
    UOM_STOCK: "PCS",
    SUB_MATERIAL_NO: "WO001",
    CATEGORY: "Wood",
    SUPPLIER: "Timber Co",
  },
  {
    ITEM_CODE: "MTL008",
    ITEM_NAME: "Glass Panel 10mm",
    UOM: "Square Meter",
    UOM_STOCK: "SQM",
    SUB_MATERIAL_NO: "GP010",
    CATEGORY: "Glass",
    SUPPLIER: "Glass Tech",
  },
];

// Static data for OrderTracking
const staticOrderTrackingData: OrderTrackingData = {
  orderNumber: "ORD-12345",
  customerName: "John Doe",
  statusItems: [
    {
      key: "order-placed",
      icon: "https://png.pngtree.com/png-vector/20241030/ourmid/pngtree-blue-shopping-cart-icon-png-image_14194383.png",
      title: "Order Placed",
      date: "Nov 01, 2023",
      time: "10:30 AM",
      content: (
        <div className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded-lg w-full">
          <p className="mb-1">
            Order placed successfully by{" "}
            <span className="font-semibold text-blue-500">John Doe</span>
          </p>
          <span className="text-gray-400 text-xs">Nov 01, 2023, 10:30 AM</span>
        </div>
      ),
    },
    {
      key: "delivered",
      icon: "https://cdn2.iconfinder.com/data/icons/greenline/512/check-512.png",
      title: "Delivered",
      date: "Nov 02, 2023",
      time: "02:15 PM",
      content: (
        <div className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded-lg w-full">
          <div className="flex flex-col sm:flex-row w-fit gap-1 mb-1">
            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              82710-111
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              GRN Value - 1,000
            </Badge>
          </div>
          <p className="mb-1">
            Your order has been Delivered{" "}
            <span className="font-semibold">Successfully</span>
          </p>
          <span className="text-gray-400 text-xs">15:36</span>
        </div>
      ),
    },
    {
      key: "previously-booked",
      icon: "https://cdn2.iconfinder.com/data/icons/greenline/512/check-512.png",
      title: "Previously Booked",
      date: "Nov 01, 2023",
      time: "10:30 AM",
      content: (
        <div className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded-lg w-full">
          <div className="flex flex-col sm:flex-row w-fit gap-1 mb-1">
            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              Booked
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              Balance - $1,000
            </Badge>
          </div>
          <p className="mb-1">
            Arrived USA <span className="font-semibold">SGS</span>
          </p>
          <span className="text-gray-400 text-xs">15:36</span>
        </div>
      ),
    },
    {
      key: "payments",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYz1ZplLBfJJTY7SAAKxAiZ3WBMhHc7flQ4g&s",
      title: "Payments",
      date: "Nov 02, 2023",
      time: "02:15 PM",
      content: (
        <div className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded-lg w-full">
          <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-1">
            <span className="font-semibold">Paid -</span>{" "}
            <span className="font-semibold">$1,000</span>
          </Badge>
          <p className="mb-1">Your payment has been successfully processed</p>
          <span className="text-gray-400 text-xs">
            Mar 07, 2025, 12:35 (confirmed)
          </span>
        </div>
      ),
    },
    {
      key: "status",
      icon: "https://cdn2.iconfinder.com/data/icons/greenline/512/check-512.png",
      title: "Status",
      date: "Nov 02, 2023",
      time: "02:15 PM",
      content: (
        <div className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded-lg w-full">
          <p className="mb-1">Your request has been completed successfully</p>
          <span className="text-gray-400 text-xs">Nov 03, 2022, 18:42</span>
        </div>
      ),
    },
  ],
};

// Column configuration for the table
const rfqColumns: Column[] = [
  {
    key: "index",
    header: "S.No.",
    width: "50px",
    align: "center",
    render: (_, index) => index + 1,
  },
  {
    key: "ITEM_CODE",
    header: "Item Code",
    width: "100px",
    align: "left",
  },
  {
    key: "ITEM_NAME",
    header: "Description",
    width: "200px",
    align: "left",
  },
  {
    key: "UOM",
    header: "UOM",
    width: "80px",
    align: "center",
  },
  {
    key: "quantity",
    header: "Quantity",
    width: "100px",
    align: "right",
    render: (
      item,
      index,
      editingQuantityId,
      setEditingQuantityId,
      handleRemoveMaterial,
      handleQuantityChange
    ) => (
      <div className="flex items-center justify-end">
        {editingQuantityId === `${item.ITEM_CODE}-${item.SUB_MATERIAL_NO}` ? (
          <Input
            type="number"
            value={item.quantity || 0}
            onChange={(e) =>
              handleQuantityChange?.(item.ITEM_CODE, e.target.value)
            }
            onBlur={() => setEditingQuantityId(null)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                setEditingQuantityId(null);
              }
            }}
            className="h-6 w-16 text-xs text-right"
            autoFocus
          />
        ) : (
          <span
            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
            onClick={() =>
              setEditingQuantityId(`${item.ITEM_CODE}-${item.SUB_MATERIAL_NO}`)
            }
          >
            {item.quantity || 0}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "SUB_MATERIAL_NO",
    header: "Sub Material",
    width: "120px",
    align: "left",
  },
  {
    key: "actions",
    header: "Actions",
    width: "80px",
    align: "center",
    render: (
      item,
      index,
      editingQuantityId,
      setEditingQuantityId,
      handleRemoveMaterial
    ) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={(e: React.MouseEvent) =>
          handleRemoveMaterial(item.ITEM_CODE, e)
        }
        className="h-6 w-6 p-0 rounded-full hover:bg-red-100 hover:text-red-600"
      >
        <TrashIcon className="h-3 w-3 text-red-500" />
      </Button>
    ),
  },
];

const fields: Field[] = [
  {
    id: "code",
    label: "Item Code",
    value: "12345",
    icon: <Barcode className="h-4 w-4" />,
  },
  {
    id: "name",
    label: "Item Name",
    value: "Laptop",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: "product",
    label: "Product",
    value: "Electronics",
    icon: <Laptop className="h-4 w-4" />,
  },
  {
    id: "type",
    label: "Type",
    value: "Laptop",
    icon: <Type className="h-4 w-4" />,
  },
  {
    id: "brand",
    label: "Brand",
    value: "Lenovo",
    icon: <Building className="h-4 w-4" />,
    rows: 4,
  },
];

// RFQ Component
export const PurchaseOrderPage: React.FC = () => {
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<Material[]>(
    staticAvailableMaterials
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [editingQuantityId, setEditingQuantityId] = useState<string | null>(
    null
  );

  // Simulate dynamic data fetching
  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async (): Promise<void> => {
    setLoading(true);
    try {
      // Replace this with actual API call in production
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAvailableMaterials(staticAvailableMaterials);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle material selection
  const handleMaterialSelect = (material: Material): void => {
    const materialWithQuantity: Material = {
      ...material,
      quantity: 1,
    };

    const exists = selectedMaterials.some(
      (m) =>
        m.ITEM_CODE === material.ITEM_CODE &&
        m.SUB_MATERIAL_NO === material.SUB_MATERIAL_NO
    );

    if (!exists) {
      setSelectedMaterials((prev) => [...prev, materialWithQuantity]);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (itemCode: string, quantity: string): void => {
    setSelectedMaterials((prev) =>
      prev.map((material) =>
        material.ITEM_CODE === itemCode
          ? { ...material, quantity: Math.max(0, Number(quantity)) }
          : material
      )
    );
  };

  // Handle material removal
  const handleRemoveMaterial = (itemCode: string): void => {
    setSelectedMaterials((prev) =>
      prev.filter((material) => material.ITEM_CODE !== itemCode)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      {/* Left Column - Vertical Card and PopoverTable */}
      <div className="lg:col-span-2 space-y-2">
        {/* Vertical Card at top left */}
        <div>
          <FormCard
            title="Material Details"
            description="Update your material details here"
            grid={3}
            fields={fields}
            avatar=""
            submitText="Save Changes"
          />
        </div>

        {/* PopoverTable at bottom left */}
        <div className="bg-white dark:bg-slate-950 rounded-lg shadow-lg sm:shadow-2xl shadow-gray-600/30 dark:shadow-md dark:shadow-gray-50/20 border border-gray-100 dark:border-gray-800 border p-2">
          <PopoverTable
            materials={selectedMaterials}
            availableMaterials={availableMaterials}
            onMaterialSelect={handleMaterialSelect}
            onQuantityChange={handleQuantityChange}
            onRemoveMaterial={handleRemoveMaterial}
            loading={loading}
            columns={rfqColumns}
            searchFields={[
              "ITEM_NAME",
              "ITEM_CODE",
              "UOM",
              "SUB_MATERIAL_NO",
              "CATEGORY",
              "SUPPLIER",
            ]}
            uniqueKey="ITEM_CODE"
            placeholderText="Search materials by name, code, category..."
            emptyMessage="No materials selected. Please select materials to add to your RFQ."
            className="h-full"
            popoverWidth="900px"
            editingQuantityId={editingQuantityId}
            setEditingQuantityId={setEditingQuantityId}
          />
        </div>
      </div>

      {/* Right Column - OrderTracking */}
      <div className="md:col-span-1">
        <OrderTracking
          orderNumber={staticOrderTrackingData.orderNumber}
          customerName={staticOrderTrackingData.customerName}
          statusItems={staticOrderTrackingData.statusItems}
          theme="dark"
          defaultOpenSection="order-placed"
        />
      </div>
    </div>
  );
};

export default PurchaseOrderPage;
