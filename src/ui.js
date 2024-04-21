import {MSTS} from "./mosmetro";
import axios from "axios";
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const submitBtn = document.getElementById("submit");
const formEl = document.getElementById("form");
import {draw, getFromWhiteToRed, loading} from "./index.js";
class LoaderButton {
    constructor(button) {
        this.button = button
        this.buttonText = this.button.querySelector(".button-text");
        this.loader = this.button.querySelector(".loader");
    }

    startLoader() {
        this.button.disabled = true;
        this.buttonText.style.display = "none";
        this.loader.style.display = "inline-block";
    }

    endLoader() {
        this.button.disabled = false;
        this.buttonText.style.display = "inline";
        this.loader.style.display = "none";
    }
}
const popup = document.getElementById("popup");
export function updatePopup({fill, station, e}) {

    if(!station) {
        popup.style.opacity = '0';
        return
    }else{
        popup.style.opacity = '1';
    }
    popup.style.left = `${e.clientX}px`;
    popup.style.top = `${e.clientY}px`;
    // console.log(e)
    popup.innerHTML = `
        <h3 style="margin:0 10px 10px 10px; text-align: center">${station}</h3>
        <div class="filler-container">
            <div class="filler" style="width: ${Math.round(fill * 100)}%; background-color: ${getFromWhiteToRed(fill)}"></div>
            <p style="position: absolute; margin: 0px; text-align: center; width: 100%">Нагруженность ${Math.round(fill * 100)}%</p>
        </div>
    `

}
const loader = new LoaderButton(submitBtn)
export const request = async (e) => {
    try {
        if(e) e.preventDefault()
        const date = dateEl.value;
        const time = timeEl.value;
        const datetime = `${date} ${time}`;
        console.log(JSON.stringify({datetime}));
        loader.startLoader()
        const response = await fetch("https://25fb-149-40-58-147.ngrok-free.app", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({date})
        })
        loader.endLoader()
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
}
request()
submitBtn.addEventListener("click", request);

