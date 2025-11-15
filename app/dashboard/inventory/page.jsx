"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import WarningIcon from "@mui/icons-material/Warning";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterActive, setFilterActive] = useState("all");
  const router = useRouter();

  const handleaddnavigate = () => {
    router.push("/dashboard/inventory/add");
  };

  // Fetch inventory items
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await fetch("/api/inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }

      const data = await response.json();
      setInventory(data.inventory);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this inventory item? This action cannot be undone."
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/inventory?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete inventory");
      }

      await fetchInventory();
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || item.status === filterStatus;
    const matchesActive =
      filterActive === "all" ||
      (filterActive === "active" ? item.isActive : !item.isActive);

    return matchesSearch && matchesFilter && matchesActive;
  });

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 border border-red-300";
      case "low":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "ok":
        return "bg-green-100 text-green-800 border border-green-300";
      default:
        return "bg-neutral-100 text-neutral-800 border border-neutral-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-neutral-600 mt-4">Loading inventory...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
          Inventory Management
        </h1>
        <p className="text-neutral-600">Track and manage your stock levels</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}
     
      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <SearchIcon
            className="absolute left-3 top-3 text-neutral-400"
            style={{ fontSize: "20px" }}
          />
          <input
            type="text"
            placeholder="Search by product name, ID, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
        >
          <option value="all">All Status</option>
          <option value="ok">OK - In Stock</option>
          <option value="low">Low Stock</option>
          <option value="critical">Critical</option>
        </select>

        {/* Active Status Filter */}
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
        >
          <option value="all">All Items</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>

        {/* Add Button - Navigate to add page */}
        <Link
          href="/dashboard/inventory/add"
          className="flex items-center justify-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-primary-700 font-semibold transition-colors"
        >
          <AddIcon style={{ fontSize: "20px" }} />
          Add Inventory Item
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Total Items</p>
          <p className="text-3xl font-bold text-neutral-900">
            {inventory.length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">In Stock</p>
          <p className="text-3xl font-bold text-green-600">
            {inventory.filter((i) => i.status === "ok").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Low Stock</p>
          <p className="text-3xl font-bold text-yellow-600">
            {inventory.filter((i) => i.status === "low").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Critical</p>
          <p className="text-3xl font-bold text-red-600">
            {inventory.filter((i) => i.status === "critical").length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                  Reorder Level
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                  Active
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-8 text-center text-neutral-500"
                  >
                    No inventory items found
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-neutral-200 hover:bg-neutral-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-neutral-900">
                          {item.productName}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {item.productId}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-neutral-900">
                        {item.quantity}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral-700">{item.reorderLevel}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral-700">{item.unit}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral-700">{item.location}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral-700">{item.supplier || "-"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                          item.status
                        )}`}
                      >
                        {item.status === "critical" && (
                          <WarningIcon
                            style={{ fontSize: "14px", marginRight: "4px" }}
                            className="inline"
                          />
                        )}
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          item.isActive !== false
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-neutral-100 text-neutral-800 border border-neutral-300"
                        }`}
                      >
                        {item.isActive !== false ? "✓ Active" : "✗ Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/inventory/edit?id=${item._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <EditIcon style={{ fontSize: "18px" }} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <DeleteIcon style={{ fontSize: "18px" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
