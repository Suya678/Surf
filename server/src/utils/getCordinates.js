const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export default async function getCoordinates(
  address,
  city,
  province,
  postal_code
) {
  const fullAddress = `${address}, ${city}, ${province}, ${postal_code}, Canada`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    fullAddress
  )}&key=${GOOGLE_API_KEY}&region=ca&components=country:CA`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;
      const addressComponents = result.address_components;

      // --- VALIDATION: Check location type ---
      const locationType = result.geometry.location_type;

      if (locationType === "APPROXIMATE") {
        console.error("Address too vague - only city/region level match");
        return null;
      }

      // --- VALIDATION: Verify it's in Canada ---
      const country = addressComponents.find((c) =>
        c.types.includes("country")
      );
      if (!country || country.short_name !== "CA") {
        console.error("Address is not in Canada");
        return null;
      }

      // --- VALIDATION: Verify province matches ---
      const returnedProvince = addressComponents.find((c) =>
        c.types.includes("administrative_area_level_1")
      );

      const provinceMap = {
        Alberta: "AB",
        "British Columbia": "BC",
        Manitoba: "MB",
        "New Brunswick": "NB",
        "Newfoundland and Labrador": "NL",
        "Northwest Territories": "NT",
        "Nova Scotia": "NS",
        Nunavut: "NU",
        Ontario: "ON",
        "Prince Edward Island": "PE",
        Quebec: "QC",
        Saskatchewan: "SK",
        Yukon: "YT",
      };

      const inputProvinceNormalized =
        provinceMap[province] || province.toUpperCase();

      if (
        returnedProvince &&
        returnedProvince.short_name !== inputProvinceNormalized &&
        returnedProvince.long_name.toLowerCase() !== province.toLowerCase()
      ) {
        console.error(
          `Province mismatch: expected ${province}, got ${returnedProvince.long_name}`
        );
        return null;
      }

      // --- VALIDATION: Verify postal code matches (first 3 chars) ---
      const returnedPostalCode = addressComponents.find((c) =>
        c.types.includes("postal_code")
      );

      if (returnedPostalCode) {
        const inputFSA = postal_code
          .replace(/\s/g, "")
          .substring(0, 3)
          .toUpperCase();
        const returnedFSA = returnedPostalCode.short_name
          .replace(/\s/g, "")
          .substring(0, 3)
          .toUpperCase();

        if (inputFSA !== returnedFSA) {
          console.error(
            `Postal code mismatch: expected ${inputFSA}, got ${returnedFSA}`
          );
          return null;
        }
      }

      // --- VALIDATION: Verify city matches ---
      const returnedCity = addressComponents.find(
        (c) =>
          c.types.includes("locality") ||
          c.types.includes("sublocality") ||
          c.types.includes("administrative_area_level_3")
      );

      if (
        returnedCity &&
        returnedCity.long_name.toLowerCase() !== city.toLowerCase()
      ) {
        const similarCity =
          returnedCity.long_name.toLowerCase().includes(city.toLowerCase()) ||
          city.toLowerCase().includes(returnedCity.long_name.toLowerCase());

        if (!similarCity) {
          console.error(
            `City mismatch: expected ${city}, got ${returnedCity.long_name}`
          );
          return null;
        }
      }

      // --- VALIDATION: Check for street number ---
      const hasStreetNumber = addressComponents.some((c) =>
        c.types.includes("street_number")
      );

      if (!hasStreetNumber) {
        console.error("Address missing street number");
        return null;
      }

      return {
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: result.formatted_address,
        locationType: locationType,
      };
    } else {
      console.error("Geocoding failed:", data.status, data.error_message);
      return null;
    }
  } catch (err) {
    console.error("Error calling Geocoding API:", err);
    return null;
  }
}