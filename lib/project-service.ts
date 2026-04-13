/**
 * Project Management API Service
 * Handles all communication with backend project/measurement endpoints
 */

export interface ProjectResponse {
  id: number;
  user_id: number;
  name: string;
  description: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface MeasurementResponse {
  id: number;
  project_id: number;
  measurement_type: string;
  test_name: string;
  description: string;
  bands_hz: number[];
  lp_sf_db: number[];
  lp_sr_db: number[];
  lp_ext_db: number[] | null;
  lp_int_db: number[] | null;
  reverberation_times_s: number[];
  specimen_area_m2: number;
  room_volume_m3: number;
  ref_reverberation_s: number;
  ref_absorption_m2: number;
  ambient_temperature_c: number | null;
  ambient_humidity_percent: number | null;
  created_at: string;
  updated_at: string;
  is_draft: boolean;
  expires_at: string | null;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  location: string;
}

export interface CreateProjectResponse {
  project: ProjectResponse;
}

export interface SaveMeasurementResponse {
  measurement: MeasurementResponse;
}

class ProjectService {
  private baseUrl = "/api/projects";

  /**
   * Get authorization header
   */
  private getAuthHeader(): { Authorization: string } | null {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.error("Token não encontrado em localStorage");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  }

  /**
   * List all projects for current user
   */
  async listProjects(): Promise<ProjectResponse[]> {
    const auth = this.getAuthHeader();
    if (!auth) throw new Error("Token not found");

    const response = await fetch(this.baseUrl, { headers: auth });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }

  /**
   * Get project details with measurements (excluding expired drafts)
   */
  async getProject(
    projectId: number,
    includeDrafts = false,
  ): Promise<{
    project: ProjectResponse;
    measurements: MeasurementResponse[];
  }> {
    const auth = this.getAuthHeader();
    if (!auth) throw new Error("Token not found");

    const url = `${this.baseUrl}/${projectId}?include_drafts=${includeDrafts}`;
    const response = await fetch(url, { headers: auth });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }

  /**
   * Create new project
   */
  async createProject(data: CreateProjectRequest): Promise<ProjectResponse> {
    const auth = this.getAuthHeader();
    if (!auth) throw new Error("Token not found");

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        ...auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(await response.text());
    const result = await response.json();
    return result.project;
  }

  /**
   * Save draft measurement (convert to permanent)
   */
  async saveMeasurement(
    projectId: number,
    measurementId: number,
  ): Promise<MeasurementResponse> {
    const auth = this.getAuthHeader();
    if (!auth) throw new Error("Token not found");

    const url = `${this.baseUrl}/${projectId}/save-measurement`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ measurement_id: measurementId }),
    });

    if (!response.ok) throw new Error(await response.text());
    const result = await response.json();
    return result.measurement;
  }

  /**
   * Get measurement history (saved measurements + optionally non-expired drafts)
   */
  async getMeasurementHistory(
    projectId: number,
    includeDrafts = false,
  ): Promise<MeasurementResponse[]> {
    const auth = this.getAuthHeader();
    if (!auth) throw new Error("Token not found");

    const url = `${this.baseUrl}/${projectId}/history?include_drafts=${includeDrafts}`;
    const response = await fetch(url, { headers: auth });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }

  /**
   * Delete project and all measurements
   */
  async deleteProject(projectId: number): Promise<void> {
    const auth = this.getAuthHeader();
    if (!auth) throw new Error("Token not found");

    const url = `${this.baseUrl}/${projectId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: auth,
    });

    if (!response.ok) throw new Error(await response.text());
  }

  /**
   * Check if measurement is draft
   */
  isDraft(measurement: MeasurementResponse): boolean {
    return measurement.is_draft;
  }

  /**
   * Get days until expiration for draft
   */
  getDaysUntilExpiration(measurement: MeasurementResponse): number | null {
    if (!measurement.is_draft || !measurement.expires_at) return null;

    const expiresAt = new Date(measurement.expires_at);
    const now = new Date();
    const daysLeft = Math.ceil(
      (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    return daysLeft > 0 ? daysLeft : 0;
  }

  /**
   * Check if draft is expired
   */
  isExpired(measurement: MeasurementResponse): boolean {
    if (!measurement.is_draft || !measurement.expires_at) return false;
    return new Date(measurement.expires_at) < new Date();
  }
}

export const projectService = new ProjectService();
