import {MSTS} from "./mosmetro";
import axios from "axios";
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const submitBtn = document.getElementById("submit");
const formEl = document.getElementById("form");
import {draw, loading} from "./index.js";
// send when the submit button is clicked


submitBtn.addEventListener("click", async (e) => {
    try {
        e.preventDefault()
        const date = dateEl.value;
        const time = timeEl.value;
        const datetime = `${date} ${time}`;
        console.log(JSON.stringify({datetime}));

        const response = await fetch("http://back.nightmirror.ru:25518/predict/all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({datetime})
        });

        if (response.ok) {
            loading.stations = await response.json();
            console.log(loading.stations);
            draw();
        } else {
            console.error("Server returned an error:", await response.text());
        }

    } catch (error) {
        console.error("An error occurred:", error);
    }
});

