import { Donation, Request, Testimonial, User } from "@shared/schema";

// Client-side only types

export interface DonationWithDonor extends Donation {
  donor?: User;
}

export interface RequestWithDetails extends Request {
  donation?: Donation;
  organization?: User;
}

export interface TestimonialWithUser extends Testimonial {
  user?: User;
}

export type AuthUser = {
  id: number;
  username: string;
  name: string;
  userType: string;
} | null;
