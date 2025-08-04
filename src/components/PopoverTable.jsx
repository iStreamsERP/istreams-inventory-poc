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

const PopoverTable = ({
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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [selectedData, setSelectedData] = useState(data);
  const [availableData, setAvailableData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
    setSelectedData(data);
  }, [data]);

  useEffect(() => {
    if (userData?.userName && userData?.clientURL) {
      fetchData();
    }
  }, [userData]);

  useEffect(() => {
    if (isPopoverOpen) {
      setSearchQuery("");
    }
  }, [isPopoverOpen]);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const payload = {
        UserName: userData.userName,
        DataModelName: dataModelName,
        WhereCondition: wherecondition,
        Orderby: orderby,
      };
      const response = await callSoapService(userData.clientURL, dataModelType, payload);
      setAvailableData(response || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setAvailableData([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDataSelect = (data) => {
    setIsPopoverOpen(false);
    setSearchQuery("");
    onSelectData(data);
  };

  const handleEditData = (itemCode, quantity) => {
    onEditData(itemCode, quantity);
  };

  const handleDeleteData = (itemCode, event) => {
    event.stopPropagation();
    onDeleteData(itemCode);
  };

  const isDataSelected = (data) =>
    selectedData.some(
      (d) =>
        d[uniqueKey] === data[uniqueKey] && d.SUB_ITEM_NO === data.SUB_ITEM_NO
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
            {isFetching
              ? "Loading data..."
              : selectedData.length > 0
              ? `${selectedData[0][uniqueKey]} - ${selectedData[0].ITEM_NAME}${
                  selectedData[0].SUB_ITEM_NO ? ` - ${selectedData[0].SUB_ITEM_NO}` : ""
                }`
              : placeholderText}
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
                    col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""
                  )}
                  style={{ width: col.width }}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedData.length > 0 ? (
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
                        col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""
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

export default PopoverTable;