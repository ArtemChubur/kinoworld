import React, {useEffect, useState} from 'react';
import './FilmsList.css'
import {useNavigate, Link} from "react-router-dom";
import {axiosInstanceKinopoisk} from "../../APIS/api/api";
import {filmTypeConst} from "../../constants/FilmType";
import {FilmGenresConst} from "../../constants/FilmGenres";
import MenuIcon from '@mui/icons-material/Menu';
import {FilmCityConst} from "../../constants/FilmCity";
import {filmYearConst} from "../../constants/FilmYear";
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import Drawer from '@mui/material/Drawer';
import {CircularProgress, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import noImg from '../../assets/noPhoto.png'



function FilmsList() {
    const api_keys = ['SD3MWNV-82PMJEM-PD7NGSV-F0V9YFX', 'XPXMBKB-6Z740AK-JNF897G-BVXZKBM', 'R89TYM0-4GAMXYJ-HBRVH4F-3XHY5B4', 'SH03P8B-PTZ4NQ1-QZD1TFX-G7965BT', 'Q76DWP0-CM5MXAJ-P2JZSR5-KY2H9AY']

    const [isLoader, setIsLoader] = useState(true);
    const [loadMoreBtnVisible, setLoadMoreBtnVisible] = useState(true)
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('')
    const [filmType, setFilmType] = useState('')
    const [whatApiKey, setWhatApiKey] = useState(0);
    const [filmListPage, setFilmListPage] = useState(1)
    const [endFilmNum, setEndFilmNum] = useState(0)
    const [filmsList, setFilmsList] = useState([]);
    const [filtres, setFiltres] = useState({})

    async function getFilmList(apiKey){
        const filtresArray = Object.values(filtres)
        let filtresElements = ''
        filtresArray.map((item) => {filtresElements = filtresElements + item})
        try {
            const response = await axiosInstanceKinopoisk.get(`films/collections?page=${filmListPage}&limit=48&type=TOP_POPULAR_ALL`, {
                headers: {
                    'X-API-KEY': '58c04246-0d2c-4ca8-ac44-176c8ed25419',
                    'Content-Type': 'application/json',
                }
            })
            setFilmsList(response.data.items)
            setLoadMoreBtnVisible(true)
        } catch (e){
            console.log(e)
            if (e.request.status === 403){
                switchApiKey();
            }
        } finally {
            setIsLoader(false)
            window.scrollTo({
                top: 250,
                left: 0,
                behavior: 'smooth'
            });
        }
    }

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
            setLoadMoreBtnVisible(true)
            setEndFilmNum(prevState => prevState + 30)
        } catch (e) {
            console.log(e)
            if (e.request.status === 403){
                switchApiKey();
            } else {
                setLoadMoreBtnVisible(true)
            }
        } finally {
            setSearchValue('')
            setIsLoader(false)
        }
    }

    async function FilmSearchName(apiKey) {
        setIsLoader(true);
        try {
            const response = await axiosInstanceKinopoisk.get(`movie/search?page=1&limit=250&token=${apiKey}&query=${searchValue}&type=${filmType}`);
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
    }, [filmType, filtres, whatApiKey, filmListPage]);

    // useEffect(() => {
    //     getFilmsListNextPage(api_keys[whatApiKey], filmListPage)
    // }, []);

    return (
        <section className={'FilmsListElement'}>
            {/*<div className={'search'}>*/}
            {/*    <form onSubmit={(e) => {*/}
            {/*        e.preventDefault();*/}
            {/*        FilmSearchName(api_keys[whatApiKey])*/}
            {/*        setLoadMoreBtnVisible(false)*/}

            {/*    }}>*/}
            {/*        <label>*/}
            {/*            <input*/}
            {/*                value={searchValue}*/}
            {/*                className={'SearchInp'}*/}
            {/*                type="text"*/}
            {/*                onChange={(e) => {*/}
            {/*                    setSearchValue(e.target.value)*/}
            {/*                }}*/}
            {/*                placeholder={'Введите название'}*/}
            {/*            />*/}
            {/*            <button*/}
            {/*                type="submit" // Замените "button" на "submit"*/}
            {/*                className={'SearchBtn'}*/}
            {/*            >*/}
            {/*                <SavedSearchIcon/>*/}
            {/*            </button>*/}
            {/*        </label>*/}
            {/*    </form>*/}
            {/*    <button*/}
            {/*        onClick={toggleDrawer(true)}*/}
            {/*        className={'BurgerMenuBtn'}*/}
            {/*    >*/}
            {/*        <MenuIcon*/}
            {/*            fontSize={'large'}*/}
            {/*        />*/}
            {/*    </button>*/}
            {/*    <Drawer open={open} onClose={toggleDrawer(false)}>*/}
            {/*        <div className={'SideBar'}>*/}
            {/*            <div>*/}
            {/*                <p onClick={() => setFilmType('')}>Всe</p>*/}
            {/*                {filmTypeConst.map((item, idx) => {*/}
            {/*                    return (*/}
            {/*                        <p onClick={() => setFilmType(item.type)} key={idx}>{item.text}</p>*/}
            {/*                    )*/}
            {/*                })}*/}
            {/*                <div className={'line'}></div>*/}
            {/*            </div>*/}
            {/*            <div className={'filtres'}>*/}
            {/*                <FormControl variant="filled" sx={{m: 1, minWidth: 120}}>*/}
            {/*                    <InputLabel id="FilmGenres">Жанр</InputLabel>*/}
            {/*                    <Select*/}
            {/*                        labelId="FilmGenres"*/}
            {/*                        id="demo-simple-select-filled"*/}
            {/*                        value={filtres.genres}*/}
            {/*                        onChange={(e) => {*/}
            {/*                            if (e.target.value !== '') {*/}
            {/*                                setFiltres(prevState => ({*/}
            {/*                                    ...prevState,*/}
            {/*                                    genres: `&genres.name=${e.target.value}`*/}
            {/*                                }))*/}
            {/*                            }*/}
            {/*                            if (filtres.genres !== '' && e.target.value === '') {*/}
            {/*                                // filtres.delete(genres)*/}
            {/*                                delete filtres.genres*/}
            {/*                            }*/}
            {/*                        }}*/}
            {/*                    >*/}
            {/*                        <MenuItem value="">*/}
            {/*                            Все*/}
            {/*                        </MenuItem>*/}
            {/*                        {FilmGenresConst.map((item, idx) => {*/}
            {/*                            return (*/}
            {/*                                <MenuItem key={idx} value={item}>{item}</MenuItem>*/}
            {/*                            )*/}
            {/*                        })}*/}
            {/*                    </Select>*/}
            {/*                </FormControl>*/}
            {/*                <FormControl variant="filled" sx={{m: 1, minWidth: 120}}>*/}
            {/*                    <InputLabel id="FilmCity">Страна</InputLabel>*/}
            {/*                    <Select*/}
            {/*                        labelId="FilmCity"*/}
            {/*                        id="demo-simple-select-filled"*/}
            {/*                        value={filtres.city}*/}
            {/*                        onChange={(e) => {*/}
            {/*                            if (e.target.value !== '') {*/}
            {/*                                setFiltres(prevState => ({*/}
            {/*                                    ...prevState,*/}
            {/*                                    country: `&countries.name=${e.target.value}`*/}
            {/*                                }))*/}
            {/*                            }*/}
            {/*                            if (filtres.country !== '' && e.target.value === '') {*/}
            {/*                                // filtres.delete(Country)*/}
            {/*                                delete filtres.country*/}
            {/*                            }*/}
            {/*                        }}*/}
            {/*                    >*/}
            {/*                        <MenuItem value="">*/}
            {/*                            Все*/}
            {/*                        </MenuItem>*/}
            {/*                        {FilmCityConst.map((item, idx) => {*/}
            {/*                            return (*/}
            {/*                                <MenuItem key={idx} value={item}>{item}</MenuItem>*/}
            {/*                            )*/}
            {/*                        })}*/}
            {/*                    </Select>*/}
            {/*                </FormControl>*/}
            {/*                <FormControl variant="filled" sx={{m: 1, minWidth: 120}}>*/}
            {/*                    <InputLabel id="FilmYear">Год</InputLabel>*/}
            {/*                    <Select*/}
            {/*                        labelId="FilmYear"*/}
            {/*                        id="demo-simple-select-filled"*/}
            {/*                        value={filtres.year}*/}
            {/*                        onChange={(e) => {*/}
            {/*                            if (e.target.value !== '') {*/}
            {/*                                setFiltres(prevState => ({...prevState, year: `&year=${e.target.value}`}))*/}
            {/*                            }*/}
            {/*                            if (filtres.year !== '' && e.target.value === '') {*/}
            {/*                                delete filtres.year*/}
            {/*                            }*/}
            {/*                        }}*/}
            {/*                    >*/}
            {/*                        <MenuItem value="">*/}
            {/*                            Все*/}
            {/*                        </MenuItem>*/}
            {/*                        {filmYearConst.map((item, idx) => {*/}
            {/*                            return (*/}
            {/*                                <MenuItem key={idx} value={item}>{item}</MenuItem>*/}
            {/*                            )*/}
            {/*                        })}*/}
            {/*                    </Select>*/}
            {/*                </FormControl>*/}
            {/*                <input*/}
            {/*                    className={'FilterSearchBtn'}*/}
            {/*                    type="button"*/}
            {/*                    onClick={() => {*/}
            {/*                        // getFilmList(api_keys[whatApiKey])*/}
            {/*                        setOpen(false)*/}
            {/*                    }}*/}
            {/*                    value={'Показать'}*/}
            {/*                />*/}
            {/*            </div>*/}

            {/*        </div>*/}
            {/*    </Drawer>*/}
            {/*</div>*/}
            {/*<div className={'filtresDiv'}>*/}
            {/*    <ul className={'FilmTypeList'}>*/}
            {/*        <li*/}
            {/*            onClick={() => {*/}
            {/*                setFilmType('')*/}
            {/*            }}*/}
            {/*        >Все*/}
            {/*        </li>*/}
            {/*        {filmTypeConst.map((item, idx) => {*/}
            {/*            return (*/}
            {/*                <li key={idx} onClick={() => setFilmType(item.type)}>{item.text}</li>*/}
            {/*            )*/}
            {/*        })}*/}
            {/*    </ul>*/}
            {/*    <div className={'filtres'}>*/}
            {/*        <FormControl variant="filled" sx={{m: 1, minWidth: 120}}>*/}
            {/*            <InputLabel id="FilmGenres">Жанр</InputLabel>*/}
            {/*            <Select*/}
            {/*                labelId="FilmGenres"*/}
            {/*                id="demo-simple-select-filled"*/}
            {/*                value={filtres.genres}*/}
            {/*                onChange={(e) => {*/}
            {/*                    if (e.target.value !== '') {*/}
            {/*                        setFiltres(prevState => ({...prevState, genres: `&genres.name=${e.target.value}`}))*/}
            {/*                    }*/}
            {/*                    if (filtres.genres !== '' && e.target.value === '') {*/}
            {/*                        // filtres.delete(genres)*/}
            {/*                        delete filtres.genres*/}
            {/*                    }*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                <MenuItem value="">*/}
            {/*                    Все*/}
            {/*                </MenuItem>*/}
            {/*                {FilmGenresConst.map((item, idx) => {*/}
            {/*                    return (*/}
            {/*                        <MenuItem key={idx} value={item}>{item}</MenuItem>*/}
            {/*                    )*/}
            {/*                })}*/}
            {/*            </Select>*/}
            {/*        </FormControl>*/}
            {/*        <FormControl variant="filled" sx={{m: 1, minWidth: 120}}>*/}
            {/*            <InputLabel id="FilmCity">Страна</InputLabel>*/}
            {/*            <Select*/}
            {/*                labelId="FilmCity"*/}
            {/*                id="demo-simple-select-filled"*/}
            {/*                value={filtres.city}*/}
            {/*                onChange={(e) => {*/}
            {/*                    if (e.target.value !== '') {*/}
            {/*                        setFiltres(prevState => ({*/}
            {/*                            ...prevState,*/}
            {/*                            country: `&countries.name=${e.target.value}`*/}
            {/*                        }))*/}
            {/*                    }*/}
            {/*                    if (filtres.country !== '' && e.target.value === '') {*/}
            {/*                        // filtres.delete(Country)*/}
            {/*                        delete filtres.country*/}
            {/*                    }*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                <MenuItem value="">*/}
            {/*                    Все*/}
            {/*                </MenuItem>*/}
            {/*                {FilmCityConst.map((item, idx) => {*/}
            {/*                    return (*/}
            {/*                        <MenuItem key={idx} value={item}>{item}</MenuItem>*/}
            {/*                    )*/}
            {/*                })}*/}
            {/*            </Select>*/}
            {/*        </FormControl>*/}
            {/*        <FormControl variant="filled" sx={{m: 1, minWidth: 120}}>*/}
            {/*            <InputLabel id="FilmYear">Год</InputLabel>*/}
            {/*            <Select*/}
            {/*                labelId="FilmYear"*/}
            {/*                id="demo-simple-select-filled"*/}
            {/*                value={filtres.year}*/}
            {/*                onChange={(e) => {*/}
            {/*                    if (e.target.value !== '') {*/}
            {/*                        setFiltres(prevState => ({...prevState, year: `&year=${e.target.value}`}))*/}
            {/*                    }*/}
            {/*                    if (filtres.year !== '' && e.target.value === '') {*/}
            {/*                        delete filtres.year*/}
            {/*                    }*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                <MenuItem value="">*/}
            {/*                    Все*/}
            {/*                </MenuItem>*/}
            {/*                {filmYearConst.map((item, idx) => {*/}
            {/*                    return (*/}
            {/*                        <MenuItem key={idx} value={item}>{item}</MenuItem>*/}
            {/*                    )*/}
            {/*                })}*/}
            {/*            </Select>*/}
            {/*        </FormControl>*/}
            {/*        <input*/}
            {/*            className={'FilterSearchBtn'}*/}
            {/*            type="button"*/}
            {/*            onClick={() => {*/}
            {/*                getFilmList(api_keys[whatApiKey])*/}
            {/*            }}*/}
            {/*            value={'Показать'}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div>
                {isLoader ?
                    <div className={'LoadingFilmList'}>
                        <CircularProgress/>
                    </div>
                    :
                    <div className={'FilmsList'}>
                        {filmsList.map((item, idx) => {
                            return (
                                <Link
                                    to={`/${item.kinopoiskId}`}
                                    className={'FilmList-film'}
                                    key={idx}
                                >
                                    <div>
                                        <img className={'FilmPoster'} src={item.posterUrl ? item.posterUrl : noImg}
                                             alt=""/>
                                        <div className={'FilmsList-filmDescription'}>
                                            <h2 className={'filmsList-FilmTitle'}>{item.nameRu ? item.nameRu : item.nameEn}</h2>
                                            <div className={'genres'}>
                                                {item?.genres?.map((item, idx) => {
                                                    return (
                                                        <p key={idx}>{item?.genre}</p>
                                                    )
                                                })}
                                            </div>
                                            <p>{item?.year}</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                }
            </div>
            {loadMoreBtnVisible &&
                <div className={'loadMore'}>
                    <input
                        className={'LoadMoreBtn'}
                        type="button" value={'Назад'}
                        disabled={filmListPage === 1}
                        onClick={() => {
                            setFilmListPage(filmListPage - 1)
                        }}
                    />
                    <input
                        className={'LoadMoreBtn'}
                        type="button" value={'Вперед'}
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