// types.js
/**
  @typedef {import("@shared/schema").Donation & {
  donor?: import("@shared/schema").User;
 }} DonationWithDonor
*/

/**
  @typedef {import("@shared/schema").Request & {
   donation?: import("@shared/schema").Donation;
 Optional organization user info
    organization?: import("@shared/schema").User
}} RequestWithDetails
*/

/**
@typedef {import("@shared/schema").Testimonial & {
 Optional user who gave the testimonial
user?: import("@shared/schema").User
 }} TestimonialWithUser
 */

/**
  @typedef {{
   id: number;
   username: string;
   name: string;
   userType: string;
 } | null} AuthUser
 */

// This file only provides types for JSDoc—no runtime exports needed.
