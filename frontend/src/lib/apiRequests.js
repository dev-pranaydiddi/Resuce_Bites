// src/lib/donation-api.js
import { DONATION, USER,REQUEST, DELIVERY } from "@/Endpoints";
import { apiRequest } from "./apiClient";

// ── Auth ──────────────────────────────────────────────────────────────────────

/** @param {object} userData*/
export async function loginUser(userData) {
  console.log("loginUser", userData)
  try{
  const res = await apiRequest("POST", `${USER}/login`, { userData})
      // console.log("loginUser", res)
      return res;
  }
  catch (err) {
    // console.log("loginUser error", err);
    return err;
  }
}

/** @param {object} userData */
export function registerUser(userData) {
  console.log("registerUser", userData)
  return apiRequest("POST", `${USER}/register`, {userData})
    .then(res => res);
}

/** @param {number} id */
export function getUser(id) {
  return apiRequest("GET", `/api/user/${id}`)
    .then(res => res.json());
}

/** Check session and return { user, organization } */
export function checkUserSession() {
  return apiRequest("GET",`${USER}/session`)
    .then(res => 
      {
      // console.log("checkSession", res)
      return res;
    });
}

/** Log out current user */
export function logoutUser() {
  return apiRequest("GET", `${USER}/logout`)
    .then(res => {
      // console.log("logoutUser", res)
      return res;
    });
  }

// ── Donations ────────────────────────────────────────────────────────────────

export function getAllDonations() {
  try{
  const res = apiRequest("GET", `${DONATION}/all`);
  // console.log("getAllDonations", res)
  return res;
}
catch (err) {
  console.log("getAllDonations error", err);
  return err;
}

}

/** @param {number} id */
export function getDonation(id) {
  try{
    const res = apiRequest("GET", `${DONATION}/${id}`);
    // console.log("Edit Donation", res)
    return res;
  }
  catch (err) {
    console.log("Edit Donation error", err);
    return err;
  }
}


/** @param {number} donorId */
export function getDonationsByDonor(donorId) {
  return apiRequest("GET", `/api/donations/donor/${donorId}`)
    .then(res => res.json());
}

/** @param {object} donationData @param {string} donorId */
export async function createDonation(donationData , donorId) {
  try { 
  const res = await apiRequest("POST", `${DONATION}/new`, donationData);
  // console.log("createDonation", donationData)
  // const res = 1;
    return res;
}
  catch (err) {
    console.log("createDonation error", err);
    return err
  }
}

/** @param {number} id @param {object} donationData */
export function updateDonation(id, donationData) {
  try{
    const res = apiRequest("PUT", `${DONATION}/${id}`);

    console.log("Update Donation", res)
    return res;
  }
  catch (err) {
    console.log("Edit Donation error", err);
    return err;
  }
}
/** @param {string} donationId  @param {object} status*/
export function updateDonationStatus(donationId,status){
 try{
   const res =  apiRequest("PUT", `${DONATION}/update/${donationId}/status`,status);
   console.log("updateDonationStatus",status)
  }catch(err){
    console.log("updateDonationStatus error", err);
    return err;
  }
}

// ── Requests ─────────────────────────────────────────────────────────────────

/**   @param {string} donationId*/
export function applyRequest(donationId) {
  try{
    console.log("applyRequest", donationId)
    console.log("applyRequest", `${REQUEST}/apply/${donationId}`)
    const res = apiRequest("POST", `${REQUEST}/apply/${donationId}`,{donationId});
    console.log("applyRequest response", res)
    return res;
  }
  catch(err){
    console.log(err)
  }

    // .then(res => res.json());
}


export function getAppliedRequests() {
  try{
  // console.log("getAppliedRequests", userId);
  // console.log("getAppliedRequests", `${REQUEST}/all`)
  console.log("getAppliedRequests")
  const res = apiRequest("GET", `${REQUEST}/all`)
  console.log("getAppliedRequests response", res)
    return res;
}
  catch(err){
    console.log("getAppliedRequests error", err);
    return err;
  }
}

/** @param {number} requestId @param {object} requestData */
export function updateRequest(requestId, status) {
  try{
    console.log("updateRequest", requestId, status);
    const res = apiRequest("PUT", `${REQUEST}/status/${requestId}/update`, status);
    return res
  }
  catch(err){
    console.log("updateRequest error", err);
    return err;
  }
}

/** @param {string} donationId */
export function getApplicants(donationId) {
  try
  {
    const res = apiRequest("GET", `${REQUEST}/applicants/${donationId}`)
    // console.log("getApplicants", res)
    // console.log('donation', donationId );
    return res;
  }
  catch(err){
    console.log("getApplicants error", err);
    return err;
  }
}

/** @param {number} orgId */
export function getRequestsByOrganization(orgId) {
  return apiRequest("GET", `/api/requests/organization/${orgId}`)
    .then(res => res.json());
}



// Deleviries 

export function getAllDeliveries(){
  try{
    const res = apiRequest("GET", `${DELIVERY}/all`)
    console.log("getAllDeliveries", res)
    return res;
  }
  catch(err){
    console.log("getAllDeliveries error", err);
    return err;
  }
}

/** @param {object} deliveryData */
export function createDelivery(deliveryData){
  try{
    const res = apiRequest("POST", `${DELIVERY}/new`, deliveryData)
    console.log("createDelivery", res)
    return res;
  }
  catch(err){
    console.log("createDelivery error", err);
    return err;
  }
}

/** @param {string} deliveryId  @param {object} status */
export function acceptDelivery(deliveryId,status){
  try{
    const res = apiRequest("PUT", `${DELIVERY}/${deliveryId}/accept`,status)
    console.log("acceptDelivery", res)
    return res;
  }
  catch(err){
    console.log("acceptDelivery error", err);
    return err;
  }

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
