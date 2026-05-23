import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, User, Receipt, MapPin, Building2, Calculator, Library } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "/api/crm";

export default function CreateProject() {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [projectValue, setProjectValue] = useState("");
  const [salesPersonName, setSalesPersonName] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Project name is required");

    try {
      await axios.post(
        `${API_BASE}/projects`,
        { name, client, budget, location, client_address: clientAddress, gst_no: gstNo, project_value: projectValue, sales_person_name: salesPersonName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error creating project");
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-medium text-slate-800 tracking-tight">Create Project</h1>
          <p className="text-slate-500 text-sm mt-0.5">Add a new project to the CRM system</p>
        </div>

        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
          <div className="border-b border-slate-100 px-8 py-6 flex items-center gap-3">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <Library className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-700">Project Details</h2>
              <p className="text-slate-500 text-[13px] mt-0.5">Fill in the details below. All fields sync automatically.</p>
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
                    placeholder="E.g. Nexus Tower"
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
                    placeholder="Full name of the client"
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
                    placeholder="Detailed address for reports and invoices"
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
                    placeholder="GSTIN (Optional)"
                    className="h-9 text-[13px] bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 rounded-md placeholder:text-slate-400 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Row 3: 3 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5 group">
                  <Label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
                    <Calculator className="w-3.5 h-3.5 text-indigo-400" /> Target Budget
                  </Label>
                  <Input
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Allocated budget"
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
                    placeholder="Final contract value"
                    className="h-9 text-[13px] bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 rounded-md placeholder:text-slate-400 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5 group">
                  <Label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> Sales Person Name
                  </Label>
                  <Input
                    value={salesPersonName}
                    onChange={(e) => setSalesPersonName(e.target.value)}
                    placeholder="Name of the sales representative"
                    className="h-9 text-[13px] bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 rounded-md placeholder:text-slate-400 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => navigate("/")} className="h-9 px-4 text-sm font-medium text-slate-600 hover:text-slate-800">
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-5 font-medium shadow-sm text-sm rounded-lg">
                  Create Project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
