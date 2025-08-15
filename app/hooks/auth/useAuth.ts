"use client";

import { useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useAppDispatch } from "../global/redux";

import { setAuth } from "@/app/redux/slices/auth";

import { AuthState } from "@/app/models/auth";

import { getAuthStatus } from "@/app/actions/auth/get-status";

import { getProfile } from "@/app/actions/auth/get-profile";

export default function useAuth() {
  //React Query Client
  const queryClient = useQueryClient();

  //Redux app dispatch function
  const dispatch = useAppDispatch();

  const query = useQuery<AuthState>({
    queryKey: ["auth"],
    queryFn: async (): Promise<AuthState> => {
      //Check authentication status
      const authStatus = await getAuthStatus();

      if (!authStatus) {
        return { isAuthenticated: false, profile: null };
      }

      //Fetch profile if authenticated
      const profile = (await getProfile()) ?? null;

      return {
        isAuthenticated: true,
        profile,
      };
    },
    retry: (failureCount) => failureCount <= 2, //RETRY TWO TIMES
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000), //EXPONENTIAL BACK-OFF
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      dispatch(setAuth(query.data));
    }
  }, [query.isSuccess, query.data, dispatch]);

  useEffect(() => {
    if (query.isError) {
      dispatch(setAuth({ isAuthenticated: false, profile: null }));
    }
  }, [query.isError, dispatch]);

  //Function to invalidate auth state and refetch only when idle
  const refreshAuth = () => {
    if (!query.isFetching) {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    }
  };

  return { ...query, refreshAuth };
}
