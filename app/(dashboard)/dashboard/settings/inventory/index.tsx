import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/commons/toastProvider";
import { useAsync } from "@/hooks/useAsync";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import type { InventoryCategory } from "@/types/inventory";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { handleApiError } from "@/lib/utils";
import Modal from "@/components/ui/commons/modalWrapper";
import useUserStore from "@/store/users/user.store";

const InventoryCategorySetting = () => {
  const { showToast } = useToast();
  const { tenantId } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<InventoryCategory | null>(null);
  const [formData, setFormData] = useState({
    category_name: "",
    description: "",
  });

  const {
    data: inventoryCategories,
    loading: isLoading,
    error: inventoryError,
    execute,
  } = useAsync(
    () =>
      axiosInstance
        .get(`/inventory/inventory-categories/`)
        .then((res) => res.data),
    true
  );

  const refresh = () => execute();

  const handleSave = async () => {
    try {
      if (selectedCategory) {
        await axiosInstance.patch(
          `/inventory/inventory-categories/${selectedCategory.id}`,
          formData
        );
        // showToast("Category updated successfully")
      } else {
        await axiosInstance.post(`/inventory/inventory-categories`, {
          ...formData,
          tenant_id: tenantId,
        });
        showToast("default", "Success!", "Category created successfully");
      }
      setIsModalOpen(false);
      setFormData({ category_name: "", description: "" });
      setSelectedCategory(null);
      refresh();
    } catch (error) {
      showToast("destructive", "Error!", handleApiError(error));
    }
  };

  const handleEdit = (category: InventoryCategory) => {
    setSelectedCategory(category);
    setFormData({
      category_name: category.category_name,
      description: category.description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (category: InventoryCategory) => {
    try {
      await axiosInstance.delete(
        `/inventory/inventory-categories/${category.id}`
      );
      showToast("default", "Success!", "Category deleted successfully");

      refresh();
    } catch (error) {
      showToast("destructive", "Error!", handleApiError(error));
    }
  };

  const inventoryCategoriesColumns: ColumnDef<InventoryCategory>[] = [
    {
      accessorKey: "category_name",
      header: "Category Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleEdit(category)}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(category)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inventory Categories</CardTitle>
        <Button onClick={() => setIsModalOpen(true)}>Add Category</Button>
      </CardHeader>
      <CardContent>
        <TableWrapper<InventoryCategory>
          columns={inventoryCategoriesColumns}
          data={inventoryCategories || []}
          loading={isLoading}
          title="Inventory Category List"
        />
      </CardContent>

      <Modal
        title={selectedCategory ? "Edit Category" : "Add Category"}
        description={
          selectedCategory ? "Update category details" : "Create a new category"
        }
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCancel={() => {
          setSelectedCategory(null);
          setFormData({ category_name: "", description: "" });
        }}
        onConfirm={handleSave}
        modalTrigger={<div />} // controlled externally
      >
        <div className="grid gap-4 py-4 p-1">
          <Input
            placeholder="Category Name"
            value={formData.category_name}
            onChange={(e) =>
              setFormData({ ...formData, category_name: e.target.value })
            }
          />
          <Input
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
      </Modal>
    </Card>
  );
};

const InventorySettings = () => {
  return (
    <Tabs defaultValue="inventoryCategory" className="max-w-full mx-auto">
      <TabsList className="flex justify-start space-x-1 border-b overflow-x-auto scrollbar-hide">
        <TabsTrigger value="inventoryCategory">Inventory Category</TabsTrigger>
      </TabsList>

      <TabsContent value="inventoryCategory">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Inventory Category</h2>
          <p className="text-muted-foreground">Manage Inventory Category.</p>
        </div>
        <InventoryCategorySetting />
      </TabsContent>

      {/* <TabsContent value="billing">
          <Billing />
        </TabsContent> */}
    </Tabs>
  );
};

export default InventorySettings;
