import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/axios";

const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: "Username atau Email minimal 3 karakter" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export default function LoginPage() {
  const navigation = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await api.post("/user/login", values);

      const token = response.data.data;
      localStorage.setItem("accessToken", token);

      reset();
      navigation("/reservation");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 p-4 dark:from-slate-950 dark:to-slate-900">
      <Card className="w-full max-w-md shadow-2xl transition-all hover:shadow-slate-300/50 dark:hover:shadow-slate-800/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Login
          </CardTitle>
          <CardDescription>
            Masukkan username atau email Anda untuk masuk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Username / Email</Label>
              <Input
                id="identifier"
                placeholder="username or email"
                {...register("identifier")}
                aria-invalid={errors.identifier ? "true" : "false"}
              />
              {errors.identifier && (
                <p className="text-sm font-medium text-destructive">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="text-sm font-medium text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full text-lg font-semibold h-11">
              Masuk
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-semibold"
            >
              Daftar di sini
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
