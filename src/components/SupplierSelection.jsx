import { cn } from "@/lib/utils";
import {
  Check,
  ChevronsUpDown,
  Globe,
  MapPin,
  UserRound
} from "lucide-react";

import { useEffect, useState } from "react";

// Components
import { callSoapService } from "@/api/callSoapService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";

const initialValue = {
  CURRENCY_NAME: "",
  CURRENCY_CODE: "",
  CREDIT_DAYS: "",
  TRN_VAT_NO: "",
  ACCOUNT_CODE: "",
  APPROVAL_STATUS: "",
  VENDOR_NAME: "",
  CITY_NAME: "",
  COUNTRY_NAME: "",
  VENDOR_ID: "",
};

const SupplierSelection = ({
  columnHeadings = [""]
}) => {
  const [isSupplierPopoverOpen, setIsSupplierPopoverOpen] = useState(false);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [showCreditDaysInput, setShowCreditDaysInput] = useState(false);
  const [creditDays, setCreditDays] = useState("");
  const { userData } = useAuth();
  const [suppliers, setSuppliers] = useState([initialValue]);
  const [selectedSupplier, setSelectedSupplier] = useState({});

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const payload = {
        DataModelName: "VENDOR_MASTER",
        WhereCondition: "",
        Orderby: "",
      };
      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);
      setSuppliers(response);
      
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
    setCreditDays(supplier.CREDIT_DAYS || "");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "CREDIT_DAYS") {
      setCreditDays(value);
      // Update the selected supplier with new credit days
      setSelectedSupplier(prev => ({
        ...prev,
        CREDIT_DAYS: value
      }));
    }
  };

  // Internal labels configuration
  const labels = {
    supplierDetails: "Supplier Details",
    selectSupplier: "Select supplier...",
    creditDays: "Credit Days",
    dealingCurrency: "Dealing Currency",
    trnVatNo: "TRN/VAT NO",
    accountCode: "A/c Code (CR)",
    supplierRatings: "Supplier Ratings",
  };

  return (
    <div className={cn("flex w-full h-full overflow-x-hidden flex-col")}>
      <div className={cn("h-full rounded-lg p-2 border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-950 space-y-2")}>
        <div className="flex items-center justify-between border-b border-gray-200 p-2 text-sm dark:border-gray-700">
          <h2 className="text-xs font-semibold">{labels.supplierDetails}</h2>
        </div>

        {/* Supplier Selection */}
        <div className="flex flex-col gap-1">
          
            <div className="w-full overflow-x-hidden flex items-center gap-1 p-4 bg-white dark:bg-slate-950 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
            
                <div className="relative flex-shrink-0 group">
                  <img
                    src={ selectedSupplier.logoUrl || "https://seeklogo.com/images/L/logo-com-hr-logo-5636A4D2D5-seeklogo.com.png"}
                    alt="Supplier Logo"
                    className="relative h-20 w-20 rounded-full"
                  />
                </div>
            
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-800 dark:text-white truncate">
                  {selectedSupplier.VENDOR_NAME}
                </h3>

                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-blue-50 hover:bg-blue-100 text-xs px-3 py-1 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 transition-colors duration-200 flex items-center gap-1"
                  >
                    <UserRound className="h-3 w-3" />
                    {selectedSupplier.VENDOR_ID || "ID"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-green-50 hover:bg-green-100 px-3 py-1 text-xs text-green-700 dark:bg-green-900/40 dark:text-green-200 transition-colors duration-200 flex items-center gap-1"
                  >
                    <MapPin className="h-3 w-3" />
                    {selectedSupplier.CITY_NAME || "City N/A"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-orange-50 hover:bg-orange-100 px-3 py-1 text-xs text-orange-700 dark:bg-orange-900/40 dark:text-orange-200 transition-colors duration-200 flex items-center gap-1"
                  >
                    <Globe className="h-3 w-3" />
                    {selectedSupplier.COUNTRY_NAME || "Country N/A"}
                  </Badge>
                </div>
              </div>
            </div>
        

          <div className="truncate">
            <Popover open={isSupplierPopoverOpen} onOpenChange={setIsSupplierPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isSupplierPopoverOpen}
                  className="h-8 w-full justify-between truncate p-1 text-xs"
                  title={selectedSupplier?.VENDOR_NAME}
                >
                  <span className="ml-2 w-[200px] truncate text-start">
                    {selectedSupplier?.VENDOR_NAME || labels.selectSupplier}
                    <span className="text-red-600">*</span>
                  </span>
                  <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search supplier..."
                    className="h-8 text-xs"
                    value={supplierSearch}
                    onValueChange={setSupplierSearch}
                  />
                  <CommandList>
                    <CommandEmpty className="py-2 text-xs">
                      No supplier found.
                    </CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {suppliers
                        .filter((supp) => {
                          const search = supplierSearch.toLowerCase();
                          return columnHeadings.some((heading) =>
                            supp[heading] &&
                            supp[heading].toString().toLowerCase().includes(search)
                          );
                        })
                        .map((supp) => (
                          <CommandItem
                            key={supp.VENDOR_ID}
                            value={supp.VENDOR_ID.toString()}
                            onSelect={() => {
                              handleSupplierSelect(supp);
                              setIsSupplierPopoverOpen(false);
                            }}
                            className="text-xs"
                          >
                            <div className="flex w-full flex-col items-start truncate">
                              {columnHeadings.map((heading, index) => (
                                <div
                                  key={heading}
                                  className={cn(
                                    "w-full truncate",
                                    index === 0 ? "text-xs" : "text-[0.65rem] text-muted-foreground"
                                  )}
                                >
                                 
                                  <span className="truncate">
                                    {supp[heading] || "N/A"}
                                  </span>
                                   {index === 0 && (
                                    <Badge
                                      variant="secondary"
                                      className="ml-2 rounded-full px-1.5 py-0.5 text-[0.65rem]"
                                    >
                                      {supp.VENDOR_ID}
                                    </Badge>
                                  )}
                                  
                                </div>
                              ))}
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-3 w-3",
                                selectedSupplier?.VENDOR_ID === supp.VENDOR_ID
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            {/* Top Row - 4 Cards */}
            <div className="grid grid-cols-2 gap-1">
              {/* Credit Days Card */}
              <div className="bg-white dark:bg-slate-950 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="flex space-y-2 flex-col h-full justify-between">
                  <span className="text-[10px] font-medium truncate text-gray-500 uppercase tracking-wider">
                    {labels.creditDays}
                  </span>
                  {showCreditDaysInput ? (
                    <Input
                      type="text"
                      name="CREDIT_DAYS"
                      value={creditDays}
                      onChange={handleInputChange}
                      onBlur={() => setShowCreditDaysInput(false)}
                      autoFocus
                      className="h-6 text-xs"
                    />
                  ) : (
                    <span
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => setShowCreditDaysInput(true)}
                    >
                      {selectedSupplier?.CREDIT_DAYS || "N/A"}
                    </span>
                  )}
                </div>
              </div>

              {/* Dealing Currency Card */}
              <div className="bg-white truncate dark:bg-slate-950 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="flex space-y-2 flex-col h-full justify-between">
                  <span className="text-[10px] font-medium whitespace-nowrap truncate text-gray-500 uppercase tracking-wider">
                    {labels.dealingCurrency}
                  </span>
                  <span className="text-sm truncate font-medium text-gray-700 dark:text-gray-300">
                    {selectedSupplier?.CURRENCY_NAME || selectedSupplier?.CURRENCY_CODE || "N/A"}
                  </span>
                </div>
              </div>

              {/* TRN/VAT NO Card */}
              <div className="bg-white dark:bg-slate-950 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col space-y-2 h-full justify-between">
                  <span className="text-[10px] font-medium truncate text-gray-500 uppercase tracking-wider">
                    {labels.trnVatNo}
                  </span>
                  <span className="text-sm font-medium truncate text-gray-700 dark:text-gray-300">
                    {selectedSupplier?.TRN_VAT_NO || "N/A"}
                  </span>
                </div>
              </div>

              {/* A/c Code (CR) Card */}
              <div className="bg-white dark:bg-slate-950 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col space-y-2 h-full justify-between">
                  <span className="text-[10px] font-medium truncate text-gray-500 uppercase tracking-wider">
                    {labels.accountCode}
                  </span>
                  <span className="text-sm font-medium truncate text-gray-700 dark:text-gray-300">
                    {selectedSupplier?.ACCOUNT_CODE || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="space-y-1">
              {/* Supplier Ratings Card */}
              <div className="bg-white dark:bg-slate-950 rounded-lg px-2 py-1 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium truncate text-gray-500 uppercase tracking-wider">
                    {labels.supplierRatings}
                  </Label>
                  <div className="flex items-center">
                    <span
                      className={`text-sm font-medium truncate px-2 py-1 rounded 
                        ${
                          selectedSupplier?.APPROVAL_STATUS === "Approved" || selectedSupplier?.APPROVAL_STATUS === "APPROVED"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                            : selectedSupplier?.APPROVAL_STATUS === "Pending" || selectedSupplier?.APPROVAL_STATUS === "PENDING"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }`}
                    >
                      {selectedSupplier?.APPROVAL_STATUS || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierSelection;