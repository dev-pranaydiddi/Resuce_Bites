export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  userType: "donor" | "organization";
  bio?: string;
  isVerified: boolean;
}

export interface Organization {
  id: number;
  userId: number;
  orgName: string;
  orgType: string;
  orgDescription?: string;
  orgWebsite?: string;
  orgLogo?: string;
  isVerified: boolean;
}

export interface Donation {
  id: number;
  title: string;
  description: string;
  quantity: string;
  location: string;
  imageUrl?: string;
  status: "available" | "reserved" | "completed";
  donorId: number;
  organizationId?: number | null;
  createdAt: Date | string;
  pickupInstructions?: string;
  expiryDate?: Date | string;
  foodType?: string;
  isUrgent: boolean;
  donor?: User;
}

export interface Request {
  id: number;
  donationId: number;
  organizationId: number;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: Date | string;
  pickupDetails?: string;
  message?: string;
  donation?: Donation;
  organization?: Organization;
}

export interface Testimonial {
  id: number;
  userId: number;
  quote: string;
  userRole?: string;
  isApproved: boolean;
  createdAt: Date | string;
  user?: User;
}

export interface Stats {
  id: number;
  mealsShared: number;
  activeDonors: number;
  partnerOrganizations: number;
  lastUpdated: Date | string;
}
