import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projects";
import { useCompany } from "../context/CompanyContext";
import { useDialog } from "../context/DialogContext";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { queryKeys } from "../lib/queryKeys";
import { EntityRow } from "../components/EntityRow";
import { StatusBadge } from "../components/StatusBadge";
import { StatusIcon } from "../components/StatusIcon";
import { EmptyState } from "../components/EmptyState";
import { PageSkeleton } from "../components/PageSkeleton";
import { formatDate, projectUrl } from "../lib/utils";
import { Button } from "@/components/ui/button";
import { Hexagon, LayoutGrid, List, Plus } from "lucide-react";
import { Link } from "@/lib/router";
import type { Project } from "@paperclipai/shared";

const PROJECT_KANBAN_COLUMNS: { status: string; label: string }[] = [
  { status: "backlog",     label: "Backlog" },
  { status: "planned",     label: "Planned" },
  { status: "in_progress", label: "In Progress" },
  { status: "completed",   label: "Completed" },
  { status: "cancelled",   label: "Cancelled" },
];

function ProjectKanbanCard({ project }: { project: Project }) {
  return (
    <Link
      to={projectUrl(project)}
      className="block no-underline text-inherit rounded-md border bg-card p-3 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start gap-2 mb-1.5">
        {project.color && (
          <span
            className="inline-block w-2.5 h-2.5 rounded-full shrink-0 mt-0.5"
            style={{ backgroundColor: project.color }}
          />
        )}
        <p className="text-sm font-medium leading-snug line-clamp-2">{project.name}</p>
      </div>
      {project.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{project.description}</p>
      )}
      {project.targetDate && (
        <p className="text-xs text-muted-foreground font-mono">{formatDate(project.targetDate)}</p>
      )}
    </Link>
  );
}

function ProjectKanbanBoard({ projects }: { projects: Project[] }) {
  const grouped = useMemo(() => {
    const map: Record<string, Project[]> = {};
    for (const col of PROJECT_KANBAN_COLUMNS) {
      map[col.status] = [];
    }
    for (const p of projects) {
      if (map[p.status]) {
        map[p.status].push(p);
      }
    }
    return map;
  }, [projects]);

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2">
      {PROJECT_KANBAN_COLUMNS.map(({ status, label }) => {
        const colProjects = grouped[status] ?? [];
        const isEmpty = colProjects.length === 0;
        return (
          <div
            key={status}
            className={`flex flex-col shrink-0 transition-[width,min-width] ${
              isEmpty ? "min-w-[48px] w-[48px]" : "min-w-[240px] w-[240px]"
            }`}
          >
            <div className={`flex items-center gap-2 px-2 py-2 mb-1 ${isEmpty ? "justify-center" : ""}`}>
              <StatusIcon status={status} />
              {!isEmpty && (
                <>
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                  </span>
                  <span className="text-xs text-muted-foreground/60 ml-auto tabular-nums">
                    {colProjects.length}
                  </span>
                </>
              )}
            </div>
            <div className="flex-1 min-h-[80px] rounded-md p-1 space-y-1.5 bg-muted/20">
              {colProjects.map((project) => (
                <ProjectKanbanCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Projects() {
  const { selectedCompanyId } = useCompany();
  const { openNewProject } = useDialog();
  const { setBreadcrumbs } = useBreadcrumbs();

  const [viewMode, setViewMode] = useState<"kanban" | "list">(() => {
    return (localStorage.getItem("projects_view_mode") as "kanban" | "list") ?? "kanban";
  });

  useEffect(() => {
    localStorage.setItem("projects_view_mode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    setBreadcrumbs([{ label: "Projects" }]);
  }, [setBreadcrumbs]);

  const { data: allProjects, isLoading, error } = useQuery({
    queryKey: queryKeys.projects.list(selectedCompanyId!),
    queryFn: () => projectsApi.list(selectedCompanyId!),
    enabled: !!selectedCompanyId,
  });
  const projects = useMemo(
    () => (allProjects ?? []).filter((p) => !p.archivedAt),
    [allProjects],
  );

  if (!selectedCompanyId) {
    return <EmptyState icon={Hexagon} message="Select a company to view projects." />;
  }

  if (isLoading) {
    return <PageSkeleton variant="list" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <div className="flex items-center border border-border rounded-md overflow-hidden">
          <button
            onClick={() => setViewMode("kanban")}
            className={`p-1.5 transition-colors ${viewMode === "kanban" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
            title="Kanban view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
            title="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
        <Button size="sm" variant="outline" onClick={openNewProject}>
          <Plus className="h-4 w-4 mr-1" />
          Add Project
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error.message}</p>}

      {!isLoading && projects.length === 0 && (
        <EmptyState
          icon={Hexagon}
          message="No projects yet."
          action="Add Project"
          onAction={openNewProject}
        />
      )}

      {projects.length > 0 && viewMode === "kanban" && (
        <ProjectKanbanBoard projects={projects} />
      )}

      {projects.length > 0 && viewMode === "list" && (
        <div className="border border-border">
          {projects.map((project) => (
            <EntityRow
              key={project.id}
              title={project.name}
              subtitle={project.description ?? undefined}
              to={projectUrl(project)}
              trailing={
                <div className="flex items-center gap-3">
                  {project.targetDate && (
                    <span className="text-xs text-muted-foreground">
                      {formatDate(project.targetDate)}
                    </span>
                  )}
                  <StatusBadge status={project.status} />
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
