"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  projectService,
  MeasurementResponse,
  ProjectResponse,
} from "@/lib/project-service";
import { useAuth } from "@/lib/auth-context";
import { TEST_TYPES } from "@/lib/types";

const statusConfig = {
  saved: {
    label: "Salvo",
    variant: "default" as const,
    className: "bg-success/10 text-success border-success/20",
  },
  draft: {
    label: "Rascunho",
    variant: "secondary" as const,
    className: "bg-warning/10 text-warning border-warning/20",
  },
};

interface ProjectWithMeasurements {
  project: ProjectResponse;
  measurements: MeasurementResponse[];
}

export function RecentTests() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectWithMeasurements[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "drafts">("all");

  useEffect(() => {
    if (user) {
      loadProjects(filterType === "drafts");
    }
  }, [user, filterType]);

  const loadProjects = async (includeDrafts: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const allProjects = await projectService.listProjects();

      // Get measurements for each project
      const projectsWithMeasurements = await Promise.all(
        allProjects.map(async (project) => {
          try {
            const data = await projectService.getProject(project.id, includeDrafts);
            return {
              project,
              measurements: data.measurements || [],
            };
          } catch (err) {
            console.error(
              `Erro ao buscar medições do projeto ${project.id}:`,
              err,
            );
            return {
              project,
              measurements: [],
            };
          }
        }),
      );

      setProjects(projectsWithMeasurements);
    } catch (err) {
      console.error("Erro ao carregar projetos:", err);
      setError("Erro ao carregar histórico");
    } finally {
      setLoading(false);
    }
  };

  // Flatten measurements from all projects for display
  const allMeasurements = projects
    .flatMap((pw) =>
      pw.measurements.map((m) => ({
        ...m,
        projectName: pw.project.name,
        projectId: pw.project.id,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  // Filter by type if needed
  const displayMeasurements = 
    filterType === "drafts"
      ? allMeasurements.filter((m) => projectService.isDraft(m))
      : allMeasurements;

  if (!user) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Histórico</CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <p className="text-center text-sm text-muted-foreground">
            Faça login para ver o histórico
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Histórico</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Histórico</CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <p className="text-center text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (displayMeasurements.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Histórico</CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <p className="text-center text-sm text-muted-foreground">
            {filterType === "drafts"
              ? "Nenhum rascunho disponível"
              : "Nenhum ensaio realizado ainda"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-medium">
            {filterType === "drafts" ? "Rascunhos" : "Ensaios Recentes"} ({displayMeasurements.length})
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant={filterType === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterType("all")}
              className="text-xs"
            >
              Todos
            </Button>
            <Button
              variant={filterType === "drafts" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterType("drafts")}
              className="text-xs"
            >
              Rascunhos
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {displayMeasurements.slice(0, 5).map((measurement) => {
            const isDraft = projectService.isDraft(measurement);
            const daysLeft = projectService.getDaysUntilExpiration(measurement);
            const status = isDraft ? statusConfig.draft : statusConfig.saved;

            return (
              <div
                key={measurement.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-mono font-medium text-primary">
                      {measurement.measurement_type
                        .substring(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">
                        {measurement.projectName}
                      </p>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {measurement.test_name}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {new Date(measurement.created_at).toLocaleDateString(
                          "pt-BR",
                        )}
                      </span>
                      {isDraft && daysLeft !== null && (
                        <span className="text-xs text-warning font-medium">
                          Expira em {daysLeft} dia{daysLeft !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!isDraft && measurement.lp_sf_db?.[0] && (
                    <span className="text-sm font-mono text-foreground hidden sm:block">
                      {measurement.lp_sf_db[0].toFixed(1)} dB
                    </span>
                  )}
                  <Badge variant={status.variant} className={status.className}>
                    {status.label}
                  </Badge>
                  {isDraft && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-primary"
                      onClick={() =>
                        saveMeasurement(measurement.projectId, measurement.id)
                      }
                    >
                      Salvar
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      {!isDraft && (
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  async function saveMeasurement(projectId: number, measurementId: number) {
    try {
      await projectService.saveMeasurement(projectId, measurementId);
      // Reload projects
      loadProjects();
    } catch (err) {
      console.error("Erro ao salvar medição:", err);
    }
  }
}
