import { useState, useEffect } from "react";

type Location = {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
};

export function useGeolocation() {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation((prev) => ({ ...prev, error: "Geolocation not supported" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          error: null,
        });
      },
      (err) => {
        setLocation((prev) => ({ ...prev, error: err.message }));
      }
    );
  }, []);

  return location;
}
