"use client";

import axios from "axios";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../providers/AuthProviders";

const axiosSecure = axios.create({
  baseURL: "https://server-side-lemon-five.vercel.app",
});

const useAxiosSecure = () => {
  const { logOut } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Request interceptor — attach auth headers if needed in the future
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor — handle 401/403
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          await logOut();
          router.push("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, router]);

  return axiosSecure;
};

export default useAxiosSecure;
