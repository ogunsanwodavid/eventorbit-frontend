import { APIProvider, Map } from "@vis.gl/react-google-maps";

interface AddressMapProps {
  latitude: number | void;
  longitude: number | void;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export default function AddressMap({ latitude, longitude }: AddressMapProps) {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map
        style={{ width: "100%", height: "300px" }}
        center={{
          lat: latitude ?? 22.54992,
          lng: longitude ?? 0,
        }}
        zoom={latitude && longitude ? 14 : 3} //Zoom in if location is set
        defaultZoom={12}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      />
    </APIProvider>
  );
}
