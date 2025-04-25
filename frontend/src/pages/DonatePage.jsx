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
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Validation schema including expiryTime
const donationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  foodType: z.enum([
    "FRUIT",
    "VEGETABLE",
    "DAIRY",
    "BAKED_GOODS",
    "MEAT",
    "OTHERS",
  ]),
  quantity: z.object({
    amount: z
      .preprocess((v) => parseFloat(v), z.number().min(0.1, "Min 0.1")),
    unit: z.enum(["kg", "g", "l", "ml", "packets"]),
  }),
  description: z.string().min(1, "Description is required"),
  expiryTime: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)) && new Date(val) > new Date(),
      { message: "Expiry time must be a future date/time" }
    ),
  pickUpAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "ZIP is required"),
    country: z.string().min(1, "Country is required"),
    Geolocation: z.object({
      coordinates: z.object({
        lat: z.preprocess((v) => parseFloat(v), z.number()),
        long: z.preprocess((v) => parseFloat(v), z.number()),
      }),
    }),
  }),
});

const DonatePage = () => {
  const [activeTab, setActiveTab] = useState("donate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast().toast;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const form = useForm({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      name: "",
      foodType: "",
      quantity: { amount: "", unit: "" },
      description: "",
      expiryTime: "",
      pickUpAddress: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        Geolocation: { coordinates: { lat: "", long: "" } },
      },
    },
  });
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = form;

  // Autofill address via Maps.co
  const handleAddressLookup = async (streetValue) => {
    if (!streetValue) return;
    try {
      const res = await fetch(
        `https://geocode.maps.co/search?q=${encodeURIComponent(
          streetValue
        )}`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const { address = {}, lat, lon } = data[0];
        setValue("pickUpAddress.street", address.road || streetValue);
        setValue(
          "pickUpAddress.city",
          address.city || address.town || address.village || ""
        );
        setValue("pickUpAddress.state", address.state || "");
        setValue("pickUpAddress.zip", address.postcode || "");
        setValue("pickUpAddress.country", address.country || "");
        setValue(
          "pickUpAddress.Geolocation.coordinates.lat",
          parseFloat(lat) || 0
        );
        setValue(
          "pickUpAddress.Geolocation.coordinates.long",
          parseFloat(lon) || 0
        );
      }
    } catch (err) {
      console.error("Geocode lookup failed:", err);
    }
  };

  const onSubmit = async (values) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a donation",
        variant: "destructive",
      });
      return navigate("/login");
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/:userId/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, donorId: user.id }),
      });
      if (!response.ok) {
        throw new Error("Failed to save donation");
      }
      await response.json();
      toast({
        title: "Donation created",
        description: "Your donation has been saved.",
      });
      reset();
      setActiveTab("browse");
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Could not save donation. Try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };
  return (
    <>
      <Helmet>
        <title>Donate Food | FoodShare</title>
      </Helmet>

      <div className="container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="donate">Create Donation</TabsTrigger>
            <TabsTrigger value="browse">Browse Donations</TabsTrigger>
          </TabsList>

          <TabsContent value="donate">
            {!user ? (
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Required</CardTitle>
                  <CardDescription>
                    You must be logged in to create a donation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center gap-4">
                  <Button onClick={() => navigate("/login")}>Login</Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </Button>
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
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* Name */}
                      <FormField
                        control={control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Donation Name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Food Type */}
                      <FormField
                        control={control}
                        name="foodType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Food Type</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    "FRUIT",
                                    "VEGETABLE",
                                    "DAIRY",
                                    "BAKED_GOODS",
                                    "MEAT",
                                    "OTHERS",
                                  ].map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Quantity */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={control}
                          name="quantity.amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  {...field}
                                  placeholder="e.g., 2.5"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="quantity.unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select unit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {["kg","g","l","ml","packets"].map(u => (
                                      <SelectItem key={u} value={u}>{u}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Description */}
                      <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Details" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Expiry Time */}
                      <FormField
                        control={control}
                        name="expiryTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Time</FormLabel>
                            <FormControl>
                              <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Street Auto-Lookup */}
                      <FormField
                        control={control}
                        name="pickUpAddress.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Street address"
                                onBlur={(e) =>
                                  handleAddressLookup(e.target.value)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* City, State, ZIP, Country */}
                      {['city','state','zip','country'].map(name => (
                        <FormField
                          key={name}
                          control={control}
                          name={`pickUpAddress.${name}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{name.charAt(0).toUpperCase()+name.slice(1)}</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}

                      {/* Geolocation */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={control}
                          name="pickUpAddress.Geolocation.coordinates.lat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Latitude</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.000001"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="pickUpAddress.Geolocation.coordinates.long"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Longitude</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.000001"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Create Donation"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="browse">
            <DonationsList limit={null} showViewAll filter="all" />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default DonatePage;
