"use client";

import { useEffect, useState, useCallback } from "react";
import {
  createTestCategory,
  deleteTestCategory,
  getTestCategories,
  updateTestCategory,
  TestCategory,
} from "./actions";
import { downloadTestCategoriesExcel } from "./DownloadTestCategories";
import DownloadTestCategoriesPdf from "./DownloadTestCategoriesPdf";
import ConfirmModal from "@/components/ConfirmModal";

export default function TestCategoriesPage() {
  const [categories, setCategories] = useState<TestCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const data = await getTestCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownloadExcel = async () => {
    const confirmed = await ConfirmModal("Download Test Categories to Excel?", {
      okText: "Yes, Download",
      cancelText: "Cancel",
      okColor: "bg-green-600 hover:bg-green-700",
    });
    if (!confirmed) return;
    const filtered = categories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      category.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    downloadTestCategoriesExcel(filtered);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Medical Test Categories Management</h1>

      <div className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xl">
          <input
            type="text"
            placeholder="Search by category name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 pr-16 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
            onClick={() => setSearchQuery("")}
          >
            Clear
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadExcel}
            className="rounded-md bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors shadow-sm whitespace-nowrap"
            title="Download to Excel"
          >
            Download Excel
          </button>
          <DownloadTestCategoriesPdf categories={filteredCategories} searchQuery={searchQuery} />
        </div>
      </div>

      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Add Category</h2>
        <form action={createTestCategory} className="grid gap-3 md:grid-cols-3">
          <input
            name="name"
            required
            maxLength={50}
            placeholder="Category name (e.g. CBC)"
            className="rounded border px-3 py-2"
          />
          <input
            name="description"
            placeholder="Description"
            className="rounded border px-3 py-2"
          />
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Add
          </button>
        </form>
      </section>

      <section className="overflow-auto rounded-lg border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Description</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredCategories.map((category) => (
              <tr key={category.id}>
                <td colSpan={2} className="px-4 py-3">
                  <form id={`update-category-${category.id}`} action={updateTestCategory} className="grid gap-2 md:grid-cols-2">
                    <input type="hidden" name="id" value={category.id} />
                    <input
                      name="name"
                      defaultValue={category.name}
                      required
                      maxLength={50}
                      className="w-full rounded border px-3 py-2"
                    />
                    <input
                      name="description"
                      defaultValue={category.description ?? ""}
                      className="w-full rounded border px-3 py-2"
                    />
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      form={`update-category-${category.id}`}
                      className="rounded bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600"
                    >
                      Save
                    </button>
                    <form action={deleteTestCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <button
                        type="submit"
                        className="rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && categories.length > 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No categories match your search.
                </td>
              </tr>
            )}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No category records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
