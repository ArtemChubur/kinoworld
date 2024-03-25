import React, {useEffect, useState} from 'react';
import './FilmsList.css'
import {useNavigate} from "react-router-dom";
import {axiosInstanceKinopoisk} from "../../APIS/api/api";
import {filmTypeConst} from "../../constants/FilmType";
import {FilmGenresConst} from "../../constants/FilmGenres";
import MenuIcon from '@mui/icons-material/Menu';
import {FilmCityConst} from "../../constants/FilmCity";
import {filmYearConst} from "../../constants/FilmYear";
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import Drawer from '@mui/material/Drawer';
import {CircularProgress, FormControl, InputLabel, MenuItem, Select} from "@mui/material";



function FilmsList() {
    const api_keys = ['SD3MWNV-82PMJEM-PD7NGSV-F0V9YFX', 'XPXMBKB-6Z740AK-JNF897G-BVXZKBM', 'R89TYM0-4GAMXYJ-HBRVH4F-3XHY5B4', 'SH03P8B-PTZ4NQ1-QZD1TFX-G7965BT', 'Q76DWP0-CM5MXAJ-P2JZSR5-KY2H9AY']
    const [filmsList, setFilmsList] = useState([]);
    const [isLoader, setIsLoader] = useState(true);
    const [filmType, setFilmType] = useState('')
    const navigate = useNavigate()
    const [filtres, setFiltres] = useState({})
    const [whatApiKey, setWhatApiKey] = useState(0);
    const [searchValue, setSearchValue] = useState('')
    const [filmListPage, setFilmListPage] = useState(1)
    const [open, setOpen] = React.useState(false);

    async function getFilmsListNextPage(api_key, page) {
        const filtresArray = Object.values(filtres)
        let filtresElements = ''
        filtresArray.map((item) => {filtresElements = filtresElements + item})
        setIsLoader(true)
        try {
            const response = await axiosInstanceKinopoisk.get(`movie?page=${page}&limit=30${filtresElements}&token=${api_key}&type=${filmType}`)
            // setFilmsList(response.data.docs)
            const addFilms = response.data.docs.map((item) => {
                filmsList.push(item)
            })
        } catch (e) {
            console.log(e)
            if (e.request.status === 403){
                switchApiKey();
            }
        } finally {
            setSearchValue('')
            setIsLoader(false)
        }
    }

    async function getFilmList(apiKey){
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
            setSearchValue('')
            setIsLoader(false)
        }
    }

    async function FilmSearchName(apiKey) {
        setIsLoader(true);
        try {
            const response = await axiosInstanceKinopoisk.get(`movie/search?page=1&limit=30&token=${apiKey}&query=${searchValue}`);
            setFilmsList(response.data.docs);
        } catch (e) {
            console.log(e);
            if (e.request.status === 403){
                switchApiKey();
            }
        } finally {
            setSearchValue('');
            setIsLoader(false);
        }
    }

    function switchApiKey() {
        setWhatApiKey(prevKey => (prevKey + 1) % api_keys.length);
    }
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    useEffect(() => {
        getFilmList(api_keys[whatApiKey]);
    }, [filmType, filtres, whatApiKey]);

    useEffect(() => {
        getFilmsListNextPage(api_keys[whatApiKey], filmListPage)
    }, [filmListPage]);

    return (
        <section className={'FilmsListElement'}>
            <div className={'search'}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    FilmSearchName(api_keys[whatApiKey])

                }}>
                    <label>
                        <input
                            value={searchValue}
                            className={'SearchInp'}
                            type="text"
                            onChange={(e) => {
                                setSearchValue(e.target.value)
                            }}
                            placeholder={'Введите название'}
                        />
                        <button
                            type="submit" // Замените "button" на "submit"
                            className={'SearchBtn'}
                        >
                            <SavedSearchIcon/>
                        </button>
                    </label>
                </form>
                <button
                    onClick={toggleDrawer(true)}
                    className={'BurgerMenuBtn'}
                >
                    <MenuIcon
                        fontSize={'large'}
                    />
                </button>
                <Drawer open={open} onClose={toggleDrawer(false)}>
                    <div className={'SideBar'}>
                        <div>
                            <p onClick={() => setFilmType('')}>Всe</p>
                            {filmTypeConst.map((item, idx) => {
                                return (
                                    <p onClick={() => setFilmType(item.type)} key={idx}>{item.text}</p>
                                )
                            })}
                            <div className={'line'}></div>
                        </div>
                        <div className={'filtres'}>
                            <FormControl variant="filled" sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="FilmGenres">Жанр</InputLabel>
                                <Select
                                    labelId="FilmGenres"
                                    id="demo-simple-select-filled"
                                    value={filtres.genres}
                                    onChange={(e) => {
                                        if (e.target.value !== '') {
                                            setFiltres(prevState => ({
                                                ...prevState,
                                                genres: `&genres.name=${e.target.value}`
                                            }))
                                        }
                                        if (filtres.genres !== '' && e.target.value === '') {
                                            // filtres.delete(genres)
                                            delete filtres.genres
                                        }
                                    }}
                                >
                                    <MenuItem value="">
                                        Все
                                    </MenuItem>
                                    {FilmGenresConst.map((item, idx) => {
                                        return (
                                            <MenuItem key={idx} value={item}>{item}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl variant="filled" sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="FilmCity">Страна</InputLabel>
                                <Select
                                    labelId="FilmCity"
                                    id="demo-simple-select-filled"
                                    value={filtres.city}
                                    onChange={(e) => {
                                        if (e.target.value !== '') {
                                            setFiltres(prevState => ({
                                                ...prevState,
                                                country: `&countries.name=${e.target.value}`
                                            }))
                                        }
                                        if (filtres.country !== '' && e.target.value === '') {
                                            // filtres.delete(Country)
                                            delete filtres.country
                                        }
                                    }}
                                >
                                    <MenuItem value="">
                                        Все
                                    </MenuItem>
                                    {FilmCityConst.map((item, idx) => {
                                        return (
                                            <MenuItem key={idx} value={item}>{item}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl variant="filled" sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="FilmYear">Год</InputLabel>
                                <Select
                                    labelId="FilmYear"
                                    id="demo-simple-select-filled"
                                    value={filtres.year}
                                    onChange={(e) => {
                                        if (e.target.value !== '') {
                                            setFiltres(prevState => ({...prevState, year: `&year=${e.target.value}`}))
                                        }
                                        if (filtres.year !== '' && e.target.value === '') {
                                            delete filtres.year
                                        }
                                    }}
                                >
                                    <MenuItem value="">
                                        Все
                                    </MenuItem>
                                    {filmYearConst.map((item, idx) => {
                                        return (
                                            <MenuItem key={idx} value={item}>{item}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <input
                                className={'FilterSearchBtn'}
                                type="button"
                                onClick={() => {
                                    // getFilmList(api_keys[whatApiKey])
                                    setOpen(false)
                                }}
                                value={'Показать'}
                            />
                        </div>

                    </div>
                </Drawer>
            </div>
            <div className={'filtresDiv'}>
                <ul className={'FilmTypeList'}>
                    <li
                        onClick={() => {
                            setFilmType('')
                        }}
                    >Все
                    </li>
                    {filmTypeConst.map((item, idx) => {
                        return (
                            <li key={idx} onClick={() => setFilmType(item.type)}>{item.text}</li>
                        )
                    })}
                </ul>
                <div className={'filtres'}>
                    <FormControl variant="filled" sx={{m: 1, minWidth: 120}}>
                        <InputLabel id="FilmGenres">Жанр</InputLabel>
                        <Select
                            labelId="FilmGenres"
                            id="demo-simple-select-filled"
                            value={filtres.genres}
                            onChange={(e) => {
                                if (e.target.value !== '') {
                                    setFiltres(prevState => ({...prevState, genres: `&genres.name=${e.target.value}`}))
                                }
                                if (filtres.genres !== '' && e.target.value === '') {
                                    // filtres.delete(genres)
                                    delete filtres.genres
                                }
                            }}
                        >
                            <MenuItem value="">
                                Все
                            </MenuItem>
                            {FilmGenresConst.map((item, idx) => {
                                return (
                                    <MenuItem key={idx} value={item}>{item}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <FormControl variant="filled" sx={{m: 1, minWidth: 120}}>
                        <InputLabel id="FilmCity">Страна</InputLabel>
                        <Select
                            labelId="FilmCity"
                            id="demo-simple-select-filled"
                            value={filtres.city}
                            onChange={(e) => {
                                if (e.target.value !== '') {
                                    setFiltres(prevState => ({
                                        ...prevState,
                                        country: `&countries.name=${e.target.value}`
                                    }))
                                }
                                if (filtres.country !== '' && e.target.value === '') {
                                    // filtres.delete(Country)
                                    delete filtres.country
                                }
                            }}
                        >
                            <MenuItem value="">
                                Все
                            </MenuItem>
                            {FilmCityConst.map((item, idx) => {
                                return (
                                    <MenuItem key={idx} value={item}>{item}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <FormControl variant="filled" sx={{m: 1, minWidth: 120}}>
                        <InputLabel id="FilmYear">Год</InputLabel>
                        <Select
                            labelId="FilmYear"
                            id="demo-simple-select-filled"
                            value={filtres.year}
                            onChange={(e) => {
                                if (e.target.value !== '') {
                                    setFiltres(prevState => ({...prevState, year: `&year=${e.target.value}`}))
                                }
                                if (filtres.year !== '' && e.target.value === '') {
                                    delete filtres.year
                                }
                            }}
                        >
                            <MenuItem value="">
                                Все
                            </MenuItem>
                            {filmYearConst.map((item, idx) => {
                                return (
                                    <MenuItem key={idx} value={item}>{item}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <input
                        className={'FilterSearchBtn'}
                        type="button"
                        onClick={() => {
                            getFilmList(api_keys[whatApiKey])
                        }}
                        value={'Показать'}
                    />
                </div>
            </div>
            <div>
                {isLoader ?
                    <div className={'LoadingFilmList'}>
                        <CircularProgress/>
                    </div>
                    :
                    <div className={'FilmsList'}>
                        {filmsList.map((item, idx) => {
                            return (
                                <div
                                    id={`filmCard${idx+1}`}
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
            {filmsList.length === 0 ||
                <div className={'loadMore'}>
                    <input
                        className={'LoadMoreBtn'}
                        type="button" value={'Загрузить еще'}
                        onClick={() => {
                            setFilmListPage(filmListPage + 1)
                        }}
                    />
                </div>
            }
            {isLoader || filmsList.length === 0 && <h2 className={'errorFilmList'}>Фильмы не найдены</h2>}
        </section>
    );
}

export default FilmsList;