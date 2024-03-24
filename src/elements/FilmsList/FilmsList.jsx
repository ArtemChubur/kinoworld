import React, {useEffect, useState} from 'react';
import './FilmsList.css'
import {useNavigate} from "react-router-dom";
import {axiosInstanceKinopoisk} from "../../APIS/api/api";
import {filmTypeConst} from "../../constants/FilmType";
import {FilmGenresConst} from "../../constants/FilmGenres";
import {CircularProgress, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {FilmCityConst} from "../../constants/FilmCity";
import {filmYearConst} from "../../constants/FilmYear";


function FilmsList() {
    const api_keys = ['SD3MWNV-82PMJEM-PD7NGSV-F0V9YFX', 'XPXMBKB-6Z740AK-JNF897G-BVXZKBM', 'R89TYM0-4GAMXYJ-HBRVH4F-3XHY5B4', 'SH03P8B-PTZ4NQ1-QZD1TFX-G7965BT', 'Q76DWP0-CM5MXAJ-P2JZSR5-KY2H9AY']
    const [filmsList, setFilmsList] = useState([]);
    const [isLoader, setIsLoader] = useState(true);
    const [filmType, setFilmType] = useState('')
    const navigate = useNavigate()
    const [filtres, setFiltres] = useState({})
    const [whatApiKey, setWhatApiKey] = useState(0);
    const [searchValue, setSearchValue] = useState('')

    async function getFilmsList(api_key) {
        setIsLoader(true)
        try {
            const response = await axiosInstanceKinopoisk.get(`movie?page=1&limit=30&token=${api_key}&type=${filmType}`)
            setFilmsList(response.data.docs)
        } catch (e) {
            console.log(e)
            if (e.request.status === 403){
                switchApiKey();
            }
        } finally {
            setIsLoader(false)
        }
    }

    async function getFilmFilter(apiKey){
        const filtresArray = Object.values(filtres)
        let filtresElements = ''
        filtresArray.map((item) => {filtresElements = filtresElements + item})
        try {
            const response = await axiosInstanceKinopoisk.get(`movie?page=1&limit=30${filtresElements}&token=${apiKey}&type=${filmType}`)
            setFilmsList(response.data.docs)
        } catch (e){
            console.log(e)
            if (e.request.status === 403){
                switchApiKey();
            }
        } finally {
            setIsLoader(false)
        }
    }

    async function FilmSearch() {
        try {
            const response = await axiosInstanceKinopoisk(`movie/search?page=1&limit=100&query=${searchValue}`)
        } catch (e){
            console.log(e)
        }
    }

    function switchApiKey() {
        setWhatApiKey(prevKey => (prevKey + 1) % api_keys.length);
    }

    useEffect(() => {
        if (filtres.country !== '' && filtres.genres !== '' && filtres.year !== '') {
            getFilmFilter(api_keys[whatApiKey]);
        } else {
            getFilmsList(api_keys[whatApiKey]);
        }
    }, [filmType, filtres, whatApiKey]);



    return (
        <section className={'FilmsListElement'}>
            <input
                type="text"
            />
            <div>
                <ul className={'FilmTypeList'}>
                    <li
                        onClick={() => {
                            setFilmType('')
                        }}
                    >Все</li>
                    {filmTypeConst.map((item, idx) => {
                        return (
                            <li key={idx} onClick={() => setFilmType(item.type)}>{item.text}</li>
                        )
                    })}
                </ul>
                <div className={'filtres'}>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="FilmGenres">Жанр</InputLabel>
                        <Select
                            labelId="FilmGenres"
                            id="demo-simple-select-filled"
                            value={filtres.genres}
                            onChange={(e) => {
                                if (e.target.value !== ''){
                                    setFiltres(prevState => ({...prevState, genres: `&genres.name=${e.target.value}`}))
                                }
                                if (filtres.genres !== '' && e.target.value === ''){
                                    // filtres.delete(genres)
                                    delete filtres.genres
                                }
                            }}
                        >
                            <MenuItem value="">
                                Все
                            </MenuItem>
                            {FilmGenresConst.map((item, idx) => {
                                return(
                                    <MenuItem key={idx} value={item}>{item}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="FilmCity">Страна</InputLabel>
                        <Select
                            labelId="FilmCity"
                            id="demo-simple-select-filled"
                            value={filtres.city}
                            onChange={(e) => {
                                if (e.target.value !== ''){
                                    setFiltres(prevState => ({...prevState, country: `&countries.name=${e.target.value}`}))
                                }
                                if (filtres.country !== '' && e.target.value === ''){
                                    // filtres.delete(Country)
                                    delete filtres.country
                                }
                            }}
                        >
                            <MenuItem value="">
                                Все
                            </MenuItem>
                            {FilmCityConst.map((item, idx) => {
                                return(
                                    <MenuItem key={idx} value={item}>{item}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="FilmYear">Год</InputLabel>
                        <Select
                            labelId="FilmYear"
                            id="demo-simple-select-filled"
                            value={filtres.year}
                            onChange={(e) => {
                                if (e.target.value !== ''){
                                    setFiltres(prevState => ({...prevState, year: `&year=${e.target.value}`}))
                                }
                                if (filtres.year !== '' && e.target.value === ''){
                                    delete filtres.year
                                }
                            }}
                        >
                            <MenuItem value="">
                                Все
                            </MenuItem>
                            {filmYearConst.map((item, idx) => {
                                return(
                                    <MenuItem key={idx} value={item}>{item}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <input
                        className={'FilterSearchBtn'}
                        type="button"
                        onClick={() => {getFilmFilter(api_keys[whatApiKey])}}
                        value={'Показать'}
                    />
                </div>
            </div>
            <div>
                {isLoader ?
                    <div className={'LoadingFilmList'}>
                        <CircularProgress />
                    </div>
                    :
                    <div className={'FilmsList'}>
                        {filmsList.map((item, idx) => {
                            return (
                               <div
                                    key={idx}
                                    onClick={() => {
                                        navigate(`/${item.id}`)
                                    }}
                                    className={'FilmList-film'}
                                >
                                    <img className={'FilmPoster'} src={item.poster.previewUrl} alt=""/>
                                    <div className={'FilmsList-filmDescription'}>
                                        <h2 className={'filmsList-FilmTitle'}>{item.name}</h2>
                                        <div className={'genres'}>
                                            {item.genres.map((item, idx) => {
                                                return (
                                                    <p key={idx}>{item.name}</p>
                                                )
                                            })}
                                        </div>
                                        <p>{item.year}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
        </section>
    );
}

export default FilmsList;