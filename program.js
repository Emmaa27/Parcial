var map = L.map('map').setView([4.7399490860654785, -74.06722405407729], 17);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

async function loadPolygon() {
    let myData = await fetch ('Elplan.geojson');
    let myPolygon = await myData.json();

    L.geoJSON(myPolygon, {
        style: { color: 'orange' }
    }).addTo(map);
}
loadPolygon();

let btnTrees = document.getElementById('btnTrees');

btnTrees.addEventListener('click', async () => {
    let response = await fetch("arboles_elplan.geojson");
    let datos = await response.json();
    
    L.geoJSON(datos, {
        pointToLayer: (feature, latlong) => {
            return L.circleMarker(latlong, {
                radius: 5,
                fillColor: 'green',
                weight: 1,
                fillOpacity: 0.5,
            });
        }
    }).addTo(map);
});

let btnDistance = document.getElementById('btnDistance');

btnDistance.addEventListener('click', async () => {
    let response = await fetch("arboles_elplan.geojson");
    let datos = await response.json();

    let trees = datos.features.map((myElement, index) => ({
        id: index + 1,
        coordinates: myElement.geometry.coordinates
    }));

    let treePoints = trees.map(tree => turf.point(tree.coordinates));
    let featureCollection = turf.featureCollection(treePoints);
    let centroide = turf.centroid(featureCollection);

    console.log("Centroide:", centroide.geometry.coordinates);

    let distances = trees.map(tree => {
        let distance = turf.distance(
            turf.point(tree.coordinates),
            centroide,
            { units: 'meters' } 
        );
        return distance.toFixed(2); 
    });

    generatePDF(trees, distances);
});

function generatePDF(trees, distances) {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Distancias de Árboles barrio El Plan", 14, 10);

    let tableData = trees.map((tree, index) => [
        `Árbol ${tree.id}`, 
        distances[index] 
    ]);

    doc.autoTable({
        head: [["Árbol", "Distancia (m)"]],
        body: tableData,
        startY: 20
    });

    doc.save("El_Plan.pdf");
}

let btnIncidentes = document.getElementById('btnIncidentes');

    btnIncidentes.addEventListener('click', async () => {
        let response = await fetch("incidentes_El_Plan.geojson");
        let datos = await response.json();
        
        L.geoJSON(datos, {
            pointToLayer: (feature, latlong) => {
                return L.circleMarker(latlong, {
                    radius: 5.5,
                    fillColor: 'purple',
                    color: "black",
                    weight: 1,
                    opacity: 0.5,
                    fillOpacity: 1,
                });
            }
        }).addTo(map);
    });
