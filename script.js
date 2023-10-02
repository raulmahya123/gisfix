const map = new ol.Map({
    target: 'map',
    view: new ol.View({
        center: ol.proj.fromLonLat([107.66378289976814, -6.906227014340985]),
        zoom: 8
    })
});

const tileLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});
map.addLayer(tileLayer);

function addGeoJSONToMapAndTable(geoJSONUrl, map, table) {
    fetch(geoJSONUrl)
        .then(response => response.json())
        .then(data => {
            const vectorSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(data)
            });
            const vectorLayer = new ol.layer.Vector({
                source: vectorSource
            });
            map.addLayer(vectorLayer);

            let rowNum = 1;

            const tableBody = document.getElementById('geojson-table');

            data.features.forEach(feature => {
                const row = tableBody.insertRow();
                const numCell = row.insertCell(0);
                const nameCell = row.insertCell(1);
                const desaCell = row.insertCell(2);
                const coordCell = row.insertCell(3);
                const typeCell = row.insertCell(4);
                numCell.innerHTML = rowNum;
                nameCell.innerHTML = feature.properties.name;
                desaCell.innerHTML = feature.properties.desa;

                const coordinates = feature.geometry.coordinates;
                let coordinateString = "";

                if (feature.geometry.type === "Point") {
                    const lat = coordinates[1];
                    const long = coordinates[0];
                    coordinateString = `${lat}, ${long}`;

                    // Extract the icon URL from GeoJSON properties
                    const iconUrl = feature.properties.icon; // Replace 'icon' with the actual property name
                    const iconUrl2 = feature.properties.icon; 
                    const iconUrl3 = feature.properties.icon;
                    // Replace 'icon' with the actual property name
                    // Add a marker to the map for Point features
                    const marker = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([long, lat]))
                    });

                    if (iconUrl) {
                        const markerStyle = new ol.style.Style({
                            image: new ol.style.Icon({
                                src: iconUrl,
                                scale: 0.1 // Adjust the scale as needed
                            }),
                            imagee: new ol.style.Icon({
                                src: iconUrl2,
                                scale: 0.1 // Adjust the scale as needed
                            }),
                            imageee: new ol.style.Icon({
                                src: iconUrl3,
                                scale: 0.1 // Adjust the scale as needed
                            })
                        });
                        marker.setStyle(markerStyle);
                    }

                    vectorSource.addFeature(marker);
                } else if (feature.geometry.type === "LineString" || feature.geometry.type === "Polygon") {
                    // Create a feature for LineString and Polygon
                    const geometry = new ol.geom[feature.geometry.type](coordinates);
                    const featureGeom = new ol.Feature({
                        geometry: geometry
                    });
                    vectorSource.addFeature(featureGeom);
                }

                coordinates.forEach(coordinate => {
                    const lat = coordinate[1];
                    const long = coordinate[0];
                    coordinateString += `${lat}, ${long}<br>`;
                });

                coordCell.innerHTML = coordinateString;
                typeCell.innerHTML = feature.geometry.type;
                rowNum++;
            });
        })
        .catch(error => {
            console.error('Error fetching GeoJSON:', error);
        });
}

// Call the function for each GeoJSON URL
addGeoJSONToMapAndTable('https://raw.githubusercontent.com/raulmahya123/gisfix/master/TUGAS1/1214053-RAULMAHYA/geojsonLinestring.json', map, document.querySelector('table'));
addGeoJSONToMapAndTable('https://raw.githubusercontent.com/raulmahya123/gisfix/master/TUGAS1/1214053-RAULMAHYA/geojsonPloygon.json', map, document.querySelector('table'));
addGeoJSONToMapAndTable('https://raw.githubusercontent.com/raulmahya123/gisfix/master/TUGAS1/1214053-RAULMAHYA/goejsondrawPoint.json', map, document.querySelector('table'));