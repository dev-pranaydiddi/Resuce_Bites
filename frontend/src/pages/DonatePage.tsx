import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDonationSchema } from "@shared/schema";
import { z } from "zod";
import { useLocation } from "wouter";
import { AuthContext } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { createDonation } from "@/lib/donation-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";

import DonationsList from "@/components/DonationsList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Extend the donation schema with frontend validation
const donationFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  quantity: z.string().min(1, "Quantity is required"),
  location: z.string().min(1, "Location is required"),
  imageUrl: z.string().optional(),
  donorId: z.number(),
  pickupInstructions: z.string().optional(),
  expiryDate: z.date().optional(),
  foodType: z.string().optional(),
  isUrgent: z.boolean().default(false),
});

const DonatePage = () => {
  const [activeTab, setActiveTab] = useState("donate");
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<z.infer<typeof donationFormSchema>>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      quantity: "",
      location: "",
      imageUrl: "",
      donorId: user?.id || 0,
      pickupInstructions: "",
      foodType: "",
      isUrgent: false,
    },
  });

  const mutation = useMutation({
    mutationFn: createDonation,
    onSuccess: () => {
      toast({
        title: "Donation created",
        description: "Your donation has been listed successfully",
      });
      
      // Reset form
      form.reset();
      
      // Invalidate donations query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      
      // Switch to browse tab
      setActiveTab("browse");
    },
    onError: (error) => {
      console.error("Error creating donation:", error);
      toast({
        title: "Failed to create donation",
        description: "There was an error creating your donation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof donationFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a donation",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    // Set the donorId to the current user's id
    values.donorId = user.id;

    // Submit the donation
    mutation.mutate(values);
  };

  const foodTypes = [
    { value: "bakery", label: "Bakery Items" },
    { value: "produce", label: "Fresh Produce" },
    { value: "prepared", label: "Prepared Meals" },
    { value: "canned", label: "Canned Goods" },
    { value: "dairy", label: "Dairy Products" },
    { value: "meat", label: "Meat & Proteins" },
    { value: "beverages", label: "Beverages" },
    { value: "other", label: "Other" },
  ];

  return (
    <>
      <Helmet>
        <title>Donate Food | FoodShare</title>
        <meta name="description" content="Donate excess food to organizations in need and help reduce food waste." />
      </Helmet>

      <div className="bg-gradient-to-r from-[hsl(var(--primary-light))] to-[hsl(var(--primary))] py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Donate Food
          </h1>
          <p className="text-white text-lg max-w-2xl">
            Share your excess food with those in need. List your available food items for local organizations to claim.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="donate" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2">
            <TabsTrigger value="donate">Create Donation</TabsTrigger>
            <TabsTrigger value="browse">Browse Donations</TabsTrigger>
          </TabsList>

          <TabsContent value="donate" className="max-w-3xl mx-auto">
            {!user ? (
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Required</CardTitle>
                  <CardDescription>
                    You must be logged in to create a donation
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center gap-4">
                  <Button onClick={() => setLocation("/login")}>Login</Button>
                  <Button variant="outline" onClick={() => setLocation("/register")}>
                    Register
                  </Button>
                </CardContent>
              </Card>
            ) : user.userType !== "donor" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Organization Account</CardTitle>
                  <CardDescription>
                    Your account is registered as an organization. Only donor accounts can create donations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button onClick={() => setActiveTab("browse")}>
                    Browse Available Donations
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Create a Donation</CardTitle>
                  <CardDescription>
                    Fill out the form below to list your food donation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Donation Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g., Fresh Bakery Items, Surplus Produce"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="E.g., 20 loaves, 15 lbs, 10 meals"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Specify amount, weight, or number of servings
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="E.g., Downtown, North Side"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                General area where the food is available
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="foodType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Food Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select food type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {foodTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Expiry Date (optional)</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>
                                When will this food be best consumed by?
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the food items in detail, including any allergens or dietary information"
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
                        name="pickupInstructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pickup Instructions (optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Provide details about pickup times, location, or other requirements"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL (optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter a URL for an image of the food items"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              A photo helps organizations identify your donation
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isUrgent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Mark as Urgent
                              </FormLabel>
                              <FormDescription>
                                Urgent donations are highlighted for immediate pickup
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending ? "Creating Donation..." : "Create Donation"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="browse">
            <div className="container mx-auto mb-8">
              <h2 className="text-2xl font-heading font-bold mb-6">
                Available Donations
              </h2>
              <DonationsList />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default DonatePage;
