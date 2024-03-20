import React, {useEffect, useState} from 'react';
import './FilmsList.css'
import {useNavigate} from "react-router-dom";
import {axiosInstanceKinopoisk} from "../../APIS/api/api";
import {filmTypeConst} from "../../constants/FilmType";
import {FilmGenresConst} from "../../constants/FilmGenres";
import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";

function FilmsList() {
    // const api_key = 'SD3MWNV-82PMJEM-PD7NGSV-F0V9YFX'
    const api_key = 'XPXMBKB-6Z740AK-JNF897G-BVXZKBM'
    const [filmsList, setFilmsList] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
    const [filmType, setFilmType] = useState('')
    const [genres, setGenres] = useState('')
    const navigate = useNavigate()

    async function getFilmsList() {
        setIsLoader(true)
        try {
            const response = await axiosInstanceKinopoisk.get(`movie?page=1&limit=30&token=${api_key}&type=${filmType}`)
            setFilmsList(response.data.docs)
            console.log(response.data)
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoader(false)
        }
    }

    async function getFilmFilter(value){
        try {
            const response = await axiosInstanceKinopoisk.get(`/movie?page=1&limit=30&genres.name=${value}&token=${api_key}&type=${filmType}`)
            setFilmsList(response.data.docs)
            console.log(response.data.docs)
        } catch (e){
            console.log(e)
        }
    }

    useEffect(() => {
        console.log(genres)
        if (genres !== ''){
            getFilmFilter(`${genres}`)
        } else {
            getFilmsList()
        }
    }, [genres]);

    useEffect(() => {
        getFilmsList()
    }, []);

    useEffect(() => {
        getFilmsList()
    }, [filmType])

    return (
        <div className={'FilmsListElement'}>
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
                <Box>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-filled-label">Жанр</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={genres}
                            onChange={(e) => {setGenres(e.target.value)}}
                        >
                            <MenuItem value="">
                                Все
                            </MenuItem>
                            {FilmGenresConst.map((item, idx) => {
                                return(
                                    <MenuItem value={item}>{item}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </Box>
                {/*<div>*/}
                {/*    <button onClick={toggleDrawer('right', true)} className={'OpenMenuBtn'}>*/}
                {/*        <MenuIcon*/}
                {/*            fontSize={'large'}*/}
                {/*        />*/}
                {/*    </button>*/}
                {/*    <Drawer*/}
                {/*        anchor={'right'}*/}
                {/*        open={open['right']}*/}
                {/*        onClose={toggleDrawer('right', false)}*/}
                {/*    >*/}
                {/*        {list('right')}*/}
                {/*    </Drawer>*/}
                {/*</div>*/}
            </div>
            <div>
                {isLoader ?
                    <p>Load...</p>
                    :
                    <div className={'FilmsList'}>
                        {filmsList.map((item, idx) => {
                            return (
                                // <iframe key={idx} allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" src={item.iframeUrl} />
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
        </div>
    );
}

export default FilmsList;