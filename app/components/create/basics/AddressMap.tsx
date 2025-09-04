import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

interface AddressMapProps {
  latitude: number | undefined;
  longitude: number | undefined;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export default function AddressMap({ latitude, longitude }: AddressMapProps) {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map
        style={{
          width: "100%",
          height: "300px",
          borderRadius: "6px",
          overflow: "hidden",
        }}
        center={{
          lat: latitude ?? 22.54992,
          lng: longitude ?? 0,
        }}
        zoom={latitude && longitude ? 14 : 3} //Zoom in if location is set
        defaultZoom={12}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {/** Render marker if latitude and longitude exist */}
        {latitude && longitude && (
          <Marker position={{ lat: latitude, lng: longitude }} />
        )}
      </Map>
    </APIProvider>
  );
}
