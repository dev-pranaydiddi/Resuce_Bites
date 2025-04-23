// src/lib/donation-api.js
import { apiRequest } from "./apiClient";

// ── Auth ──────────────────────────────────────────────────────────────────────

/** @param {string} username @param {string} password */
export function loginUser(username, password) {
  return apiRequest("POST", "/api/login", { username, password })
    .then(res => res.json());
}

/** @param {object} userData */
export function registerUser(userData) {
  console.log("registerUser", userData)
  return apiRequest("POST", "/api/register", userData)
    .then(res => res.json());
}

/** @param {number} id */
export function getUser(id) {
  return apiRequest("GET", `/api/user/${id}`)
    .then(res => res.json());
}

/** Check session and return { user, organization } */
export function checkSession() {
  return apiRequest("GET", "/api/session")
    .then(res => res.json());
}

/** Log out current user */
export function logoutUser() {
  return apiRequest("POST", "/api/logout")
    .then(res => res.text()); // or .json() depending on your API
}

// ── Donations ────────────────────────────────────────────────────────────────

export function getAllDonations() {
  return apiRequest("GET", "/api/donations").then(res => res.json());
}

/** @param {number} id */
export function getDonation(id) {
  return apiRequest("GET", `/api/donations/${id}`).then(res => res.json());
}


/** @param {number} donorId */
export function getDonationsByDonor(donorId) {
  return apiRequest("GET", `/api/donations/donor/${donorId}`)
    .then(res => res.json());
}

/** @param {object} donationData */
export function createDonation(donationData) {
  return apiRequest("POST", "/api/donations", donationData)
    .then(res => res.json());
}

/** @param {number} id @param {object} donationData */
export function updateDonation(id, donationData) {
  return apiRequest("PUT", `/api/donations/${id}`, donationData)
    .then(res => res.json());
}

// ── Requests ─────────────────────────────────────────────────────────────────

/** @param {object} requestData */
export function createRequest(requestData) {
  return apiRequest("POST", "/api/requests", requestData)
    .then(res => res.json());
}

/** @param {number} id @param {object} requestData */
export function updateRequest(id, requestData) {
  return apiRequest("PUT", `/api/requests/${id}`, requestData)
    .then(res => res.json());
}

/** @param {number} donationId */
export function getRequestsByDonation(donationId) {
  return apiRequest("GET", `/api/requests/donation/${donationId}`)
    .then(res => res.json());
}

/** @param {number} orgId */
export function getRequestsByOrganization(orgId) {
  return apiRequest("GET", `/api/requests/organization/${orgId}`)
    .then(res => res.json());
}

// ── Organizations ────────────────────────────────────────────────────────────

export function getAllOrganizations() {
  return apiRequest("GET", "/api/organizations").then(res => res.json());
}

// ── Testimonials ─────────────────────────────────────────────────────────────

export function getAllTestimonials() {
  return apiRequest("GET", "/api/testimonials").then(res => res.json());
}

/** @param {object} testimonialData */
export function createTestimonial(testimonialData) {
  return apiRequest("POST", "/api/testimonials", testimonialData)
    .then(res => res.json());
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export function getStats() {
  return apiRequest("GET", "/api/stats").then(res => res.json());
}
