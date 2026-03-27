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
      navigation("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10 group">
        {/* Glassmorphism Card Background */}
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border-2 border-white/60 dark:border-white/10 shadow-2xl z-0 transition-all duration-500 group-hover:shadow-primary/10"></div>
        
        <Card className="relative z-10 bg-transparent border-none shadow-none overflow-hidden rounded-[2.5rem]">
          <CardHeader className="space-y-2 pt-10 pb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
               <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-11.5 -10.23174 23 20.46348"
                className="h-10 w-10 text-primary"
              >
                <circle cx="0" cy="0" r="2.05" fill="currentColor" />
                <g stroke="currentColor" strokeWidth="1" fill="none">
                  <ellipse rx="11" ry="4.2" />
                  <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                  <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                </g>
              </svg>
            </div>
            <CardTitle className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Selamat Datang
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">
              Silakan masuk untuk mengelola reservasi Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Username / Email</Label>
                <Input
                  id="identifier"
                  placeholder="name@example.com"
                  className="h-12 rounded-2xl border-2 border-slate-200/50 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 focus:ring-primary shadow-inner"
                  {...register("identifier")}
                  aria-invalid={errors.identifier ? "true" : "false"}
                />
                {errors.identifier && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" title="Password" className="text-xs font-black uppercase tracking-widest text-slate-400">Password</Label>
                  <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Lupa Password?</Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-2xl border-2 border-slate-200/50 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 focus:ring-primary shadow-inner"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full text-sm font-black uppercase tracking-widest h-14 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95">
                Masuk Sekarang
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-10 border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/5 pt-6">
            <div className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-black uppercase tracking-wider text-xs ml-1"
              >
                Daftar di sini
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
