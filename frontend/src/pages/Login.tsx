import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { AuthContext } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/lib/donation-api";
import { Link } from "wouter";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

// Form validation schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, checkSession } = useContext(AuthContext);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      
      // First, verify that we're using the right credentials
      if (process.env.NODE_ENV === 'development') {
        console.log('Login attempt with:', values.username);
      }
      
      // Make API request with credentials included
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        // If login fails, show error message
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      // If login succeeds, read response data
      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};
      
      if (!data.user) {
        throw new Error('No user data returned from server');
      }
      
      // Update local state via the AuthContext
      login(data.user, data.organization);
      
      // Immediately check session to confirm it was saved
      await checkSession();
      
      // Redirect to home page
      setLocation("/");
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name}!`,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-12 h-12 bg-[hsl(var(--primary-light))] rounded-full flex items-center justify-center mb-2">
            <Heart className="h-6 w-6 text-[hsl(var(--primary-dark))]" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to FoodShare</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-[hsl(var(--primary-dark))]"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-neutral-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-dark))] font-medium"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
