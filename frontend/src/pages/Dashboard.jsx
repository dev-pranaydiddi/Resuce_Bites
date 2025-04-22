// Dashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "@/App";                      // adjust path
import {
  getDonationsByDonor,
  getRequestsByOrganization,
  getRequestsByDonation,
  updateRequest,
  updateDonation,
} from "../lib/donation-api";                              // adjust path
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";                            // adjust paths
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Info,
  AlarmClock,
  Eye,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, organization } = useContext(AuthContext);

  // Local state for data & loading
  const [donorDonations, setDonorDonations] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(false);

  const [organizationRequests, setOrganizationRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Selected items for viewing/modals
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [donationViewOpen, setDonationViewOpen] = useState(false);
  const [requestViewOpen, setRequestViewOpen] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user && !localStorage.getItem("user")) {
      toast.error("Please log in to view your dashboard");
      navigate("/login");
      return;
    }
    window.scrollTo(0, 0);

    // Fetch data based on user type
    if (user?.userType === "donor") {
      fetchDonations();
    }
    if (organization) {
      fetchOrgRequests();
    }
  }, [user, organization, navigate]);

  // Fetch donor's donations
  async function fetchDonations() {
    setLoadingDonations(true);
    try {
      const data = await getDonationsByDonor(user.id);
      setDonorDonations(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load donations");
    } finally {
      setLoadingDonations(false);
    }
  }

  // Fetch organization's requests
  async function fetchOrgRequests() {
    setLoadingRequests(true);
    try {
      const data = await getRequestsByOrganization(organization.id);
      setOrganizationRequests(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests");
    } finally {
      setLoadingRequests(false);
    }
  }

  // Handlers for status updates
  async function handleUpdateRequest(id, status) {
    try {
      await updateRequest(id, { status });
      toast.success("Request status updated");
      // refresh both lists
      fetchDonations();
      fetchOrgRequests();
      setRequestViewOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update request");
    }
  }

  async function handleUpdateDonation(id, status) {
    try {
      await updateDonation(id, { status });
      toast.success("Donation status updated");
      // refresh both lists
      fetchDonations();
      fetchOrgRequests();
      setDonationViewOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update donation");
    }
  }

  const formatDate = (dateStr) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return "Unknown date";
    }
  };

  const getStatusBadge = (status) => {
    const mapping = {
      available: ["Available", "blue-700", "blue-50"],
      reserved: ["Reserved", "yellow-700", "yellow-50"],
      completed: ["Completed", "green-700", "green-50"],
      cancelled: ["Cancelled", "red-700", "red-50"],
      pending: ["Pending", "purple-700", "purple-50"],
      accepted: ["Accepted", "green-700", "green-50"],
      rejected: ["Rejected", "red-700", "red-50"],
    };
    const [label, color, bg] = mapping[status] || [status, "gray-700", "gray-50"];
    return (
      <Badge variant="outline" className={`bg-${bg} text-${color}`}>
        {label}
      </Badge>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | FoodShare</title>
        <meta name="description" content="Manage your food donations and requests." />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-300 to-blue-500 py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-white text-lg">
            {user.userType === "donor"
              ? "Manage your donations"
              : "Manage your requests"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue={user.userType}>
          <TabsList>
            {user.userType === "donor" ? (
              <TabsTrigger value="donor">My Donations</TabsTrigger>
            ) : (
              <TabsTrigger value="organization">My Requests</TabsTrigger>
            )}
          </TabsList>

          {/* Donor View */}
          {user.userType === "donor" && (
            <TabsContent value="donor">
              {loadingDonations ? (
                <Loader2 className="animate-spin h-8 w-8 mx-auto" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donorDonations.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar>
                              <AvatarFallback>{d.title[0]}</AvatarFallback>
                            </Avatar>
                            <span className="ml-2">{d.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(d.status)}</TableCell>
                        <TableCell>{formatDate(d.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDonation(d);
                              setDonationViewOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          )}

          {/* Organization View */}
          {organization && (
            <TabsContent value="organization">
              {loadingRequests ? (
                <Loader2 className="animate-spin h-8 w-8 mx-auto" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizationRequests.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.donation?.title || "—"}</TableCell>
                        <TableCell>{getStatusBadge(r.status)}</TableCell>
                        <TableCell>{formatDate(r.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(r);
                              setRequestViewOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Donation Detail Dialog */}
      <Dialog open={donationViewOpen} onOpenChange={setDonationViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>
              <strong>{selectedDonation?.title}</strong>
              <p className="mt-2">{selectedDonation?.description}</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Mark Completed
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Completion</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to mark this donation as completed?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      handleUpdateDonation(selectedDonation.id, "completed")
                    }
                  >
                    Yes, Complete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="outline" onClick={() => setDonationViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Detail Dialog */}
      <Dialog open={requestViewOpen} onOpenChange={setRequestViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              <strong>{selectedRequest?.donation?.title}</strong>
              <p className="mt-2">{selectedRequest?.message}</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reject this request?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      handleUpdateRequest(selectedRequest.id, "rejected")
                    }
                  >
                    Yes, Reject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              variant="primary"
              onClick={() =>
                handleUpdateRequest(selectedRequest.id, "accepted")
              }
            >
              Accept
            </Button>
            <Button variant="outline" onClick={() => setRequestViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
