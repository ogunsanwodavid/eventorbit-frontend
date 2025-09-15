"use client";

import { ReactNode, useEffect } from "react";

import { useAppDispatch } from "@/app/hooks/global/redux";

import { resetEvent } from "@/app/redux/slices/create/createEventSlice";

interface CreateEventLayoutProps {
  children: ReactNode;
}

export default function CreateEventLayout({
  children,
}: CreateEventLayoutProps) {
  //Redux dispatch function
  const dispatch = useAppDispatch();

  //Reset create event redux state when leaving create event environs
  useEffect(() => {
    return () => {
      dispatch(resetEvent());
    };
  }, []);

  return <>{children}</>;
}
