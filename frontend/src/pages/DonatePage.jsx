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

// Backend-aligned validation schema
const donationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  foodType: z.enum(["FRUIT", "VEGETABLE", "DAIRY", "BAKED_GOODS", "MEAT", "OTHERS"]),
  quantity: z.object({
    amount: z.preprocess(val => parseFloat(val), z.number().min(0.1, "Min 0.1")),
    unit: z.enum(["kg", "g", "l", "ml", "packets"]),
  }),
  pickUpAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "ZIP is required"),
    country: z.string().min(1, "Country is required"),
    Geolocation: z.object({
      coordinates: z.object({
        lat: z.preprocess(val => parseFloat(val), z.number()),
        long: z.preprocess(val => parseFloat(val), z.number()),
      }),
    }),
  }),
});

const DonatePage = () => {
  const [activeTab, setActiveTab] = useState("donate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
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
  const { control, handleSubmit, setValue } = form;

  // Lookup address details on street blur
  const handleAddressLookup = async streetValue => {
    if (!streetValue) return;
    try {
      const res = await fetch(
        `https://geocode.maps.co/search?q=${encodeURIComponent(
          streetValue
        )}&api_key=6807d1104d96e778785875xfge6e61b`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        const addr = first.address || {};
        // Autofill each field
        setValue("pickUpAddress.street", addr.road || streetValue);
        setValue(
          "pickUpAddress.city",
          addr.city || addr.town || addr.village || ""
        );
        setValue("pickUpAddress.state", addr.state || "");
        setValue("pickUpAddress.zip", addr.postcode || "");
        setValue("pickUpAddress.country", addr.country || "");
        setValue(
          "pickUpAddress.Geolocation.coordinates.lat",
          parseFloat(first.lat) || 0
        );
        setValue(
          "pickUpAddress.Geolocation.coordinates.long",
          parseFloat(first.lon) || 0
        );
      }
    } catch (err) {
      console.error("Geocode lookup failed:", err);
    }
  };

  const onSubmit = async values => {
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
      values.donorId = user.id;
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
        description:
          "There was an error creating your donation. Please try again.",
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
                                placeholder="Donation Name"
                                {...field}
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
                                  ].map(type => (
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
                                  placeholder="e.g., 2.5"
                                  {...field}
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

                      {/* Street with lookup */}
                      <FormField
                        control={control}
                        name="pickUpAddress.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Street address"
                                {...field}
                                onBlur={e => handleAddressLookup(e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Auto-filled address fields */}
                      {[

                        "city",
                        "state",
                        "zip",
                        "country",
                      ].map(name => (
                        <FormField
                          key={name}
                          control={control}
                          name={`pickUpAddress.${name}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{name.charAt(0).toUpperCase() + name.slice(1)}</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder={name} />
                              </FormControl>
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
                                  placeholder="Lat"
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
                                  placeholder="Long"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Donation"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="browse">
            <DonationsList />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default DonatePage;
