import './style.css';
import {format, getDay, toDate, fromUnixTime} from 'date-fns';

const locationInput = document.getElementById("location");
const form = document.querySelector("form");
let unit = "metric";
let unitSymbol = "ºC";
let windUnit = "Km/h";


async function getData(location)
{
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=CC3H66JXEMC8ZNQTSJKSM526F&unitGroup=${unit}&include=days,current&iconSet&elements=hours,datetimeEpoch,cloudcover,conditions,feelslike,hours,humidity,precipprob,sunriseEpoch,sunsetEpoch,temp,tempmax,tempmin,uvindex,windspeed`);
    const weatherData = await response.json();
    showData(weatherData);
}


form.addEventListener("submit", e => {
    e.preventDefault();
    getData(locationInput.value);
    form.reset();
});

function showData(weatherData)
{
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
    const cloudCover = document.getElementById("cloud-cover");
    const precipprob = document.getElementById("precipprob");

    const weekDays = document.querySelectorAll(".day");


    console.log(weatherData);
    locationName.textContent = weatherData.resolvedAddress;
    locationDate.textContent = format(new Date(), "eeee d MMMM yyyy | HH:mm");

    temp.textContent = `${weatherData.currentConditions.temp}${unitSymbol}`;
    condition.textContent = weatherData.currentConditions.conditions;
    feelsLike.textContent = `Feels like ${weatherData.currentConditions.feelslike}${unitSymbol}`;
    tempRange.textContent = `Temp max: ${weatherData.days[0].tempmax}${unitSymbol} Temp min: ${weatherData.days[0].tempmin}${unitSymbol}`;
    
    humidity.textContent = `${weatherData.currentConditions.humidity}%`;
    uvIndex.textContent = weatherData.currentConditions.uvindex;
    sunrise.textContent = format(fromUnixTime(weatherData.currentConditions.sunriseEpoch), "HH:mm");
    sunset.textContent = format(fromUnixTime(weatherData.currentConditions.sunsetEpoch), "HH:mm");
    wind.textContent = `${weatherData.currentConditions.windseepd} ${windUnit}`;
    cloudCover.textContent = `${weatherData.currentConditions.cloudcover}%`;
    precipprob.textContent = `${weatherData.currentConditions.precipprob}%`;

    weekDays.forEach(day =>
    {
        const index = day.dataset.index;
        const weekDay = format(fromUnixTime(weatherData.days[index].datetimeEpoch), "EEEE");
        day.textContent = `${weekDay} ${weatherData.days[index].tempmax}${unitSymbol} ${weatherData.days[index].tempmin}${unitSymbol}`;
    }
    )
}