"use client";

import { useEffect, useState, useCallback } from "react";
import {
  createUom,
  deleteUom,
  getUoms,
  updateUom,
  Uom,
} from "./actions";
import { downloadUomExcel } from "./DownloadUom";
import DownloadUomPdf from "./DownloadUomPdf";
import ConfirmModal from "@/components/ConfirmModal";

export default function UomPage() {
  const [uoms, setUoms] = useState<Uom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const data = await getUoms();
      setUoms(data);
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
    const confirmed = await ConfirmModal("Download UOM to Excel?", {
      okText: "Yes, Download",
      cancelText: "Cancel",
      okColor: "bg-green-600 hover:bg-green-700",
    });
    if (!confirmed) return;
    const filtered = uoms.filter(uom => 
      uom.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      uom.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    downloadUomExcel(filtered);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const filteredUoms = uoms.filter(uom => 
    uom.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    uom.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Units of Measure Management</h1>

      <div className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xl">
          <input
            type="text"
            placeholder="Search by UOM name or description..."
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
          <DownloadUomPdf uoms={filteredUoms} searchQuery={searchQuery} />
        </div>
      </div>

      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Add UOM</h2>
        <form action={createUom} className="grid gap-3 md:grid-cols-3">
          <input
            name="name"
            required
            maxLength={15}
            placeholder="UOM name (e.g. mg/dL)"
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
            {filteredUoms.map((uom) => (
              <tr key={uom.id}>
                <td colSpan={2} className="px-4 py-3">
                  <form id={`update-uom-${uom.id}`} action={updateUom} className="grid gap-2 md:grid-cols-2">
                    <input type="hidden" name="id" value={uom.id} />
                    <input
                      name="name"
                      defaultValue={uom.name}
                      required
                      maxLength={15}
                      className="w-full rounded border px-3 py-2"
                    />
                    <input
                      name="description"
                      defaultValue={uom.description ?? ""}
                      className="w-full rounded border px-3 py-2"
                    />
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      form={`update-uom-${uom.id}`}
                      className="rounded bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600"
                    >
                      Save
                    </button>
                    <form action={deleteUom}>
                      <input type="hidden" name="id" value={uom.id} />
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
            {filteredUoms.length === 0 && uoms.length > 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No UOM match your search.
                </td>
              </tr>
            )}
            {uoms.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No UOM records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
