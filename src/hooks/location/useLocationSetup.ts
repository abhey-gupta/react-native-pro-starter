import * as ExpoLocation from "expo-location";
import {
  Geolocation,
  useLocationStore,
} from "@/src/storage/location/locationStore";
import { mmkvStorage } from "@/src/storage/storage";
import { useState } from "react";

interface LocationSetupResult {
  handleInitializeLocation: () => Promise<void>;
  isLoading: boolean;
  isError: boolean;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

const buildGeolocationFromResponse = (
  reverseGeocodedLocation: ExpoLocation.LocationGeocodedAddress,
  coordinates: Coordinates
): Geolocation => {
  const { city, country, district, name, postalCode, region } =
    reverseGeocodedLocation;

  return {
    city: city ?? "",
    country: country ?? "",
    district: district ?? "",
    name: name ?? "",
    postalCode: postalCode ?? "",
    region: region ?? "",
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  };
};

const getCacheKey = (coordinates: Coordinates): string =>
  `reverseGeocode_${coordinates.latitude}_${coordinates.longitude}`;

export const useLocationSetup = (): LocationSetupResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { setGeolocation, setLocationPermissionStatus } = useLocationStore();

  const requestLocationPermission =
    async (): Promise<ExpoLocation.PermissionStatus> => {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      setLocationPermissionStatus(status);
      return status;
    };

  const handleReverseGeocode = async (
    coordinates: Coordinates
  ): Promise<Geolocation | null> => {
    const cacheKey = getCacheKey(coordinates);
    const cachedResult = mmkvStorage.getJsonItem(cacheKey);

    if (cachedResult) {
      return cachedResult as Geolocation;
    }

    try {
      const [reverseGeocodedLocation] = await ExpoLocation.reverseGeocodeAsync(
        coordinates
      );
      const geolocation = buildGeolocationFromResponse(
        reverseGeocodedLocation,
        coordinates
      );

      mmkvStorage.setJsonItem(cacheKey, geolocation);
      return geolocation;
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
      return null;
    }
  };

  const getReverseGeolocation = async (): Promise<Geolocation | null> => {
    const currentLocation = await ExpoLocation.getCurrentPositionAsync();
    const coordinates = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };

    return handleReverseGeocode(coordinates);
  };

  const handleInitializeLocation = async (): Promise<void> => {
    try {
      const status = await requestLocationPermission();

      if (status !== ExpoLocation.PermissionStatus.GRANTED) {
        throw new Error("Location permission denied");
      }

      const geolocation = await getReverseGeolocation();
      if (!geolocation) {
        throw new Error("Failed to fetch location");
      }

      setGeolocation(geolocation);
    } catch (error) {
      console.warn("Location error:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleInitializeLocation, isLoading, isError };
};
