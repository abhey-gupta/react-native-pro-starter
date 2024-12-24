import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "../storage";
import { PermissionStatus } from "expo-location";

export interface Geolocation {
  name: string;
  city: string;
  district: string;
  region: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

interface LocationStore {
  locationPermissionStatus: PermissionStatus;
  setLocationPermissionStatus: (value: PermissionStatus) => void;
  geolocation: Geolocation | null;
  setGeolocation: (geolocation: Geolocation) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      locationPermissionStatus: PermissionStatus.GRANTED,

      setLocationPermissionStatus: (status: PermissionStatus) =>
        set({ locationPermissionStatus: status }),

      geolocation: null as null,

      setGeolocation: async (geolocation: any) =>
        set({ geolocation: geolocation }),
    }),
    {
      name: "location-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
