import { callSoapService } from "@/api/callSoapService";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, PackageSearch } from "lucide-react";
import { useEffect, useState } from "react";

// Define interfaces for data and props
interface DataItem {
  [key: string]: any; // Flexible to accommodate dynamic keys
  ITEM_NAME: string;
  SUB_ITEM_NO?: string;
  UOM_STOCK?: string;
  SUM_MATERIAL_NO?: string;
}

interface Column {
  key: string;
  header: string;
  width: string;
  align: "left" | "center" | "right";
  render?: (
    item: DataItem,
    index: number,
    editingItemId: string | null,
    setEditingItemId: (id: string | null) => void,
    handleDeleteData: (itemCode: string, event: React.MouseEvent) => void,
    handleEditData?: (itemCode: string, quantity: string) => void
  ) => JSX.Element;
}

interface UserData {
  userName: string;
  clientURL: string;
}

interface PopoverTableProps {
  data: DataItem[];
  onSelectData: (data: DataItem) => void;
  onEditData: (itemCode: string, quantity: string) => void;
  onDeleteData: (itemCode: string) => void;
  columns: Column[];
  searchFields: string[];
  uniqueKey: string;
  placeholderText: string;
  emptyMessage: string;
  popoverWidth: string;
  dataModelName?: string;
  dataModelType?: string;
  wherecondition?: string;
  orderby?: string;
}

// PopoverTable Component
export const PopoverTable: React.FC<PopoverTableProps> = ({
  data,
  onSelectData,
  onEditData,
  onDeleteData,
  columns,
  searchFields,
  uniqueKey,
  placeholderText,
  emptyMessage,
  popoverWidth,
  dataModelName,
  dataModelType,
  wherecondition,
  orderby,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<DataItem[]>(data);
  const [availableData, setAvailableData] = useState<DataItem[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { userData } = useAuth() as { userData: UserData | null };

  // Sync selectedData with prop changes
  useEffect(() => {
    setSelectedData(data);
  }, [data]);

  // Fetch data when userData is available
  useEffect(() => {
    if (userData?.userName && userData?.clientURL) {
      fetchData();
    }
  }, [userData]);

  // Reset search query when popover opens/closes
  useEffect(() => {
    if (isPopoverOpen) {
      setSearchQuery("");
    }
  }, [isPopoverOpen]);

  // Fetch data from SOAP service
  const fetchData = async (): Promise<void> => {
    setIsFetching(true);
    try {
      const payload = {
        UserName: userData!.userName,
        DataModelName: dataModelName,
        WhereCondition: wherecondition,
        Orderby: orderby,
      };
      const response = await callSoapService(userData!.clientURL, dataModelType, payload);
      setAvailableData((response as DataItem[]) || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setAvailableData([]);
    } finally {
      setIsFetching(false);
    }
  };

  // Handle data selection
  const handleDataSelect = (data: DataItem): void => {
    setIsPopoverOpen(false);
    setSearchQuery("");
    onSelectData(data);
  };

  // Handle data edit
  const handleEditData = (itemCode: string, quantity: string): void => {
    onEditData(itemCode, quantity);
  };

  // Handle data deletion
  const handleDeleteData = (itemCode: string, event: React.MouseEvent): void => {
    event.stopPropagation();
    onDeleteData(itemCode);
  };

  // Check if data is already selected
  const isDataSelected = (data: DataItem): boolean =>
    selectedData.some(
      (d) =>
        d[uniqueKey] === data[uniqueKey] &&
        d.SUB_ITEM_NO === data.SUB_ITEM_NO
    );

  return (
    <div className="space-y-2 bg-white dark:bg-slate-950 p-2 rounded-lg shadow-sm">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="h-8 w-full justify-between bg-white text-xs dark:bg-slate-950"
            disabled={isFetching}
          >
            {isFetching ? (
              "Loading data..."
            ) : selectedData?.length > 0 ? (
              `${selectedData[0][uniqueKey]} - ${selectedData[0].ITEM_NAME}${
                selectedData[0].SUB_ITEM_NO
                  ? ` - ${selectedData[0].SUB_ITEM_NO}`
                  : ""
              }`
            ) : (
              placeholderText
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 bg-white dark:bg-slate-950"
          style={{ width: popoverWidth }}
        >
          <Command className="bg-white dark:bg-slate-950">
            <CommandInput
              placeholder={placeholderText}
              className="h-9"
              value={searchQuery}
              onValueChange={setSearchQuery}
              disabled={isFetching}
            />
            <CommandList>
              {isFetching ? (
                <div className="flex items-center justify-center py-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                  <span className="ml-2">Loading data...</span>
                </div>
              ) : (
                <>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {availableData
                      .filter((data) =>
                        searchFields.some((field) =>
                          String(data[field] || "")
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        )
                      )
                      .map((data) => (
                        <CommandItem
                          key={`${data[uniqueKey]}-${data.SUB_ITEM_NO || "0"}`}
                          value={searchFields
                            .map((field) => data[field] || "")
                            .join(" ")
                            .trim()}
                          onSelect={() => handleDataSelect(data)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{data.ITEM_NAME}</span>
                            <div className="flex gap-2 text-xs text-gray-500">
                              <span>{data[uniqueKey]}</span>
                              <span>•</span>
                              <span>{data.UOM_STOCK || "-"}</span>
                              {data.SUM_MATERIAL_NO && (
                                <>
                                  <span>•</span>
                                  <span>{data.SUM_MATERIAL_NO}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              isDataSelected(data) ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="overflow-auto">
        <Table className="text-xs">
          <TableHeader className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
            <TableRow className="h-8">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "px-2 py-1",
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : ""
                  )}
                  style={{ width: col.width }}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedData?.length > 0 ? (
              selectedData.map((item, index) => (
                <TableRow
                  key={`${item[uniqueKey]}-${item.SUB_ITEM_NO || "0"}-${index}`}
                  className="h-8"
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        "px-2 py-1",
                        col.align === "right"
                          ? "text-right"
                          : col.align === "center"
                          ? "text-center"
                          : ""
                      )}
                    >
                      {col.key === "index"
                        ? index + 1
                        : col.render
                        ? col.render(
                            item,
                            index,
                            editingItemId,
                            setEditingItemId,
                            handleDeleteData,
                            handleEditData
                          )
                        : item[col.key] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="h-8">
                <TableCell
                  colSpan={columns.length}
                  className="py-4 text-center text-gray-400"
                >
                  <PackageSearch className="mx-auto mb-3 h-24 w-24 opacity-50" />
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};