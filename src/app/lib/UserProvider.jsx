// app/components/UserProvider.jsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./redux/slices/profileSlice";

export default function UserProvider({ children }) {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state) => state.profile);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !userData && !loading) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, userData, loading]);

  return children;
}
