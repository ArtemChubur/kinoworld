import axios from "axios";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import './player.css'
import {CircularProgress} from "@mui/material";
import {axiosInstanceKinobox} from "../../APIS/api/api";
// import 'video-react/dist/video-react.css';

function Player() {
    const {id} = useParams()
    const [film, setFilm] = useState([]);
    const [playerNum, setPlayerNum] = useState(1)
    const [isLoader, setIsLoader] = useState(false);

    async function getFilm() {
        setIsLoader(true)
        try {
            const response = await axiosInstanceKinobox.get(`/players?query=${id}`)
            setFilm(response.data)
            console.log(response.data)
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoader(false)
        }
    }

    useEffect(() => {
        getFilm()
    }, []);

    return (
        <div className="">
            <div className={'player'}>
                {isLoader ?
                    <div className={'LoadPlayer'}>
                        <CircularProgress />
                    </div>
                    :
                    <div>
                        <div className={'WhatPlayerBtns'}>
                            <ul className={'playersNums'}>
                                {film.map((item ,idx) => {
                                    return(
                                        <li key={idx} className={'whatPlayer'}>
                                            <input className={'whatPlayerButton'} type={"button"} onClick={() => {setPlayerNum(idx + 1)}} value={`Плеер ${idx + 1}`} />
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        {film.map((item, idx) => {
                            return (
                                <div className={idx + 1 !== playerNum ? 'hidePlayer' : 'visiblePlayer'}>
                                    <iframe
                                        key={idx} allowFullScreen="true"
                                        webkitallowfullscreen="true"
                                        mozallowfullscreen="true"
                                        src={item.iframeUrl}
                                        className={'PlayerVideo'}
                                    />
                                </div>
                            )
                        })}
                    </div>
                }
                {film.length === 0 && <p className={'PlayerError'}>Не удалось найти плеер</p>}
            </div>

        </div>
    );
}

export default Player;
