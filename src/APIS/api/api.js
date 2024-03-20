import axios from "axios";

const axiosInstanceKinopoisk = axios.create({
    baseURL: 'https://api.kinopoisk.dev/v1.4/'
})

const axiosInstanceKinobox = axios.create({
    baseURL: 'https://kinobox.tv/api'
})

export {axiosInstanceKinopoisk, axiosInstanceKinobox}