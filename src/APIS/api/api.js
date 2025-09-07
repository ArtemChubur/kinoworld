import axios from "axios";

const axiosInstanceKinopoisk = axios.create({
    baseURL: 'https://kinopoiskapiunofficial.tech/api/v2.2'
    // baseURL: 'https://api.kinopoisk.dev/v1.4/'
})

const axiosInstanceKinobox = axios.create({
    baseURL: 'https://api.kinobox.tv/api'
})

export {axiosInstanceKinopoisk, axiosInstanceKinobox}