import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { createDonation } from "@/lib/donation-api";
import { Helmet } from "react-helmet";

import DonationsList from "@/components/PageComponents/DonationsList";
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
import { useSelector } from "react-redux";

// Frontend validation schema
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

const DonatePage = () => {
  const [activeTab, setActiveTab] = useState("donate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const user = useSelector((state) => state.auth.user);
  const { toast } = useToast();
  const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const isAuthenticated = Boolean(user);
    console.log("user", user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const form = useForm({
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

  const onSubmit = async (values) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a donation",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    setIsSubmitting(true);
    try {
      // ensure donorId correctness
      values.donorId = user.id;
      // call API
      await createDonation(values);
      toast({
        title: "Donation created",
        description: "Your donation has been listed successfully",
      });
      form.reset();
      setActiveTab("browse");
    } catch (err) {
      console.error("Failed to create donation:", err);
      toast({
        title: "Failed to create donation",
        description: "There was an error creating your donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Donate Food | FoodShare</title>
        <meta
          name="description"
          content="Donate excess food to organizations in need and help reduce food waste."
        />
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
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="donate">
          <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2">
            <TabsTrigger value="donate">Create Donation</TabsTrigger>
            <TabsTrigger value="browse">Browse Donations</TabsTrigger>
          </TabsList>

          <TabsContent value="donate">
            {!user.user ? (
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Required</CardTitle>
                  <CardDescription>
                    You must be logged in to create a donation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center gap-4">
                  <Button onClick={() => navigate("/login")}>Login</Button>
                  <Button variant="outline" onClick={() => navigate("/register")}>Register</Button>
                </CardContent>
              </Card>
            ) : user.user.role !== "DONOR" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Organization Account</CardTitle>
                  <CardDescription>
                    Only donor accounts can create donations. Browse donations instead.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button onClick={() => setActiveTab("browse")}>Browse Available Donations</Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Create a Donation</CardTitle>
                  <CardDescription>
                    Fill out the form below to list your food donation.
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
                              <Input placeholder="E.g., Fresh Bakery Items" {...field} />
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
                                <Input placeholder="E.g., 20 loaves" {...field} />
                              </FormControl>
                              <FormDescription>Specify amount, weight, or servings</FormDescription>
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
                                <Input placeholder="E.g., Downtown" {...field} />
                              </FormControl>
                              <FormDescription>Where pickup will occur</FormDescription>
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
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger><SelectValue placeholder="Select food type" /></SelectTrigger>
                                  <SelectContent>
                                    {foodTypes.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
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
                                <PopoverTrigger asChild><FormControl>
                                  <Button variant="outline" className={cn("w-full text-left", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl></PopoverTrigger>
                                <PopoverContent className="p-0" align="start">
                                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))} />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>Best before date</FormDescription>
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
                              <Textarea placeholder="Describe the food items" className="min-h-[120px]" {...field} />
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
                            <FormControl><Textarea placeholder="Pickup details" {...field} /></FormControl>
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
                            <FormControl><Input placeholder="Image link" {...field} /></FormControl>
                            <FormDescription>Helps organizations identify your donation</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isUrgent"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between border p-4">
                            <div>
                              <FormLabel className="mb-0">Mark as Urgent</FormLabel>
                              <FormDescription>Highlights for immediate pickup</FormDescription>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Creating Donation..." : "Create Donation"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="browse">
            <div className="container mx-auto mb-8">
              <h2 className="text-2xl font-heading font-bold mb-6">Available Donations</h2>
              <DonationsList />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default DonatePage;
