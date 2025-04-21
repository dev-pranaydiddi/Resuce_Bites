import { useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AuthContext } from "@/App";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequestsByOrganization, getDonationsByDonor, getRequestsByDonation, updateRequest, updateDonation } from "@/lib/donation-api";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, CheckCircle, XCircle, Clock, Info, AlarmClock, Eye } from "lucide-react";
import { Donation, Request } from "@/types";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const [_, setLocation] = useLocation();
  const { user, organization } = useContext(AuthContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [requestViewOpen, setRequestViewOpen] = useState(false);
  const [donationViewOpen, setDonationViewOpen] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user && !localStorage.getItem('user')) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your dashboard",
        variant: "destructive",
      });
      setLocation("/login");
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [user, setLocation, toast]);

  // Fetch donor's donations
  const { 
    data: donorDonations,
    isLoading: isLoadingDonations 
  } = useQuery({
    queryKey: [user?.id ? `/api/donations/donor/${user.id}` : null],
    queryFn: () => getDonationsByDonor(user!.id),
    enabled: !!user && user.userType === "donor",
  });

  // Fetch organization's requests
  const { 
    data: organizationRequests,
    isLoading: isLoadingRequests 
  } = useQuery({
    queryKey: [organization?.id ? `/api/requests/organization/${organization.id}` : null],
    queryFn: () => getRequestsByOrganization(organization!.id),
    enabled: !!organization,
  });

  // Fetch requests for a specific donation
  const getRequestsForDonation = async (donationId: number) => {
    const requests = await getRequestsByDonation(donationId);
    return requests;
  };

  // Update request status mutation
  const updateRequestMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      updateRequest(id, { status }),
    onSuccess: () => {
      toast({
        title: "Request updated",
        description: "The request status has been updated successfully",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: [user?.id ? `/api/donations/donor/${user.id}` : null] 
      });
      if (selectedDonation) {
        queryClient.invalidateQueries({ 
          queryKey: [`/api/requests/donation/${selectedDonation.id}`] 
        });
      }
      if (organization) {
        queryClient.invalidateQueries({ 
          queryKey: [`/api/requests/organization/${organization.id}`] 
        });
      }
      
      // Close dialog
      setRequestViewOpen(false);
    },
    onError: (error) => {
      console.error("Error updating request:", error);
      toast({
        title: "Update failed",
        description: "Failed to update the request status",
        variant: "destructive",
      });
    },
  });

  // Update donation status mutation
  const updateDonationMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      updateDonation(id, { status }),
    onSuccess: () => {
      toast({
        title: "Donation updated",
        description: "The donation status has been updated successfully",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: [user?.id ? `/api/donations/donor/${user.id}` : null] 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      
      // Close dialog
      setDonationViewOpen(false);
    },
    onError: (error) => {
      console.error("Error updating donation:", error);
      toast({
        title: "Update failed",
        description: "Failed to update the donation status",
        variant: "destructive",
      });
    },
  });

  const handleAcceptRequest = (requestId: number) => {
    updateRequestMutation.mutate({ id: requestId, status: "accepted" });
  };

  const handleRejectRequest = (requestId: number) => {
    updateRequestMutation.mutate({ id: requestId, status: "rejected" });
  };

  const handleCompleteRequest = (requestId: number) => {
    updateRequestMutation.mutate({ id: requestId, status: "completed" });
  };

  const handleCancelDonation = (donationId: number) => {
    updateDonationMutation.mutate({ id: donationId, status: "cancelled" });
  };

  const handleCompleteDonation = (donationId: number) => {
    updateDonationMutation.mutate({ id: donationId, status: "completed" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Available</Badge>;
      case "reserved":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Reserved</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Cancelled</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Accepted</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return "Unknown date";
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | FoodShare</title>
        <meta name="description" content="Manage your food donations and requests on the FoodShare platform." />
      </Helmet>

      <div className="bg-gradient-to-r from-[hsl(var(--primary-light))] to-[hsl(var(--primary))] py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Dashboard
          </h1>
          <p className="text-white text-lg">
            {user.userType === "donor" 
              ? "Manage your food donations and track requests"
              : "Manage your food requests and track donations"}
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-white text-xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-heading font-bold">{user.name}</h2>
              <p className="text-neutral-600">{user.email}</p>
              <div className="mt-2 flex items-center">
                <Badge className="mr-2">
                  {user.userType === "donor" ? "Donor" : "Organization"}
                </Badge>
                {user.isVerified && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button variant="outline" onClick={() => alert("Profile editing will be available soon!")}>
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue={user.userType === "donor" ? "donations" : "requests"}>
          <TabsList className="mb-6">
            {user.userType === "donor" && (
              <TabsTrigger value="donations">My Donations</TabsTrigger>
            )}
            {user.userType === "organization" && (
              <TabsTrigger value="requests">My Requests</TabsTrigger>
            )}
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          {user.userType === "donor" && (
            <TabsContent value="donations" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-heading font-semibold">My Donations</h2>
                <Button onClick={() => setLocation("/donate")}>
                  Create New Donation
                </Button>
              </div>

              {isLoadingDonations ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                  <span>Loading your donations...</span>
                </div>
              ) : donorDonations && donorDonations.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Requests</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donorDonations.map((donation) => (
                        <TableRow key={donation.id}>
                          <TableCell className="font-medium">{donation.title}</TableCell>
                          <TableCell>{getStatusBadge(donation.status)}</TableCell>
                          <TableCell>{formatDate(donation.createdAt)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={async () => {
                                setSelectedDonation(donation);
                                const requests = await getRequestsForDonation(donation.id);
                                setSelectedDonation({
                                  ...donation,
                                  requests: requests,
                                } as any);
                                setDonationViewOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Requests
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            {donation.status === "available" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 text-red-600 hover:text-red-800 hover:bg-red-50">
                                    Cancel
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Donation</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to cancel this donation? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleCancelDonation(donation.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Yes, Cancel Donation
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            {donation.status === "reserved" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 text-green-600 hover:text-green-800 hover:bg-green-50">
                                    Mark Completed
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Complete Donation</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Has this donation been picked up and completed? This will mark the donation as completed.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleCompleteDonation(donation.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Yes, Complete Donation
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-primary/10 p-6 mb-4">
                      <Info className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-2">No Donations Yet</h3>
                    <p className="text-neutral-600 mb-6 text-center max-w-md">
                      You haven't created any food donations yet. Start sharing your surplus food with those who need it.
                    </p>
                    <Button onClick={() => setLocation("/donate")}>
                      Create Your First Donation
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          {user.userType === "organization" && (
            <TabsContent value="requests" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-heading font-semibold">My Requests</h2>
                <Button onClick={() => setLocation("/request")}>
                  Find New Donations
                </Button>
              </div>

              {isLoadingRequests ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                  <span>Loading your requests...</span>
                </div>
              ) : organizationRequests && organizationRequests.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Donation</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Requested</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {organizationRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {request.donation?.title || "Unknown Donation"}
                          </TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>{formatDate(request.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => {
                                setSelectedRequest(request);
                                setRequestViewOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            {request.status === "accepted" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 ml-2 text-green-600 hover:text-green-800 hover:bg-green-50">
                                    Mark Completed
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Complete Request</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Have you received this donation? This will mark the request as completed.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleCompleteRequest(request.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Yes, Complete Request
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-secondary/10 p-6 mb-4">
                      <Info className="h-10 w-10 text-secondary" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-2">No Requests Yet</h3>
                    <p className="text-neutral-600 mb-6 text-center max-w-md">
                      You haven't requested any food donations yet. Browse available donations and make your first request.
                    </p>
                    <Button onClick={() => setLocation("/request")} className="bg-secondary hover:bg-[hsl(var(--secondary-dark))]">
                      Find Available Donations
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent actions and updates on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {user.userType === "donor" ? (
                    donorDonations && donorDonations.length > 0 ? (
                      donorDonations.slice(0, 5).map((donation) => (
                        <div key={donation.id} className="flex">
                          <div className="mr-4 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {donation.status === "available" ? (
                                <Clock className="h-4 w-4 text-primary" />
                              ) : donation.status === "reserved" ? (
                                <AlarmClock className="h-4 w-4 text-yellow-500" />
                              ) : donation.status === "completed" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{donation.title}</p>
                            <p className="text-sm text-neutral-500">
                              Status: {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {formatDate(donation.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-6 text-neutral-500">No recent activity to display</p>
                    )
                  ) : (
                    organizationRequests && organizationRequests.length > 0 ? (
                      organizationRequests.slice(0, 5).map((request) => (
                        <div key={request.id} className="flex">
                          <div className="mr-4 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {request.status === "pending" ? (
                                <Clock className="h-4 w-4 text-purple-500" />
                              ) : request.status === "accepted" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : request.status === "rejected" ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {request.donation?.title || "Unknown Donation"}
                            </p>
                            <p className="text-sm text-neutral-500">
                              Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-6 text-neutral-500">No recent activity to display</p>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-500">
                    {user.userType === "donor" ? "Total Donations" : "Total Requests"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {user.userType === "donor" 
                      ? donorDonations?.length || 0 
                      : organizationRequests?.length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-500">
                    {user.userType === "donor" ? "Completed Donations" : "Approved Requests"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {user.userType === "donor" 
                      ? donorDonations?.filter(d => d.status === "completed").length || 0 
                      : organizationRequests?.filter(r => r.status === "accepted" || r.status === "completed").length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-500">
                    {user.userType === "donor" ? "Active Donations" : "Pending Requests"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {user.userType === "donor" 
                      ? donorDonations?.filter(d => d.status === "available" || d.status === "reserved").length || 0 
                      : organizationRequests?.filter(r => r.status === "pending").length || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Impact Summary</CardTitle>
                <CardDescription>
                  Your contribution to fighting hunger and reducing waste
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-lg text-neutral-600">
                  {user.userType === "donor" 
                    ? `You've helped provide approximately ${(donorDonations?.filter(d => d.status === "completed").length || 0) * 15} meals to those in need!` 
                    : `You've received approximately ${(organizationRequests?.filter(r => r.status === "completed").length || 0) * 15} meals to distribute to those in need!`}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={requestViewOpen} onOpenChange={setRequestViewOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>
                Viewing details for request #{selectedRequest.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-heading font-semibold text-lg mb-4">Request Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-neutral-500">Status</span>
                    <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-neutral-500">Date Requested</span>
                    <p>{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-neutral-500">Pickup Details</span>
                    <p>{selectedRequest.pickupDetails || "No pickup details provided"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-neutral-500">Message</span>
                    <p>{selectedRequest.message || "No message provided"}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold text-lg mb-4">Donation Information</h3>
                {selectedRequest.donation ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-neutral-500">Title</span>
                      <p className="font-medium">{selectedRequest.donation.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-500">Description</span>
                      <p>{selectedRequest.donation.description}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-500">Quantity</span>
                      <p>{selectedRequest.donation.quantity}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-500">Location</span>
                      <p>{selectedRequest.donation.location}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-500">Donor</span>
                      <p>{selectedRequest.donation.donor?.name || "Unknown"}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-500">Donation details not available</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setRequestViewOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* View Donation and Requests Dialog */}
      {selectedDonation && (
        <Dialog open={donationViewOpen} onOpenChange={setDonationViewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Donation Requests</DialogTitle>
              <DialogDescription>
                Viewing requests for "{selectedDonation.title}"
              </DialogDescription>
            </DialogHeader>
            
            <div className="mb-6">
              <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold">{selectedDonation.title}</h3>
                  {getStatusBadge(selectedDonation.status)}
                </div>
                <p className="text-sm text-neutral-600 mt-2">{selectedDonation.description}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-primary mr-1" />
                    <span>{selectedDonation.location}</span>
                  </div>
                  <div>
                    <span className="font-medium">Quantity:</span> {selectedDonation.quantity}
                  </div>
                  {selectedDonation.foodType && (
                    <div>
                      <span className="font-medium">Type:</span> {selectedDonation.foodType}
                    </div>
                  )}
                  {selectedDonation.expiryDate && (
                    <div>
                      <span className="font-medium">Expires:</span> {formatDate(selectedDonation.expiryDate)}
                    </div>
                  )}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="font-heading font-semibold text-lg mb-4">Requests</h3>
              
              {(selectedDonation as any).requests && (selectedDonation as any).requests.length > 0 ? (
                <div className="space-y-4">
                  {(selectedDonation as any).requests.map((request: Request) => (
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-secondary text-white">
                                  {request.organization?.orgName?.charAt(0) || "O"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{request.organization?.orgName || "Unknown Organization"}</h4>
                                <p className="text-xs text-neutral-500">Requested {formatDate(request.createdAt)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(request.status)}
                            </div>
                            {request.message && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Message:</p>
                                <p className="text-sm text-neutral-600">{request.message}</p>
                              </div>
                            )}
                            {request.pickupDetails && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Pickup Details:</p>
                                <p className="text-sm text-neutral-600">{request.pickupDetails}</p>
                              </div>
                            )}
                          </div>
                          
                          {request.status === "pending" && selectedDonation.status === "available" && (
                            <div className="flex flex-col gap-2">
                              <Button 
                                onClick={() => handleAcceptRequest(request.id)}
                                className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept
                              </Button>
                              <Button 
                                onClick={() => handleRejectRequest(request.id)}
                                variant="outline" 
                                className="w-full md:w-auto text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-primary/10 p-6 mb-4">
                      <Info className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-2">No Requests Yet</h3>
                    <p className="text-neutral-600 text-center max-w-md">
                      This donation hasn't received any requests yet. Check back later or adjust your donation details to attract more interest.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDonationViewOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Dashboard;
