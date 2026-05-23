import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Edit2, Trash2, Library, User, MapPin, Calculator, LayoutGrid, List, SlidersHorizontal, X, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:3001/api/crm";

const PROJECT_STATUSES = [
  { value: 'started', label: 'Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'bom_stage', label: 'BOM Stage' },
  { value: 'boq_stage', label: 'BOQ Stage' },
  { value: 'client_approval', label: 'Client Approval' },
  { value: 'work_in_execution', label: 'Work in Execution' },
  { value: 'finance', label: 'Finance' },
  { value: 'hold', label: 'On Hold' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'closed', label: 'Closed' }
];

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (localStorage.getItem("crmViewMode") as "grid" | "list") || "grid"
  );
  const navigate = useNavigate();

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [filterClient, setFilterClient] = useState<string>("");
  const [filterSalesPerson, setFilterSalesPerson] = useState<string>("");
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("crmViewMode", viewMode);
  }, [viewMode]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchProjects();
  }, [search]);

  // Close filter dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };
    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE}/projects?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data.projects);
    } catch (err) { console.error(err); }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`${API_BASE}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (err) { console.error(err); }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("progress") || s.includes("start")) return "bg-blue-50 text-blue-600";
    if (s.includes("execution")) return "bg-green-50 text-green-600";
    if (s.includes("hold")) return "bg-orange-50 text-orange-600";
    if (s.includes("cancel")) return "bg-red-50 text-red-500";
    return "bg-slate-100 text-slate-500";
  };

  const formatStatus = (status: string) =>
    (status || "Started").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  // Filter logic
  const activeFilterCount = [filterStatus, filterLocation, filterClient, filterSalesPerson].filter(Boolean).length;

  const filteredProjects = projects.filter((p) => {
    if (filterStatus && (p.project_status || "started") !== filterStatus) return false;
    if (filterLocation && (p.location || "") !== filterLocation) return false;
    if (filterClient && (p.client || "") !== filterClient) return false;
    if (filterSalesPerson && (p.sales_person_name || "") !== filterSalesPerson) return false;
    return true;
  });

  const clearFilters = () => {
    setFilterStatus("");
    setFilterLocation("");
    setFilterClient("");
    setFilterSalesPerson("");
  };

  // Get unique locations from projects for suggestions
  const uniqueLocations = [...new Set(projects.map(p => p.location).filter(Boolean))];
  const uniqueClients = [...new Set(projects.map(p => p.client).filter(Boolean))];
  const uniqueSalesPersons = [...new Set(projects.map(p => p.sales_person_name).filter(Boolean))];

  return (
    <Layout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-slate-800 tracking-tight">Projects</h1>
            <p className="text-slate-400 text-sm mt-0.5">Manage and view all your CRM projects</p>
          </div>
          <Button
            onClick={() => navigate("/create")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium h-9 px-4 rounded-lg shadow-none"
          >
            + New project
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Search by name, client, or location…"
                className="pl-8 h-9 text-sm bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 rounded-lg placeholder:text-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filters Button */}
            <div className="relative" ref={filterRef}>
              <Button
                variant="outline"
                size="sm"
                className={`h-9 px-3 text-[13px] rounded-lg gap-1.5 border transition-colors ${
                  activeFilterCount > 0
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-indigo-600 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center leading-none min-w-[18px] min-h-[18px]">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              {/* Filter Dialog */}
              {showFilters && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <span className="text-[13px] font-semibold text-slate-700">Filter Projects</span>
                    <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Status Filter */}
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">Status</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full h-9 text-[13px] bg-white border border-slate-200 rounded-md px-3 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                      >
                        <option value="">All Statuses</option>
                        {PROJECT_STATUSES.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location Filter */}
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">Location</label>
                      <select
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="w-full h-9 text-[13px] bg-white border border-slate-200 rounded-md px-3 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                      >
                        <option value="">All Locations</option>
                        {uniqueLocations.map((loc, i) => (
                          <option key={i} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    {/* Client Filter */}
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">Client</label>
                      <select
                        value={filterClient}
                        onChange={(e) => setFilterClient(e.target.value)}
                        className="w-full h-9 text-[13px] bg-white border border-slate-200 rounded-md px-3 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                      >
                        <option value="">All Clients</option>
                        {uniqueClients.map((cl, i) => (
                          <option key={i} value={cl as string}>{cl as string}</option>
                        ))}
                      </select>
                    </div>

                    {/* Sales Person Filter */}
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">Sales Person</label>
                      <select
                        value={filterSalesPerson}
                        onChange={(e) => setFilterSalesPerson(e.target.value)}
                        className="w-full h-9 text-[13px] bg-white border border-slate-200 rounded-md px-3 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                      >
                        <option value="">All Sales Persons</option>
                        {uniqueSalesPersons.map((sp, i) => (
                          <option key={i} value={sp as string}>{sp as string}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/30">
                    <button
                      onClick={clearFilters}
                      className="text-[12px] text-red-500 hover:text-red-600 font-medium transition-colors"
                    >
                      Clear all filters
                    </button>
                    <Button
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="h-8 px-4 text-[12px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-100">
            <Button
              variant="ghost" size="sm"
              className={`h-7 px-3 text-xs rounded-md gap-1.5 ${viewMode === "grid" ? "bg-white text-indigo-600 font-medium shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grid
            </Button>
            <Button
              variant="ghost" size="sm"
              className={`h-7 px-3 text-xs rounded-md gap-1.5 ${viewMode === "list" ? "bg-white text-indigo-600 font-medium shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
              onClick={() => setViewMode("list")}
            >
              <List className="w-3.5 h-3.5" /> List
            </Button>
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] text-slate-500 font-medium">Active filters:</span>
            {filterStatus && (
              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-[12px] font-medium px-2.5 py-1 rounded-full border border-indigo-100">
                Status: {formatStatus(filterStatus)}
                <button onClick={() => setFilterStatus("")} className="hover:text-indigo-800 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filterLocation && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[12px] font-medium px-2.5 py-1 rounded-full border border-emerald-100">
                Location: {filterLocation}
                <button onClick={() => setFilterLocation("")} className="hover:text-emerald-800 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filterClient && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-[12px] font-medium px-2.5 py-1 rounded-full border border-amber-100">
                Client: {filterClient}
                <button onClick={() => setFilterClient("")} className="hover:text-amber-800 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filterSalesPerson && (
              <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-600 text-[12px] font-medium px-2.5 py-1 rounded-full border border-purple-100">
                Sales: {filterSalesPerson}
                <button onClick={() => setFilterSalesPerson("")} className="hover:text-purple-800 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button onClick={clearFilters} className="text-[11px] text-red-400 hover:text-red-500 font-medium ml-1 transition-colors">
              Clear all
            </button>
          </div>
        )}

        {/* Content */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl">
            <Library className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">No projects found</p>
            <p className="text-xs text-slate-500 mt-1">
              {activeFilterCount > 0 ? "Try adjusting your filters." : "Get started by creating your first project."}
            </p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-indigo-500 hover:text-indigo-600 font-medium mt-3 transition-colors">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* List View Header */}
            {viewMode === "list" && (
              <div className="flex flex-row items-center px-5 py-2.5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                <div className="w-[220px] shrink-0">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Project Name</span>
                </div>
                <div className="w-[160px] shrink-0">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Client</span>
                </div>
                <div className="w-[150px] shrink-0">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Location</span>
                </div>
                <div className="w-[140px] shrink-0 hidden lg:block">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sales Person</span>
                </div>
                <div className="w-[130px] shrink-0">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Value</span>
                </div>
                <div className="flex-1 text-right">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Actions</span>
                </div>
              </div>
            )}
            <div className={viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "flex flex-col gap-0"
            }>
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className={`group bg-white border border-slate-100 hover:border-indigo-200 transition-all duration-200
                  ${viewMode === "list" ? "flex flex-row items-center px-5 py-3.5 border-b border-x-0 border-t-0 border-slate-100 rounded-none last:rounded-b-xl" : "flex flex-col p-5 rounded-xl"}`}
              >
                {/* Name + Badge + Actions */}
                <div className={`flex justify-between items-start ${viewMode === "list" ? "w-[220px] shrink-0" : "mb-4"}`}>
                  <div className={viewMode === "list" ? "w-full overflow-hidden" : ""}>
                    <p className="text-[14px] font-medium text-slate-800 leading-snug line-clamp-1" title={p.name}>{p.name}</p>
                    <Badge className={`mt-1.5 border-none text-[10px] font-semibold tracking-wide px-2 py-0.5 ${getStatusColor(p.project_status)}`}>
                      {formatStatus(p.project_status)}
                    </Badge>
                  </div>
                  {viewMode === "grid" && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 mt-0.5">
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
                        onClick={() => navigate(`/edit/${p.id}`)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                        onClick={() => deleteProject(p.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Meta */}
                {viewMode === "list" ? (
                  <>
                    <div className="w-[160px] shrink-0 flex items-center gap-1.5 text-[13px] text-slate-600 overflow-hidden">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate" title={p.client || ""}>{p.client || "—"}</span>
                    </div>
                    <div className="w-[150px] shrink-0 flex items-center gap-1.5 text-[13px] text-slate-600 overflow-hidden">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate" title={p.location || ""}>{p.location || "—"}</span>
                    </div>
                    <div className="w-[140px] shrink-0 hidden lg:flex items-center gap-1.5 text-[13px] text-slate-600 overflow-hidden">
                      <UserCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate" title={p.sales_person_name || ""}>{p.sales_person_name || "—"}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-[13px] text-slate-600 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{p.client || "No client specified"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{p.location || "No location specified"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UserCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{p.sales_person_name || "No sales person"}</span>
                    </div>
                  </div>
                )}

                {/* Value */}
                <div className={`flex items-center gap-1.5 ${viewMode === "list" ? "w-[130px] shrink-0" : "mt-4 pt-3.5 border-t border-slate-100"}`}>
                  <Calculator className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {p.project_value
                    ? <span className="text-[13px] font-medium text-slate-700 truncate" title={`₹${parseFloat(p.project_value).toLocaleString("en-IN")}`}>₹{parseFloat(p.project_value).toLocaleString("en-IN")}</span>
                    : <span className="text-[13px] text-slate-500">TBD</span>
                  }
                </div>

                {/* List mode actions */}
                {viewMode === "list" && (
                  <div className="flex-1 flex gap-2 justify-end shrink-0">
                    <Button variant="outline" size="sm"
                      className="h-7 text-xs text-indigo-600 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200"
                      onClick={() => navigate(`/edit/${p.id}`)}>
                      <Edit2 className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm"
                      className="h-7 text-xs text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200"
                      onClick={() => deleteProject(p.id)}>
                      <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </Layout>
  );
}