import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Prism from "@/components/Prism";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "@/context/UserContext";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { btnLoading, signUpUser } = useUserData();
  
    const submitHandler = (e: any) => {
      e.preventDefault();
      signUpUser(name, email, password, navigate);
    };
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Prism */}
      <div className="absolute inset-0 -z-10">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0.5}
          glow={1}
        />
      </div>

      {/* Glassmorphism Login Card */}
      <Card className="w-[400px] bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-center font-semibold">
            Create an account
          </CardTitle>
          <CardDescription className="text-gray-200 text-center">
            Enter your email below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label className="text-white" htmlFor="name">
                  Name 
                </Label>
                <Input
                  id="name"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Enter name"
                  className="bg-white/10 text-white placeholder:text-gray-300 border-white/20"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-white" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Enter email"
                  className="bg-white/10 text-white placeholder:text-gray-300 border-white/20"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-white" htmlFor="password">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="bg-white/10 text-white placeholder:text-gray-300 border-white/20"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={btnLoading}
              className="w-full mt-4 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
            >
              {btnLoading ? "Please wait..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <p className="text-white text-center">
            Already have an account?
            <Link
              to="/login"
              className="text-blue-500 underline-offset-4 hover:underline"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
