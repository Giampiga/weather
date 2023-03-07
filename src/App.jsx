// console.log(import.meta.env.VITE_API_KEY); 

import { LoadingButton } from '@mui/lab'
import { Container, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_API_KEY}&q=`

export default function App () {

  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    error: false,
    message: "",

  });

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    temp: 0,
    condition: "",
    conditionText: "",
    icon: "",
    fl_c: 0,
    fl_f: 0,
  });

  const onSubmit = async(e) => {
    e.preventDefault();
    setError({
      error: false,
      message: "",
    })
    setLoading(true);  

    try {
      if(!city.trim()) throw { message: "City is required!"}

      const res = await fetch(`${API_WEATHER}${city}`);
      const data = await res.json();

      if (data.error) {
       throw { message: data.error.message }
      }

      console.log(data)

      setWeather({
        city: data.location.name,
        country: data.location.country,
        tz_id: data.location.tz_id,
        loc_time: data.location.localtime,
        temperature: data.current.temp_c,
        temp: data.current.temp_f,
        condition: data.current.condition.code,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon,
        fl_f: data.current.feelslike_f,
        fl_c: data.current.feelslike_c,
      });
    } catch (error) {
      setError({
        error: true,
        message: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container 
      maxWidth="xs"
      sx={{ mt: 2 }}
    >
      <Typography 
        variant="h2"
        component="h1" 
        align="center" 
        gutterBottom
      >
          Weather App
      </Typography>
      <Box 
        sx={{display: "grid", gap: 2}} 
        component="form" 
        autoComplete="off" 
        onSubmit={onSubmit}
      >
        <TextField 
          id="city" 
          label="Type Your City" 
          variant="outlined" 
          size="small" 
          required 
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)} 
          error={error.error}
          helperText={error.message}/>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            loadingIndicator="Loading...">
              Search
          </LoadingButton>
      </Box>

      {weather.city && (
        <Box
          sx={{ 
            mt: 2,
            display: "grid",
            gap: 2,
            textAlign: "center", 
          }} >
            <Typography variant="h4" component="h2">
              {weather.city}, {weather.country}
            </Typography>
            <Typography variant="h6" component="h4">
              Timezone: {weather.loc_time}, {weather.tz_id}
            </Typography>
  
            <Typography variant="h5" component="h3">
              {weather.temperature} °C | {weather.temp} °F
            </Typography>
            <Typography variant="h6" component="h4">
              Feels like: {weather.fl_c} °C | {weather.fl_f} °F
            </Typography>
            <Typography variant="h6" component="h4">
              <Box 
                component="img"
                alt={weather.conditionText}
                src={weather.icon}
                sx= {{margin: "0 auto"}}
              />
             </Typography>
            <Typography variant="h6" component="h4">
              {weather.conditionText}
            </Typography>
          </Box>
      )}

      <Typography
        textAlign="center"
        sx={{ mt: 2, fontSize: "10px" }}>
          Powered by: {" "}
          <a href="https://www.weatherapi.com"
            title="Weather API">
              WeatherAPI.com
          </a>
      </Typography>
    </Container>

  )
}