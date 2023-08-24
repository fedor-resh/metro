import {MSTS} from "./mosmetro";
import axios from "axios";
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const submitBtn = document.getElementById("submit");
const formEl = document.getElementById("form");
import {draw, loading} from "./index.js";

const popup = document.getElementById("popup");
export function updatePopup({fill, station}) {
    popup.innerHTML = `
        <div class="loader-container">
            <h3 style="position: absolute">${station}</h3>
            <div style="position: relative; top 100px">
                <div class="loader" style="width: ${Math.round(fill*100)}%"></div>
                <p style="position: absolute; margin: 0!important; text-align: center; width: 100%">заполнено на ${Math.round(fill*100)}%</p>
            </div>
        </div>
    `
}
updatePopup({fill: 0.5, station: "Китай-город"})
submitBtn.addEventListener("click", async (e) => {
    try {
        e.preventDefault()
        const date = dateEl.value;
        const time = timeEl.value;
        const datetime = `${date} ${time}`;
        console.log(JSON.stringify({datetime}));

        const response = await fetch("/api", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({datetime})
        })
        if (response.ok) {
            loading.stations = await response.json();
            loading.stations = loading.stations.stations
            draw();
        } else {
            console.error("Server returned an error:", await response.text());
        }

    } catch (error) {
        console.error("An error occurred:", error);
    }
});

