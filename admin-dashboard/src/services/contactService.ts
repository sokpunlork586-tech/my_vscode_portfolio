import { api } from "./api";
import { ContactInfo, SocialLink } from "@/types";

export const contactService = {
  get: () => api.get<ContactInfo>("/contact"),

  update: (data: Partial<ContactInfo>) => api.put<ContactInfo>("/contact", data),

  listSocialLinks: () => api.get<SocialLink[]>("/contact/social-links"),

  createSocialLink: (data: Partial<SocialLink>) =>
    api.post<SocialLink>("/contact/social-links", data),

  updateSocialLink: (id: number, data: Partial<SocialLink>) =>
    api.put<SocialLink>(`/contact/social-links/${id}`, data),

  deleteSocialLink: (id: number) =>
    api.delete<void>(`/contact/social-links/${id}`),
};

