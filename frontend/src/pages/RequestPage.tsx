import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useRoute, Link } from "wouter";
import { AuthContext } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { getDonation, createRequest } from "@/lib/donation-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Helmet } from "react-helmet";

import DonationsList from "@/components/DonationsList";
import DonationCard from "@/components/DonationCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import { Donation } from "@/types";
import { Loader2 } from "lucide-react";

// Form validation schema
const requestFormSchema = z.object({
  donationId: z.number(),
  organizationId: z.number(),
  pickupDetails: z.string().min(10, "Please provide pickup details"),
  message: z.string().min(5, "Please include a message"),
});

const RequestPage = () => {
  const [_, setLocation] = useLocation();
  const [match, params] = useRoute("/request?:id");
  const donationId = match ? parseInt(params?.id as string) : null;
  const { user, organization } = useContext(AuthContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Fetch donation details if ID is provided
  const { data: donationData, isLoading: isLoadingDonation } = useQuery({
    queryKey: [donationId ? `/api/donations/${donationId}` : null],
    enabled: !!donationId,
    onSuccess: (data) => {
      if (data) {
        setSelectedDonation(data);
      }
    },
  });

  const form = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      donationId: donationId || 0,
      organizationId: organization?.id || 0,
      pickupDetails: "",
      message: "",
    },
  });

  // Update form values when donation ID or organization changes
  useEffect(() => {
    if (donationId) {
      form.setValue("donationId", donationId);
    }
    if (organization) {
      form.setValue("organizationId", organization.id);
    }
  }, [donationId, organization, form]);

  const mutation = useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      toast({
        title: "Request submitted",
        description: "Your request has been sent to the donor",
      });
      
      // Reset form
      form.reset();
      
      // Close dialog if open
      setIsDialogOpen(false);
      
      // Clear selected donation
      setSelectedDonation(null);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      if (organization) {
        queryClient.invalidateQueries({ 
          queryKey: [`/api/requests/organization/${organization.id}`] 
        });
      }
      
      // Redirect to dashboard
      setLocation("/dashboard");
    },
    onError: (error) => {
      console.error("Error creating request:", error);
      toast({
        title: "Failed to submit request",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof requestFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to request a donation",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    if (!organization) {
      toast({
        title: "Organization profile required",
        description: "You need an organization profile to request donations",
        variant: "destructive",
      });
      return;
    }

    // Ensure the organizationId is set
    values.organizationId = organization.id;

    // Submit the request
    mutation.mutate(values);
  };

  const handleRequestClick = (donation: Donation) => {
    setSelectedDonation(donation);
    form.setValue("donationId", donation.id);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Request Food | FoodShare</title>
        <meta name="description" content="Request food donations for your organization and help reduce food waste." />
      </Helmet>

      <div className="bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--secondary-dark))] py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Request Food
          </h1>
          <p className="text-white text-lg max-w-2xl">
            Organizations can browse and request food donations from local businesses and individuals.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {user && user.userType !== "organization" ? (
          <Card className="max-w-3xl mx-auto mb-8">
            <CardHeader>
              <CardTitle>Organization Account Required</CardTitle>
              <CardDescription>
                You need to be registered as an organization to request food donations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Your account is currently registered as a donor. To request food donations, 
                you need to register as an organization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/donate">
                  <Button variant="default">Donate Food Instead</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline">Register as Organization</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : donationId && isLoadingDonation ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            <span>Loading donation details...</span>
          </div>
        ) : donationId && selectedDonation ? (
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Request This Donation</CardTitle>
                <CardDescription>
                  You're requesting the following donation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <DonationCard donation={selectedDonation} />
                </div>

                {!user ? (
                  <div className="text-center py-6">
                    <p className="mb-4">Please log in to request this donation</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Link href={`/login?redirect=/request?id=${donationId}`}>
                        <Button>Log In</Button>
                      </Link>
                      <Link href="/register">
                        <Button variant="outline">Register</Button>
                      </Link>
                    </div>
                  </div>
                ) : !organization ? (
                  <div className="text-center py-6">
                    <p className="mb-4">
                      You need to be registered as an organization to request donations
                    </p>
                    <Link href="/register">
                      <Button>Register as Organization</Button>
                    </Link>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="pickupDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pickup Details</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Provide details about when you can pick up, transportation, etc."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message to Donor</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Introduce your organization and explain how this donation will be used"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending ? "Submitting Request..." : "Submit Request"}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setLocation("/request")}>
                  Back to Donations
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-heading font-bold mb-6">
              Available Donations
            </h2>
            <DonationsList filter="available" />
          </div>
        )}
      </div>

      {/* Request Dialog */}
      {selectedDonation && (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Request Donation</AlertDialogTitle>
              <AlertDialogDescription>
                You're requesting <strong>{selectedDonation.title}</strong>. Please provide some information about your request.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="pickupDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide details about when you can pick up, transportation, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message to Donor</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Introduce your organization and explain how this donation will be used"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={form.handleSubmit(onSubmit)}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Submitting..." : "Submit Request"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default RequestPage;
