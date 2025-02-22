const searchCity = document.querySelector("input");
searchCity.addEventListener("keypress", findWeather);

let icons = [
  {
    icon: "01d",
    img: "https://img.icons8.com/?size=100&id=15352&format=png&color=000000",
  },
  {
    icon: "02d",
    img: "https://img.icons8.com/?size=100&id=15359&format=png&color=000000",
  },
  {
    icon: "03d",
    img: "https://img.icons8.com/?size=100&id=39327&format=png&color=000000",
  },
  {
    icon: "04d",
    img: "https://img.icons8.com/?size=100&id=aAA5kxYkBsEm&format=png&color=000000",
  },
  {
    icon: "09d",
    img: "https://img.icons8.com/?size=100&id=15360&format=png&color=000000",
  },
  {
    icon: "10d",
    img: "https://img.icons8.com/?size=100&id=19541&format=png&color=000000",
  },
  {
    icon: "11d",
    img: "https://img.icons8.com/?size=100&id=39379&format=png&color=000000",
  },
  {
    icon: "13d",
    img: "https://img.icons8.com/?size=100&id=15356&format=png&color=000000",
  },
  {
    icon: "50d",
    img: "https://img.icons8.com/?size=100&id=obnXgS7SsY22&format=png&color=000000",
  },
  {
    icon: "01n",
    img: "https://img.icons8.com/?size=100&id=62034&format=png&color=000000",
  },
  {
    icon: "02n",
    img: "https://img.icons8.com/?size=100&id=VT8HlhlnhUwL&format=png&color=000000",
  },
  {
    icon: "03n",
    img: "https://img.icons8.com/?size=100&id=39327&format=png&color=000000",
  },
  {
    icon: "04n",
    img: "https://img.icons8.com/?size=100&id=aAA5kxYkBsEm&format=png&color=000000",
  },
  {
    icon: "09n",
    img: "https://img.icons8.com/?size=100&id=15360&format=png&color=000000",
  },
  {
    icon: "10n",
    img: "https://img.icons8.com/?size=100&id=wBPV56Uje50D&format=png&color=000000",
  },
  {
    icon: "11n",
    img: "https://img.icons8.com/?size=100&id=39379&format=png&color=000000",
  },
  {
    icon: "13n",
    img: "https://img.icons8.com/?size=100&id=15356&format=png&color=000000",
  },
  {
    icon: "50n",
    img: "https://img.icons8.com/?size=100&id=obnXgS7SsY22&format=png&color=000000",
  },
];

async function findWeather(e) {
  if (e.key === "Enter") {
    const cityName = searchCity.value;
    try {
      const [{ lat, lon, name }] = await findCity(cityName);
      const currentWeatherData = await getCurrentWeather(lat, lon);
      const fiveDayWeatherData = await get5DayWeather(lat, lon);
      console.log(currentWeatherData);
      console.log(fiveDayWeatherData);
      // set values
      // main-section values
      document.querySelector("#cityNameText").innerText = name;
      document.querySelector("#tempText").innerText =
        currentWeatherData.main.temp;
      icons.forEach((el) => {
        if (el.icon === currentWeatherData.weather[0].icon) {
          document.querySelector("#main-img").src = el.img;
        }
      });

      // section2 values
      for (let i = 0; i < 6; i++) {
        const time = UnixToLocaleTime(fiveDayWeatherData.list[i].dt);
        const card = `card${i + 1}`;
        document.querySelector(`#${card}-time`).innerText = time;
        document.querySelector(`#${card}-temp`).innerText =
          fiveDayWeatherData.list[i].main.temp;
        icons.forEach((el) => {
          if (el.icon === fiveDayWeatherData.list[i].weather[0].icon) {
            document.querySelector(`#${card}-img`).src = el.img;
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
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

  const timeString = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return timeString;
}
