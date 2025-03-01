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

let btnTrees = document.getElementById('btnTrees');

btnTrees.addEventListener('click',
    async ()=>{
        let response = await fetch("arboles_elplan.geojson");
        let datos = await response.json();
        
        L.geoJSON(
            datos, 
            {
                pointToLayer: (feature, latlong)=>{
                    return L.circleMarker(latlong,{
                        radius:5,
                        fillColor:'green',
                        weight:1,
                        fillOpacity:0.5,
                    })

                }
            }
        ).addTo(map)
    }
    )


let btnDistance = document.getElementById('btnDistance');

btnDistance.addEventListener('click',
    async ()=>{
        let response = await fetch("arboles_elplan.geojson");
        let datos = await response.json();
        let trees = datos.features.map((myElement, index)=>({
            id: index+1,
            coordinates: myElement.geometry.coordinates
        }));
        
        console.log(trees);

        let distances=[];
        trees.forEach((treeA)=>{trees.forEach
            (
                (treeB)=>{
                    if (treeA.id != treeB.id){
                        let distance =turf.distance(
                            turf.point(treeA.coordinates),
                            turf.point(treeB.coordinates),
                        );
                        distances.push(
                            [
                                `Árbol ${treeA.id}`,
                                `Árbol ${treeB.id}`,
                                distance.toFixed(3)
                            ]
                        )   
                    }
                }
            )
        })
        generatePDF(distances,trees.lenght);
    }
)

function generatePDF(distances, totalTrees){
    let { jsPDF } = window.jspdf;
    let documentPDF = new jsPDF();
console.log('pase por aca', distances)
    documentPDF.text("Reporte de árboles El Plan", 10,10)
    
    documentPDF.autoTable(
        {
        head: [['Árbol 1', 'Árbol 2', 'Distance']],
        body: distances
        }
    );
    console.log('pase por aca2', documentPDF)
    documentPDF.save("El_Plan.pdf")
}