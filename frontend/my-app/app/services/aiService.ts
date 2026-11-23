import api from "../lib/axios";

export type GeneratedAiTask = {
  title: string;
  description: string;
};

type GenerateAiTasksResponse = {
  message: string;
  task: GeneratedAiTask[];
};

export const generateAiTasks = async (
  teamId: string,
  projectId: string,
): Promise<GeneratedAiTask[]> => {
  const response = await api.post<GenerateAiTasksResponse>(
    `/ai/teams/${teamId}/projects/${projectId}/generate-tasks`,
  );

  return response.data.task;
};
