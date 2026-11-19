import { useEffect, useRef } from "react";
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";

maptilersdk.config.apiKey = import.meta.env.VITE_MAP_TOKEN;

const Map = ({ coordinates, title }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        if (map.current) return;

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: "streets-v4",
            center: [coordinates[0], coordinates[1]],
            zoom: 12
        })

        new maptilersdk.Marker({ color: "#ff0000" })
            .setLngLat(coordinates)
            .setPopup(new maptilersdk.Popup({ offset: 25 })
                .setHTML(`<h5 class="text-base font-semibold">${title}</h5>
                    <p>Exact location will be provided after booking</p>`)
                .setMaxWidth("300px"))
            .addTo(map.current);
    }, [])


    return (
        <div className="map-wrap relative w-full h-full">
            <div ref={mapContainer} className="map absolute w-full h-full" />
        </div>
    )
}

export default Map;