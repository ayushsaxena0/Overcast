document.querySelector("button").addEventListener("click", findWeather);

async function findWeather(e) {
  event.preventDefault();
  const cityName = document.querySelector("input").value;
  try {
    const [{ lat, lon, name }] = await findCity(cityName);
    const currentWeatherData = await getCurrentWeather(lat, lon);
    const fiveDayWeatherData = await get5DayWeather(lat, lon);

    // showing container and removing instruction
    document.querySelector("#instruction").classList.add("d-none");
    document.querySelector("#container").classList.remove("d-none");
    // set values
    // main-section values
    document.querySelector("#cityName").innerText = name;
    document.querySelector("#tempText").innerText =
      Math.floor(currentWeatherData.main.temp) + "°C";
    document.querySelector("#weatherDesc").innerText =
      currentWeatherData.weather[0].description.toUpperCase();

    // section1 cards gird-one loop
    let currentWeatherObj = {
      "FEELS LIKE": Math.floor(currentWeatherData.main.feels_like) + "°C",
      "CLOUDINESS (in %)": currentWeatherData.clouds.all,
      "VISIBILITY (in m)": currentWeatherData.visibility,
      HUMIDITY: currentWeatherData.main.humidity,
    };

    let gridOne = "";
    for (const key in currentWeatherObj) {
      gridOne += `<div class="col-6">
                    <div class="card shadow-sm border-0">
                      <div class="card-body">
                        <p class="card-text">${key}</p>
                        <h3 class="card-title">${currentWeatherObj[key]}</h3>
                      </div>
                    </div>
                  </div>`;
    }

    document.querySelector("#grid-one").innerHTML = gridOne;

    // section2 card grid-two
    let gridTwo = "";
    for (let i = 0; i < 6; i++) {
      const time = UnixToLocaleTime(fiveDayWeatherData.list[i].dt);
      gridTwo += `<div class="col-6 col-sm-4 col-md-4 col-lg-2 ">
                  <!-- inside card -->
                  <div class="card shadow-sm border-0">
                    <div class="card-body">
                      <p class="card-text">${time[0]}</p>
                      <h4 class="card-title">${Math.floor(
                        fiveDayWeatherData.list[i].main.temp
                      )}°C</h4>
                      <img class="card-img-top img-fluid" src=
                        'https://openweathermap.org/img/wn/${
                          fiveDayWeatherData.list[i].weather[0].icon
                        }@2x.png' 
                      alt="Weather Icon" />
                    </div>
                  </div>
                </div>`;
    }
    document.querySelector("#grid-two").innerHTML = gridTwo;

    // section2 card grid-three
    let gridThree = "";
    let arr = [
      fiveDayWeatherData.list[0],
      fiveDayWeatherData.list[8],
      fiveDayWeatherData.list[16],
      fiveDayWeatherData.list[24],
      fiveDayWeatherData.list[32],
    ];
    arr.forEach((el, i) => {
      const day = UnixToLocaleTime(el.dt);
      gridThree += `<div class="col-6 col-sm-4 col-md-4 col-lg-2">
                  <div class="card border-0 shadow-sm ">
                    <div class="card-body">
                      <p class="card-text">${i == 0 ? "Today" : day[1]}</p>
                      <h4 class="card-title">${Math.floor(el.main.temp)}°C</h4>
                      <img class="card-img-top img-fluid" src='https://openweathermap.org/img/wn/${
                        el.weather[0].icon
                      }@2x.png' alt="Weather Icon" />
                    </div>
                  </div>
                </div>`;
    });

    document.querySelector("#grid-three").innerHTML = gridThree;
  } catch (error) {
    console.error(error);
  }
}

async function findCity(cityName) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=6892dbfbfce06088744630b076df0b01`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function getCurrentWeather(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=6892dbfbfce06088744630b076df0b01`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function get5DayWeather(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=6892dbfbfce06088744630b076df0b01`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

function UnixToLocaleTime(time) {
  const timestamp = time;
  const date = new Date(timestamp * 1000); // Convert to milliseconds

  const timeString = date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dayName = date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short", // options: "long", "short", or "narrow"
  });

  return [timeString, dayName];
}
