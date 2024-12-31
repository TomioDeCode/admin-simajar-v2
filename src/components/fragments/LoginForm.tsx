"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePost } from "@/hooks/useApi";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = usePost<{ token: string }>(
    "/auth/login",
    {
      onSuccess: (data: any) => {
        console.log("Login successful:", data.token);
      },
      onError: (error: any) => {
        console.error("Login failed:", error);
        alert("Login failed. Please check your credentials.");
      },
    },
    false
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-card-foreground">
        <CardHeader>
          <CardTitle className="text-2xl text-card">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-card">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-card">
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="****"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {loginMutation.isIdle ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
