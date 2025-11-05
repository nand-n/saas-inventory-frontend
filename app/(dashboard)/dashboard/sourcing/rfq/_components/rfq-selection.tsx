import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export interface RFQItem {
  id: string;
  itemNo: string;
  quantity: number;
  committedQty: number | string;
  description: string;
  lt: number;
  revision: string;
  lineTotal: number;
  hasNote: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  email: string;
  totalBidAmt: number;
  items: RFQItem[];
  vendorNumber: number;
}

const dummyVendors: Vendor[] = [
  {
    id: "vendor-1",
    name: "EMERSON SRL",
    contactName: "JOHN SMITH",
    email: "ja-sourceday@sourceday.com",
    totalBidAmt: 15720.1,
    vendorNumber: 2,
    items: [
      {
        id: "item-1",
        itemNo: "Gasket",
        quantity: 10,
        committedQty: 10,
        description: "G9823",
        lt: 7,
        revision: "A",
        lineTotal: 50.0,
        hasNote: false,
      },
      {
        id: "item-2",
        itemNo: "Motor Skid",
        quantity: 0,
        committedQty: "1*",
        description: "MS0983",
        lt: 21,
        revision: "A",
        lineTotal: 10000.0,
        hasNote: false,
      },
      {
        id: "item-3",
        itemNo: "Motor",
        quantity: 0,
        committedQty: "1*",
        description: "M0923",
        lt: 21,
        revision: "A",
        lineTotal: 2000.0,
        hasNote: false,
      },
      {
        id: "item-4",
        itemNo: "Gas Tank",
        quantity: 0,
        committedQty: "1*",
        description: "GT02938",
        lt: 14,
        revision: "A",
        lineTotal: 5000.0,
        hasNote: false,
      },
    ],
  },
  {
    id: "vendor-2",
    name: "COM SAS",
    contactName: "Jon Mike",
    email: "abc@gmail.com",
    totalBidAmt: 27244.0,
    vendorNumber: 3,
    items: [
      {
        id: "item-5",
        itemNo: "Gasket",
        quantity: 10,
        committedQty: 10,
        description: "Quality Gasket",
        lt: 7,
        revision: "A",
        lineTotal: 500.0,
        hasNote: false,
      },
      {
        id: "item-6",
        itemNo: "Motor Skid",
        quantity: 0,
        committedQty: "1*",
        description: "Skid",
        lt: 7,
        revision: "A",
        lineTotal: 10000.0,
        hasNote: true,
      },
      {
        id: "item-7",
        itemNo: "Motor",
        quantity: 0,
        committedQty: "1*",
        description: "Motor",
        lt: 7,
        revision: "B",
        lineTotal: 12500.0,
        hasNote: true,
      },
      {
        id: "item-8",
        itemNo: "Gas Tank",
        quantity: 0,
        committedQty: "1*",
        description: "Gas Tank",
        lt: 7,
        revision: "A",
        lineTotal: 5000.0,
        hasNote: true,
      },
    ],
  },
];

export const RFQSelection = () => {
  // Initialize with all items from vendor 1 selected
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(dummyVendors[0].items.map((item) => item.id))
  );

  const toggleItem = (itemId: string, itemNo: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        // Deselect any other items with the same itemNo from other vendors
        dummyVendors.forEach((vendor) => {
          vendor.items.forEach((item) => {
            if (item.itemNo === itemNo && item.id !== itemId) {
              newSet.delete(item.id);
            }
          });
        });
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const selectAllVendor = (vendorId: string) => {
    const vendor = dummyVendors.find((v) => v.id === vendorId);
    if (vendor) {
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        // Deselect items with same itemNo from other vendors
        vendor.items.forEach((item) => {
          dummyVendors.forEach((v) => {
            if (v.id !== vendorId) {
              v.items.forEach((otherItem) => {
                if (otherItem.itemNo === item.itemNo) {
                  newSet.delete(otherItem.id);
                }
              });
            }
          });
          newSet.add(item.id);
        });
        return newSet;
      });
    }
  };

  const deselectAllVendor = (vendorId: string) => {
    const vendor = dummyVendors.find((v) => v.id === vendorId);
    if (vendor) {
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        vendor.items.forEach((item) => newSet.delete(item.id));
        return newSet;
      });
    }
  };

  const clearAll = () => {
    setSelectedItems(new Set());
  };

  const awardSelections = () => {
    const selectedCount = selectedItems.size;
    alert(`Awarding ${selectedCount} selected items`);
  };

  const calculateVendorSubtotal = (vendor: Vendor) => {
    return vendor.items
      .filter((item) => selectedItems.has(item.id))
      .reduce((sum, item) => sum + item.lineTotal, 0);
  };

  const calculateGrandTotal = () => {
    return dummyVendors.reduce((total, vendor) => {
      return total + calculateVendorSubtotal(vendor);
    }, 0);
  };

  const hasSelectedItems = (vendor: Vendor) => {
    return vendor.items.some((item) => selectedItems.has(item.id));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex gap-4">
          {/* Sidebar */}
          <div className="w-[200px] flex-shrink-0">
            <div className="space-y-3">
              <button
                onClick={awardSelections}
                className="w-full bg-[#8BC34A] hover:bg-[#7CB342] text-white font-medium py-3 px-6 rounded-full shadow-md transition-colors"
              >
                Award
                <br />
                Selections
              </button>
              <button
                onClick={clearAll}
                className="w-full bg-[#00BCD4] hover:bg-[#00ACC1] text-white font-medium py-3 px-6 rounded-full shadow-md transition-colors"
              >
                Clear All
              </button>
              <div className="bg-white border border-gray-300 rounded-lg p-4 mt-6 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Selected Total Amt</p>
                <p className="text-xs text-gray-500 mb-2">
                  * excludes taxes & discounts
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ${calculateGrandTotal()
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </p>
              </div>
            </div>
          </div>

          {/* Vendor Cards */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            {dummyVendors.map((vendor) => {
              const subtotal = calculateVendorSubtotal(vendor);
              const hasSelections = hasSelectedItems(vendor);

              return (
                <div
                  key={vendor.id}
                  className="bg-white border border-gray-300 rounded-lg shadow-sm"
                >
                  {/* Vendor Header */}
                  <div className="border-b border-gray-300 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                            {vendor.vendorNumber}
                          </div>
                          <h2 className="text-lg font-bold text-gray-900">
                            {vendor.name}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="font-semibold text-gray-900 text-sm">
                        {vendor.contactName}
                      </p>
                      <p className="text-sm text-gray-600">{vendor.email}</p>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm text-gray-700">
                          Total Bid Amt
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          $
                          {vendor.totalBidAmt
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm text-gray-700">
                          Selected Subtotal
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ${subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 ml-0">
                        * excludes taxes & discounts
                      </p>
                    </div>
                    <div className="flex justify-center">
                      {hasSelections ? (
                        <button
                          onClick={() => deselectAllVendor(vendor.id)}
                          className="bg-[#F44336] hover:bg-[#E53935] text-white font-medium py-2 px-8 rounded-full shadow-md transition-colors text-sm"
                        >
                          De-select All
                        </button>
                      ) : (
                        <button
                          onClick={() => selectAllVendor(vendor.id)}
                          className="bg-[#8BC34A] hover:bg-[#7CB342] text-white font-medium py-2 px-8 rounded-full shadow-md transition-colors text-sm"
                        >
                          Select All
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 border-b border-gray-300">
                        <tr>
                          {vendor.id === "vendor-1" && (
                            <>
                              <th className="px-3 py-2 text-left font-bold text-gray-900 border-r border-gray-300">
                                Item No
                              </th>
                              <th className="px-3 py-2 text-center font-bold text-gray-900 border-r border-gray-300">
                                Quantity
                              </th>
                              <th className="px-3 py-2 text-center font-bold text-gray-900 border-r border-gray-300"></th>
                            </>
                          )}
                          {vendor.id === "vendor-2" && (
                            <th className="px-3 py-2 text-center font-bold text-gray-900 border-r border-gray-300 w-12"></th>
                          )}
                          <th className="px-3 py-2 text-center font-bold text-gray-900 border-r border-gray-300">
                            Committed Qty
                          </th>
                          <th className="px-3 py-2 text-left font-bold text-gray-900 border-r border-gray-300">
                            Description
                          </th>
                          <th className="px-3 py-2 text-center font-bold text-gray-900 border-r border-gray-300">
                            LT
                          </th>
                          <th className="px-3 py-2 text-center font-bold text-gray-900 border-r border-gray-300">
                            Revision
                          </th>
                          <th className="px-3 py-2 text-right font-bold text-gray-900 border-r border-gray-300">
                            Line Total
                          </th>
                          <th className="px-3 py-2 text-center font-bold text-gray-900">
                            Note
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendor.items.map((item) => {
                          const isSelected = selectedItems.has(item.id);

                          return (
                            <tr
                              key={item.id}
                              className={`border-b border-gray-200 ${
                                isSelected
                                  ? "bg-[#76FF03]"
                                  : "bg-white hover:bg-gray-50"
                              }`}
                            >
                              {vendor.id === "vendor-1" && (
                                <>
                                  <td className="px-3 py-3 border-r border-gray-200">
                                    <span
                                      className={`font-medium ${
                                        isSelected
                                          ? "text-gray-900"
                                          : "text-[#00BCD4]"
                                      }`}
                                    >
                                      {item.itemNo}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3 text-center border-r border-gray-200 text-gray-900 font-medium">
                                    {item.quantity}
                                  </td>
                                  <td className="px-3 py-3 text-center border-r border-gray-200">
                                    <Switch
                                      checked={isSelected}
                                      onCheckedChange={() => toggleItem(item.id, item.itemNo)}
                                      className="data-[state=checked]:bg-[#2196F3]"
                                    />
                                  </td>
                                </>
                              )}
                              {vendor.id === "vendor-2" && (
                                <td className="px-3 py-3 text-center border-r border-gray-200">
                                  <Switch
                                    checked={isSelected}
                                    onCheckedChange={() => toggleItem(item.id, item.itemNo)}
                                    className="data-[state=checked]:bg-[#2196F3]"
                                  />
                                </td>
                              )}
                              <td
                                className={`px-3 py-3 text-center font-bold border-r border-gray-200 ${
                                  isSelected ? "text-gray-900" : "text-gray-500"
                                }`}
                              >
                                {item.committedQty}
                              </td>
                              <td
                                className={`px-3 py-3 border-r border-gray-200 ${
                                  isSelected
                                    ? "text-gray-900 font-medium"
                                    : "text-gray-500 italic"
                                }`}
                              >
                                {item.description}
                              </td>
                              <td
                                className={`px-3 py-3 text-center border-r border-gray-200 ${
                                  isSelected ? "text-gray-900" : "text-gray-500"
                                }`}
                              >
                                {item.lt}
                              </td>
                              <td
                                className={`px-3 py-3 text-center border-r border-gray-200 ${
                                  isSelected ? "text-gray-900" : "text-gray-500"
                                }`}
                              >
                                {item.revision}
                              </td>
                              <td
                                className={`px-3 py-3 text-right border-r border-gray-200 ${
                                  isSelected
                                    ? "text-gray-900 font-medium"
                                    : "text-gray-500"
                                }`}
                              >
                                $
                                {item.lineTotal
                                  .toFixed(2)
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                              </td>
                              <td className="px-3 py-3 text-center">
                                {item.hasNote && (
                                  <div className="inline-block w-3 h-3 bg-[#FF9800] rounded-sm"></div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 text-xs text-gray-600 italic">
                    * the committed quantity is different than the quantity
                    requested
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
