import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";

// Fix for default marker icons in Leaflet
const fixLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

export default function MapView({ listings, center, zoom = 12 }) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  // Filter out listings without valid coordinates
  const validListings = listings?.filter(
    (listing) =>
      listing.latitude &&
      listing.longitude &&
      !isNaN(listing.latitude) &&
      !isNaN(listing.longitude)
  );

  console.log("MapView received listings:", listings?.length);
  console.log("Valid listings with coordinates:", validListings?.length);

  if (validListings?.length > 0) {
    console.log("First listing coords:", {
      lat: validListings[0].latitude,
      lng: validListings[0].longitude,
    });
  }

  if (!validListings || validListings.length === 0) {
    return (
      <div className="w-full h-96 bg-base-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg opacity-70">No listings to display on map</p>
          <p className="text-sm opacity-50 mt-2">
            {listings?.length > 0
              ? "Listings are missing coordinate data"
              : "No listings available"}
          </p>
        </div>
      </div>
    );
  }

  // Calculate center if not provided
  const mapCenter = center || [
    validListings[0].latitude,
    validListings[0].longitude,
  ];

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg border-2 border-base-300">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validListings.map((listing) => (
          <Marker
            key={listing.listing_id}
            position={[listing.latitude, listing.longitude]}
          >
            <Popup maxWidth={250}>
              <div className="p-2">
                {listing.url && (
                  <img
                    src={listing.url}
                    alt={listing.title}
                    className="w-full h-24 object-cover rounded mb-2"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <h3 className="font-bold text-base mb-1">{listing.title}</h3>
                <p className="text-sm opacity-70 mb-1">
                  {listing.city}, {listing.province}
                </p>
                <p className="text-xs opacity-60 mb-1">📍 {listing.address}</p>
                <p className="text-xs opacity-60 mb-2">
                  👥 Up to {listing.guest_limit} guests
                </p>
                {listing.distance && (
                  <p className="text-xs font-semibold text-blue-600">
                    📏 {listing.distance.toFixed(1)} km away
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
