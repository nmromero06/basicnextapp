"use client";

import { useEffect, useState, useCallback } from "react";
import {
  createMedicalTest,
  deleteMedicalTest,
  getCategoryLookup,
  getMedicalTests,
  getUomLookup,
  updateMedicalTest,
  MedicalTestRow,
  LookupItem,
} from "./actions";
import { downloadMedicalTestsExcel } from "./DownloadMedicalTests";
import DownloadMedicalTestsPdf from "./DownloadMedicalTestsPdf";
import ConfirmModal from "@/components/ConfirmModal";

export default function MedicalTestsPage() {
  const [tests, setTests] = useState<MedicalTestRow[]>([]);
  const [uoms, setUoms] = useState<LookupItem[]>([]);
  const [categories, setCategories] = useState<LookupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [testsData, uomsData, categoriesData] = await Promise.all([
        getMedicalTests(),
        getUomLookup(),
        getCategoryLookup(),
      ]);
      setTests(testsData);
      setUoms(uomsData);
      setCategories(categoriesData);
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
    const confirmed = await ConfirmModal("Download Medical Tests to Excel?", {
      okText: "Yes, Download",
      cancelText: "Cancel",
      okColor: "bg-green-600 hover:bg-green-700",
    });
    if (!confirmed) return;
    const filtered = tests.filter(test => 
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      test.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.categoryname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.uomname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    downloadMedicalTestsExcel(filtered);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const filteredTests = tests.filter(test => 
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    test.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.categoryname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.uomname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Medical Tests Management</h1>

      <div className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-2xl">
          <input
            type="text"
            placeholder="Search by test name, description, category, or unit..."
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
          <DownloadMedicalTestsPdf tests={filteredTests} searchQuery={searchQuery} />
        </div>
      </div>

      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Add Medical Test</h2>
        <form action={createMedicalTest} className="grid gap-3 lg:grid-cols-6">
          <input
            name="name"
            required
            maxLength={50}
            placeholder="Test name"
            className="rounded border px-3 py-2"
          />
          <input
            name="description"
            placeholder="Description"
            className="rounded border px-3 py-2"
          />
          <select name="idcategory" required className="rounded border px-3 py-2">
            <option value="">Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select name="iduom" required className="rounded border px-3 py-2">
            <option value="">UOM</option>
            {uoms.map((uom) => (
              <option key={uom.id} value={uom.id}>
                {uom.name}
              </option>
            ))}
          </select>
          <input name="normalmin" type="number" step="any" placeholder="Normal Min" className="rounded border px-3 py-2" />
          <input name="normalmax" type="number" step="any" placeholder="Normal Max" className="rounded border px-3 py-2" />
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 lg:col-span-6"
          >
            Add
          </button>
        </form>
      </section>

      <section className="overflow-auto rounded-lg border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Test Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Description</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Unit</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Min</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Max</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredTests.map((test) => (
              <tr key={test.id}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{test.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{test.description ?? "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{test.categoryname}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{test.uomname}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{test.normalmin ?? "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{test.normalmax ?? "-"}</td>
                <td className="px-4 py-3 text-sm">
                  <details>
                    <summary className="cursor-pointer rounded bg-amber-500 px-3 py-1 font-semibold text-white hover:bg-amber-600 inline-block">
                      Edit
                    </summary>
                    <form action={updateMedicalTest} className="mt-3 grid gap-2 md:grid-cols-2">
                      <input type="hidden" name="id" value={test.id} />
                      <input
                        name="name"
                        defaultValue={test.name}
                        required
                        className="rounded border px-3 py-2"
                      />
                      <input
                        name="description"
                        defaultValue={test.description ?? ""}
                        className="rounded border px-3 py-2"
                      />
                      <select
                        name="idcategory"
                        defaultValue={String(test.idcategory)}
                        required
                        className="rounded border px-3 py-2"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <select
                        name="iduom"
                        defaultValue={String(test.iduom)}
                        required
                        className="rounded border px-3 py-2"
                      >
                        {uoms.map((uom) => (
                          <option key={uom.id} value={uom.id}>
                            {uom.name}
                          </option>
                        ))}
                      </select>
                      <input
                        name="normalmin"
                        type="number"
                        step="any"
                        defaultValue={test.normalmin ?? ""}
                        className="rounded border px-3 py-2"
                      />
                      <input
                        name="normalmax"
                        type="number"
                        step="any"
                        defaultValue={test.normalmax ?? ""}
                        className="rounded border px-3 py-2"
                      />
                      <button
                        type="submit"
                        className="rounded bg-amber-500 px-3 py-2 font-semibold text-white hover:bg-amber-600 md:col-span-2"
                      >
                        Save Changes
                      </button>
                    </form>
                  </details>
                  <form action={deleteMedicalTest} className="mt-2">
                    <input type="hidden" name="id" value={test.id} />
                    <button
                      type="submit"
                      className="rounded bg-red-600 px-3 py-1 font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {filteredTests.length === 0 && tests.length > 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No medical tests match your search.
                </td>
              </tr>
            )}
            {tests.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No medical test records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
