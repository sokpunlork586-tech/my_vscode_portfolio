import { api } from "./api";

export interface UploadResponse {
  url: string;
  filename: string;
  folder: string;
}

export const uploadService = {
  uploadFile: async (file: File, folder: string = "general"): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    return api.post<UploadResponse>("/upload", formData);
  },
};
