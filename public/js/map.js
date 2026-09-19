maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element to render the map
  style: maptilersdk.MapStyle.BASE,
  center: list.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

const marker = new maptilersdk.Marker({color: "#ff0000"})
  .setLngLat(list.geometry.coordinates)
  .setPopup( new maptilersdk.Popup({ offset: 25 })
  .setHTML(`<h5>${list.title}</h5><p>Exact location provided after booking</p>`)
  .setMaxWidth("300px"))
  .addTo(map);