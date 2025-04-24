// src/pages/Login.jsx
import React, { useContext, useEffect, useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { RadioGroup } from "../components/ui/radio-group";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER } from "@/Endpoints";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/store/authSlice";
import { Heart, Loader2 } from "lucide-react";
import { loginUser } from "@/lib/donation-api";
import { AuthContext } from "@/App";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {login} = useContext(AuthContext);

  const changeEventHandler = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const res = await loginUser(input);
      console.log("loginUser in login.jsx", res);
      if (res.success) {
        login(res.user);
        navigate("/");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  // redirect if already logged in
  useEffect(() => {
    // if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-2">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
            <Heart className="h-7 w-7 text-red-600" />
          </div>
          <h2 className="text-3xl font-extrabold">Already have an Account ?</h2>
          <p className="text-gray-600">Course with the community.</p>
        </div>
      <div className=" flex w-full justify-center items-center"> 
        <form
          onSubmit={submitHandler}
          className="w-2/3 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Login</h1>

          <div className="my-2 space-y-4">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="you@example.com"
            />
          </div>

          <div className="my-2 space-y-4">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="*************"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center">
              <Button className="w-md my-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Button type="submit" className="md:w-2xs w-16 cursor-pointer my-4">
                Login
              </Button>
            </div>
          )}

          <span className="text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
