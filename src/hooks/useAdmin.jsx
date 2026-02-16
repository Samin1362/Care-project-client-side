"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProviders";
import useAxiosPublic from "./useAxiosPublic";

const useAdmin = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.email) {
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }
    axiosPublic
      .get(`/admin/check/${user.email}`)
      .then((res) => {
        setIsAdmin(res.data.isAdmin);
        setAdminLoading(false);
      })
      .catch(() => {
        setIsAdmin(false);
        setAdminLoading(false);
      });
  }, [user, authLoading, axiosPublic]);

  return { isAdmin, adminLoading };
};

export default useAdmin;
