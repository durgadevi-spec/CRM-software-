import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, User, Receipt, MapPin, Building2, Calculator, Edit3, Activity } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Select, SelectItem } from "@/components/ui/select";

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

export default function EditProject() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [projectValue, setProjectValue] = useState("");
  const [projectStatus, setProjectStatus] = useState("started");
  const [salesPersonName, setSalesPersonName] = useState("");
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`${API_BASE}/projects?search=`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const project = res.data.projects.find((p: any) => p.id === id);
      if (project) {
        setName(project.name || "");
        setClient(project.client || "");
        setBudget(project.budget || "");
        setLocation(project.location || "");
        setClientAddress(project.client_address || "");
        setGstNo(project.gst_no || "");
        setProjectValue(project.project_value || "");
        setProjectStatus(project.project_status || "started");
        setSalesPersonName(project.sales_person_name || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Project name is required");

    try {
      await axios.put(
        `${API_BASE}/projects/${id}`,
        { name, client, budget, location, client_address: clientAddress, gst_no: gstNo, project_value: projectValue, project_status: projectStatus, sales_person_name: salesPersonName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error updating project");
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-medium text-slate-800 tracking-tight">Edit Project</h1>
          <p className="text-slate-500 text-sm mt-0.5">Update existing CRM project details</p>
        </div>

        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
          <div className="border-b border-slate-100 px-8 py-6 flex items-center gap-3">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <Edit3 className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-700">Project Data</h2>
              <p className="text-slate-500 text-[13px] mt-0.5">Modifications sync seamlessly with the main database.</p>
            </div>
          </div>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: 3 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5 group">
                  <Label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Project Name *
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Project name"
                    className="h-9 text-[13px] bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 rounded-md placeholder:text-slate-400 transition-all shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5 group">
                  <Label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> Client Name
                  </Label>
                  <Input
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Client name"
                    className="h-9 text-[13px] bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 rounded-md placeholder:text-slate-400 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5 group">
                  <Label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Location
                  </Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City / Site Area"
                    className="h-9 text-[13px] bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 rounded-md placeholder:text-slate-400 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Row 2: 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 group">
                  <Label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Client Billing Address
                  </Label>
                  <Input
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Detailed address"
                    className="h-9 text-[13px] bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 rounded-md placeholder:text-slate-400 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5 group">
                  <Label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
                    <Receipt className="w-3.5 h-3.5 text-indigo-400" /> GST No.
                  </Label>
                  <Input
                    value={gstNo}
                    onChange={(e) => setGstNo(e.target.value)}
                    placeholder="GSTIN"
                    className="h-9 text-[13px] bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 rounded-md placeholder:text-slate-400 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Row 3: 4 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1.5 group">
                  <Label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
                    <Calculator className="w-3.5 h-3.5 text-indigo-400" /> Target Budget
                  </Label>
                  <Input
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Budget"
                    className="h-9 text-[13px] bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 rounded-md placeholder:text-slate-400 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5 group">
                  <Label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
                    <Receipt className="w-3.5 h-3.5 text-indigo-400" /> Project Value
                  </Label>
                  <Input
                    value={projectValue}
                    onChange={(e) => setProjectValue(e.target.value)}
                    placeholder="Final value"
                    className="h-9 text-[13px] bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 rounded-md placeholder:text-slate-400 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5 group">
                  <Label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" /> Status
                  </Label>
                  <Select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}>
                    <option value="" disabled>Select Status</option>
                    {PROJECT_STATUSES.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5 group">
                  <Label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> Sales Person
                  </Label>
                  <Input
                    value={salesPersonName}
                    onChange={(e) => setSalesPersonName(e.target.value)}
                    placeholder="Sales rep name"
                    className="h-9 text-[13px] bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 rounded-md placeholder:text-slate-400 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => navigate("/")} className="h-9 px-4 text-sm font-medium text-slate-600 hover:text-slate-800">
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-5 font-medium shadow-sm text-sm rounded-lg">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
