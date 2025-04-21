import { apiRequest } from "./queryClient";
import { Donation, Request, User, Organization, Testimonial, Stats } from "@/types";

// Auth API functions
export async function loginUser(username: string, password: string) {
  const response = await apiRequest("POST", "/api/login", { username, password });
  return response.json();
}

export async function registerUser(userData: any) {
  const response = await apiRequest("POST", "/api/register", userData);
  return response.json();
}

export async function getUser(id: number) {
  const response = await apiRequest("GET", `/api/user/${id}`);
  return response.json();
}

// Donation API functions
export async function getAllDonations(): Promise<Donation[]> {
  const response = await apiRequest("GET", "/api/donations");
  return response.json();
}

export async function getDonation(id: number): Promise<Donation> {
  const response = await apiRequest("GET", `/api/donations/${id}`);
  return response.json();
}

export async function getDonationsByDonor(donorId: number): Promise<Donation[]> {
  const response = await apiRequest("GET", `/api/donations/donor/${donorId}`);
  return response.json();
}

export async function createDonation(donationData: Partial<Donation>): Promise<Donation> {
  const response = await apiRequest("POST", "/api/donations", donationData);
  return response.json();
}

export async function updateDonation(id: number, donationData: Partial<Donation>): Promise<Donation> {
  const response = await apiRequest("PUT", `/api/donations/${id}`, donationData);
  return response.json();
}

// Request API functions
export async function createRequest(requestData: Partial<Request>): Promise<Request> {
  const response = await apiRequest("POST", "/api/requests", requestData);
  return response.json();
}

export async function updateRequest(id: number, requestData: Partial<Request>): Promise<Request> {
  const response = await apiRequest("PUT", `/api/requests/${id}`, requestData);
  return response.json();
}

export async function getRequestsByDonation(donationId: number): Promise<Request[]> {
  const response = await apiRequest("GET", `/api/requests/donation/${donationId}`);
  return response.json();
}

export async function getRequestsByOrganization(orgId: number): Promise<Request[]> {
  const response = await apiRequest("GET", `/api/requests/organization/${orgId}`);
  return response.json();
}

// Organization API functions
export async function getAllOrganizations(): Promise<Organization[]> {
  const response = await apiRequest("GET", "/api/organizations");
  return response.json();
}

// Testimonial API functions
export async function getAllTestimonials(): Promise<Testimonial[]> {
  const response = await apiRequest("GET", "/api/testimonials");
  return response.json();
}

export async function createTestimonial(testimonialData: Partial<Testimonial>): Promise<Testimonial> {
  const response = await apiRequest("POST", "/api/testimonials", testimonialData);
  return response.json();
}

// Stats API functions
export async function getStats(): Promise<Stats> {
  const response = await apiRequest("GET", "/api/stats");
  return response.json();
}
