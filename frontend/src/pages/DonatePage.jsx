import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useForm, useWatch } from "react-hook-form";
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

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { toast,Toaster } from "sonner";

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
    amount: z.preprocess(
      (val) => parseFloat(val),
      z.number().min(0.1, "Min 0.1")
    ),
    unit: z.enum(["kg", "g", "l", "ml", "packets"]),
  }),
  description: z.string().min(1, "Description is required"),
  expiryTime: z.preprocess(
    (val) => new Date(val).toISOString(),
    z
      .string()
      .refine((val) => !isNaN(Date.parse(val)) && new Date(val) > new Date(), {
        message: "Expiry time must be a future date/time",
      })
  ),
  pickUpAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "ZIP is required"),
    country: z.string().min(1, "Country is required"),
    Geolocation: z.object({
      coordinates: z.object({
        lat: z.preprocess((val) => parseFloat(val), z.number()),
        long: z.preprocess((val) => parseFloat(val), z.number()),
      }),
    }),
  }),
});

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState("donate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch countries for dropdown
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((res) => {
        setCountries(
          res.data.map((c) => c.name.common).sort((a, b) => a.localeCompare(b))
        );
      })
      .catch((err) => console.error("Error fetching countries", err))
      .finally(() => setLoadingCountries(false));
  }, []);

  const form = useForm({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      name: "",
      foodType: "",
      quantity: { amount: "", unit: "" },
      description: "",
      expiryTime: null,
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

  const { control, handleSubmit, setValue, reset } = form;

  // Watch street, city, state
  const address = useWatch({ control, name: "pickUpAddress" });

  // Build URL for geocoding
  const encodeUrl = ({ street, city, state }) => {
    const q = encodeURIComponent(`${street} ${city} ${state}`);
    const apiKey = import.meta.env.VITE_GEOCODE_API_KEY;
    return `https://geocode.maps.co/search?q=${q}&api_key=${apiKey}`;
  };

  // Debounced lookup for address auto-fill (display_name parsing)
  useEffect(() => {
    const { street, city, state } = address;
    if (!street && !city && !state) {
      setNoResults(false);
      return;
    }
    const timer = setTimeout(() => {
      axios
        .get(encodeUrl({ street, city, state }))
        .then((res) => {
          const data = res.data;
          if (Array.isArray(data) && data.length > 0) {
            const first = data[0];
            const parts = first.display_name.split(",").map((p) => p.trim());
            const len = parts.length;
            const cityPart = parts[len - 4] || "";
            const statePart = len >= 3 ? parts[len - 3] : "";
            const zipPart = len >= 2 ? parts[len - 2] : "";
            const countryPart = parts[len - 1] || "";

            setValue("pickUpAddress.city", cityPart);
            setValue("pickUpAddress.state", statePart);
            setValue("pickUpAddress.zip", zipPart);
            setValue("pickUpAddress.country", countryPart);
            setValue(
              "pickUpAddress.Geolocation.coordinates.lat",
              parseFloat(first.lat)
            );
            setValue(
              "pickUpAddress.Geolocation.coordinates.long",
              parseFloat(first.lon)
            );
            setNoResults(false);
          } else {
            setNoResults(true);
          }
        })
        .catch(() => setNoResults(true));
    }, 2000);
    return () => clearTimeout(timer);
  }, [address.street, address.city, address.state]);

  const onSubmit = async (values) => {
    if (!user.user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a donation",
        variant: "destructive",
      });
      return navigate("/login");
    }
    setIsSubmitting(true);
    try {
      console.log("Submitting donation", user);
      values.donorId = user.user._id;
      console.log("values", values);
      const res = await createDonation(values,values.donorId);
      console.log("res", res);
      if (res.success) {
      toast.success(res.message || "Donation created successfully");
      form.reset();
      setActiveTab("browse");
    }
    else{
      toast.error(res.response.data.message  || "Error creating donation");
    }
  } catch (err) {
      console.error(err);
      toast.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Donate Food | FoodShare</title>
      </Helmet>
      <div className="container mx-auto md:w-4xl sm:w-3xl w-full py-8 px-4">
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
                {noResults && (
                  <p className="text-yellow-600">
                    No address suggestions... please refine.
                  </p>
                )}
              </Card>
            ) :user.userType !== "donor" ? (
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
                    Fill out the form below to list your food donation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Donation Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={control}
                          name="quantity.amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  placeholder="e.g. 2.5"
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
                                    {["kg", "g", "l", "ml", "packets"].map(
                                      (u) => (
                                        <SelectItem key={u} value={u}>
                                          {u}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
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
                      <FormField
                        control={control}
                        name="expiryTime"
                        render={({ field: { value, onChange } }) => (
                          <FormItem>
                            <FormLabel>Expiry Time</FormLabel>
                            <FormControl>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                  value={value ? dayjs(value) : null}
                                  onChange={(dt) =>
                                    onChange(dt?.toISOString() || null)
                                  }
                                  renderInput={(params) => (
                                    <Input {...params} />
                                  )}
                                />
                              </LocalizationProvider>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="pickUpAddress.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street</FormLabel>
                            <FormControl>
                              <Input placeholder="Street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="pickUpAddress.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="City" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="pickUpAddress.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="State" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="pickUpAddress.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 overflow-auto">
                                  {loadingCountries ? (
                                    <SelectItem value="loading" disabled>
                                      Loading countries…
                                    </SelectItem>
                                  ) : (
                                    countries.map((c) => (
                                      <SelectItem key={c} value={c}>
                                        {c}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                         <FormField
                        control={control}
                        name="pickUpAddress.zip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="postal code" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Creating..." : "Create Donation"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="browse">
            <DonationsList limit={null} showViewAll filter="AVAILABLE" />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
