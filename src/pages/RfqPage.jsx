import { useState } from "react";
import PopoverTable from "@/components/PopoverTable";
import SupplierSelection from "@/components/SupplierSelection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import OrderTracking from "@/components//OrderTracking";

export const RfqPage = () => {
  const [materials, setMaterials] = useState([]);

  const handleMaterialSelect = (material) => {
    setMaterials((prev) => {
      if (
        prev.some(
          (m) =>
            m.ITEM_CODE === material.ITEM_CODE &&
            m.SUB_ITEM_NO === material.SUB_ITEM_NO
        )
      ) {
        return prev;
      }
      return [...prev, { ...material, QUANTITY: 1 }];
    });
  };

  const handleQuantityChange = (itemCode, quantity) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.ITEM_CODE === itemCode
          ? { ...m, QUANTITY: parseInt(quantity) || 1 }
          : m
      )
    );
  };

  const handleRemoveMaterial = (itemCode) => {
    setMaterials((prev) => prev.filter((m) => m.ITEM_CODE !== itemCode));
  };

  const columns = [
    { key: "index", header: "S.No", width: "10%" },
    { key: "ITEM_CODE", header: "Code", width: "15%" },
    { key: "ITEM_NAME", header: "Material Name", width: "30%" },
    { key: "UOM_STOCK", header: "UOM", width: "15%" },
    {
      key: "QUANTITY",
      header: "Quantity",
      width: "20%",
      align: "center",
      render: (item, index, editingId, setEditingId, onDelete, onEdit) => {
        const isEditing = editingId === item.ITEM_CODE;
        return (
          <div
            className="h-8 w-20 text-center flex items-center justify-center"
            onClick={() => setEditingId(item.ITEM_CODE)}
          >
            {isEditing ? (
              <Input
                type="number"
                value={item.QUANTITY || 1}
                onChange={(e) => onEdit(item.ITEM_CODE, e.target.value)}
                onBlur={() => setEditingId(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") {
                    setEditingId(null);
                  }
                }}
                className="h-8 w-20 text-center"
                min="1"
                autoFocus
              />
            ) : (
              <span className="h-8 flex items-center justify-center">
                {item.QUANTITY || 1}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "10%",
      align: "center",
      render: (item, index, editingId, setEditingId, onDelete) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => onDelete(item.ITEM_CODE, e)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-1">
      <div className="col-span-5">
        <PopoverTable
          data={materials}
          onSelectData={handleMaterialSelect}
          onEditData={handleQuantityChange}
          onDeleteData={handleRemoveMaterial}
          columns={columns}
          searchFields={["ITEM_CODE", "ITEM_NAME", "SUB_ITEM_NO"]}
          uniqueKey="ITEM_CODE"
          placeholderText="Search materials..."
          emptyMessage="No materials selected."
          popoverWidth="600px"
          dataModelName="INVT_PO_REQUISITIONLIST"
          dataModelType="DataModel_GetData"
        />
      </div>
      <div className="col-span-4">
        <SupplierSelection columnHeadings={["VENDOR_NAME", "COUNTRY_NAME"]} />
      </div>
    </div>
  );
};
