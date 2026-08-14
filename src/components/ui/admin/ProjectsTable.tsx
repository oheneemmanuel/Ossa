"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { Plus, Loader2, FolderKanban, CheckCircle2 } from "lucide-react";

type Project = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
};

export default function ProjectsTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load projects");
      setProjects(data.projects);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const activeProject = projects.find((p) => p.isActive);

  const handleCreate = async () => {
    if (!newName.trim()) {
      showToast("Project name is required", "error");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDescription }),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to create project", "error");
        return;
      }

      showToast(`"${data.project.name}" is now the active project`, "success");
      setNewName("");
      setNewDescription("");
      setShowForm(false);
      fetchProjects();
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleActivate = async (id: string, name: string) => {
    setActivatingId(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}/activate`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to activate project", "error");
        return;
      }

      showToast(`"${name}" is now the active project`, "success");
      fetchProjects();
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setActivatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between mt-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <FolderKanban className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black">Projects</h1>
            <p className="text-sm text-slate-500">
              {activeProject ? `Active: ${activeProject.name}` : "No active project"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
            Creating a new project will immediately deactivate the current one
            ({activeProject?.name ?? "none"}). All new contributions will start
            counting toward the new project right away.
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Project name (e.g. Project C)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-black placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
            />
            <textarea
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={2}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-black placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create & Activate"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-400">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-400">
                  No projects yet. Create one to get started.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-black">{project.name}</td>
                  <td className="px-4 py-3 text-slate-600">{project.description || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(project.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {project.isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleActivate(project.id, project.name)}
                        disabled={activatingId === project.id}
                        className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                      >
                        {activatingId === project.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          "Activate"
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}