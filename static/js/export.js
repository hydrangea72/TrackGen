// This script is used to export and import the data from the tracker -- WIP
function exportData() {
    const exportPoints = [];

    document.querySelectorAll("#inputs .point").forEach(point => {
        const name = point.querySelector(".name").value;

        const latitudeInput = point.querySelector("input.latitude");
        const latitudeSelect = point.querySelector("select.latitude");
        const latitude = latitudeInput.value + latitudeSelect.getAttribute("data-selected").replace("°", "");

        const longitudeInput = point.querySelector("input.longitude");
        const longitudeSelect = point.querySelector("select.longitude");
        const longitude = longitudeInput.value + longitudeSelect.getAttribute("data-selected").replace("°", "");

        let speed = Number(point.querySelector("input.speed").value);
        const speedSelect = point.querySelector("select.speed");
        const unit = speedSelect.getAttribute("data-selected");
        if (unit === "mph") {
            speed /= 1.151;
            speed = Math.round(speed);
        } else if (unit === "kph") {
            speed /= 1.852;
            speed = Math.round(speed);
        }

        const stage = point.querySelector(".stage").getAttribute("data-selected");

        exportPoints.push({
            name,
            latitude,
            longitude,
            speed,
            stage
        });
    });

    console.log(`Whew. Data successfully exported: ${exportPoints}`);
    return exportPoints;
}

// Downloads the storm data
function downloadTrackData() {
    const stormName = document.querySelector(".name").value;
    const data = exportData();
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${stormName}.json`;
    a.click();
    console.log(`Storm data downloaded!`);
}

document.querySelector("#download-data").addEventListener("click", downloadTrackData);

// Imports the storm data
function importData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.addEventListener("change", () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const data = JSON.parse(reader.result);
            console.log(`Imported data successfully: ${data}`);
            importPoints(data);
        };
        reader.readAsText(file);
    });
    input.click();
    console.log(`Importing data...`);
}

document.querySelector("#import-data").addEventListener("click", importData);

// We now import the data
function importPoints(data) {
    const inputs = document.querySelector("#inputs");
    let new_inputs = document.querySelector(".point");

    new_inputs.querySelector(".name").value = data[0].name;

    const latitude = data[0].latitude;
    new_inputs.querySelector("input.latitude").value = latitude.slice(0, -1);
    new_inputs.querySelector("select.latitude").setAttribute("data-selected", latitude.slice(-1));
    handle_select(new_inputs.querySelector("select.latitude"));

    const longitude = data[0].longitude;
    new_inputs.querySelector("input.longitude").value = longitude.slice(0, -1);
    new_inputs.querySelector("select.longitude").setAttribute("data-selected", longitude.slice(-1));
    handle_select(new_inputs.querySelector("select.longitude"));

    let speed = data[0].speed;
    const unit = document.querySelector("select.speed").getAttribute("data-selected");
    if (unit === "mph") {
        speed *= 1.151;
    } else if (unit === "kph") {
        speed *= 1.852;
    }
    new_inputs.querySelector("input.speed").value = speed;
    new_inputs.querySelector("select.speed").setAttribute("data-selected", unit);
    handle_select(new_inputs.querySelector("select.speed"));

    const stage = data[0].stage;
    new_inputs.querySelector(".stage").setAttribute("data-selected", stage);
    handle_select(new_inputs.querySelector(".stage"));

    handle_removal(new_inputs.querySelector(".remove"));

    for (let i = 1; i < data.length; i++) {
        new_inputs = new_inputs.cloneNode(true);

        new_inputs.querySelector(".name").value = data[i].name;

        const latitude = data[i].latitude;
        new_inputs.querySelector("input.latitude").value = latitude.slice(0, -1);
        new_inputs.querySelector("select.latitude").setAttribute("data-selected", latitude.slice(-1));
        handle_select(new_inputs.querySelector("select.latitude"));

        const longitude = data[i].longitude;
        new_inputs.querySelector("input.longitude").value = longitude.slice(0, -1);
        new_inputs.querySelector("select.longitude").setAttribute("data-selected", longitude.slice(-1));
        handle_select(new_inputs.querySelector("select.longitude"));

        let speed = data[i].speed;
        const unit = document.querySelector("select.speed").getAttribute("data-selected");
        if (unit === "mph") {
            speed *= 1.151;
        } else if (unit === "kph") {
            speed *= 1.852;
        }
        new_inputs.querySelector("input.speed").value = speed;
        new_inputs.querySelector("select.speed").setAttribute("data-selected", unit);
        handle_select(new_inputs.querySelector("select.speed"));

        const stage = data[i].stage;
        new_inputs.querySelector(".stage").setAttribute("data-selected", stage);
        handle_select(new_inputs.querySelector(".stage"));

        handle_removal(new_inputs.querySelector(".remove"));

        inputs.appendChild(new_inputs);
        new_inputs.scrollIntoView();
    }
}