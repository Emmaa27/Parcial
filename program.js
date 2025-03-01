var map = L.map('map').setView([4.7399490860654785, -74.06722405407729], 17);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

async function loadPolygon() {
    let myData = await fetch ('Elplan.geojson');
    let myPolygon = await myData.json();

    L.geoJSON(myPolygon,
        {
            style: {
                color: 'orange'
            }
        }
    ).addTo(map);
    
}
loadPolygon();