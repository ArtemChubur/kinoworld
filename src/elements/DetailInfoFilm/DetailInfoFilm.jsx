import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { axiosInstanceKinopoisk } from "../../APIS/api/api";
import './DetailInfoFilm.css'
import { CircularProgress } from "@mui/material";

function DetailInfoFilm() {
    const { id } = useParams();
    const api_keys = ['SD3MWNV-82PMJEM-PD7NGSV-F0V9YFX', 'XPXMBKB-6Z740AK-JNF897G-BVXZKBM', 'R89TYM0-4GAMXYJ-HBRVH4F-3XHY5B4', 'SH03P8B-PTZ4NQ1-QZD1TFX-G7965BT', 'Q76DWP0-CM5MXAJ-P2JZSR5-KY2H9AY'];
    const [whatApiKey, setWhatApiKey] = useState(0);
    const [filmInfo, setFilmInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function getFilmInfo(api_key) {
        try {
            const response = await axiosInstanceKinopoisk.get(`movie/${id}?token=${api_key}`);
            setFilmInfo(response.data);
            console.log(response.data);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
            if (e.request.status === 403) {
                getNewKey();
            }
        }
    }

    function getNewKey() {
        setWhatApiKey(prevKey => (prevKey + 1) % api_keys.length);
    }

    const fetchData = async () => {
        await getFilmInfo(api_keys[whatApiKey]);
    };

    useEffect(() => {
        fetchData();
    }, [whatApiKey]);

    return (
        <section>
            {isLoading ?
                <div><CircularProgress /></div>
                :
                <div className={'DetailInfoSection'}>
                    <img src={filmInfo.poster.previewUrl} alt="" />
                    <div className={'InfoFilm-DetailInfo'}>
                        <h1>{filmInfo?.name}</h1>
                        <div className={'FilmGenres-detailInfo'}>
                            {filmInfo?.genres.map((item, idx) => {
                                return (<div key={idx}>{item.name}</div>)
                            })}
                        </div>
                        <div className={'FilmCountry-detailInfo'}>
                            {filmInfo.countries.map((item, idx) => {
                                return (<span key={idx}>{item.name}</span>)
                            })}
                        </div>
                        <p>{filmInfo?.description}</p>
                    </div>
                </div>
            }
        </section>
    );
}

export default DetailInfoFilm;
