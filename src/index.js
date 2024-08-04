import './style.css';
import {format, fromUnixTime} from 'date-fns';

const locationInput = document.getElementById("location");
const form = document.querySelector("form");
const metricBtn = document.getElementById("metric");
const usBtn = document.getElementById("us");

let unit = "metric";
let unitSymbol = "ºC";
let windUnit = "Km/h";
let location = "";

async function getData(location)
{
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=CC3H66JXEMC8ZNQTSJKSM526F&unitGroup=${unit}&include=days,current&iconSet&elements=hours,datetimeEpoch,cloudcover,conditions,feelslike,hours,humidity,precipprob,sunriseEpoch,sunsetEpoch,temp,tempmax,tempmin,uvindex,windspeed`);
    const weatherData = await response.json();
    showData(weatherData);
}


form.addEventListener("submit", e => {
    e.preventDefault();
    location = locationInput.value;
    getData(location);
    form.reset();
});

metricBtn.addEventListener("click", ()=>
{
    unit = "metric";
    unitSymbol = "ºC";
    windUnit = "Km/h";
    metricBtn.className = "active";
    usBtn.className = "";
    if(location !== "") getData(location);
});

usBtn.addEventListener("click", ()=>
{
    unit = "us";
    unitSymbol = "ºF";
    windUnit = "mph"
    metricBtn.className = "";
    usBtn.className = "active";
    if(location !== "") getData(location);
    
})

function showData(weatherData)
{
    const dataSection = document.querySelector(".data-section");

    const locationName = document.querySelector(".location-name");
    const locationDate = document.querySelector(".date");

    const temp = document.getElementById("temp");
    const condition = document.getElementById("condition");
    const feelsLike = document.getElementById("feels");
    const tempRange = document.getElementById("temp-range");

    const humidity = document.getElementById("humidity");
    const uvIndex = document.getElementById("uv-index");
    const sunrise = document.getElementById("sunrise");
    const sunset = document.getElementById("sunset");
    const wind = document.getElementById("wind");
    const precipprob = document.getElementById("precipprob");

    const weekDays = document.querySelectorAll(".day");

    dataSection.className = "data-section active";

    locationName.textContent = weatherData.resolvedAddress;
    locationDate.textContent = format(new Date(), "eeee d MMMM yyyy | HH:mm");

    temp.textContent = `${weatherData.currentConditions.temp}${unitSymbol}`;
    condition.textContent = weatherData.currentConditions.conditions;
    feelsLike.textContent = `Feels like ${weatherData.currentConditions.feelslike}${unitSymbol}`;
    tempRange.textContent = `${weatherData.days[0].tempmax}${unitSymbol} / ${weatherData.days[0].tempmin}${unitSymbol}`;
    
    humidity.textContent = `${weatherData.currentConditions.humidity}%`;
    uvIndex.textContent = weatherData.currentConditions.uvindex;
    sunrise.textContent = format(fromUnixTime(weatherData.currentConditions.sunriseEpoch), "HH:mm");
    sunset.textContent = format(fromUnixTime(weatherData.currentConditions.sunsetEpoch), "HH:mm");
    wind.textContent = `${weatherData.currentConditions.windspeed} ${windUnit}`;
    precipprob.textContent = `${weatherData.currentConditions.precipprob}%`;

    weekDays.forEach(day =>
    {
        const index = day.dataset.index;
        const weekDay = format(fromUnixTime(weatherData.days[index].datetimeEpoch), "EEEE");
        //day.textContent = `${weekDay} ${weatherData.days[index].tempmax}${unitSymbol} | ${weatherData.days[index].tempmin}${unitSymbol}`;
        day.innerHTML = `<span class="wday">${weekDay}</span> ${weatherData.days[index].tempmax}${unitSymbol} | ${weatherData.days[index].tempmin}${unitSymbol}`;
    }
    )
}