import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { axiosInstanceKinopoisk } from "../../APIS/api/api";
import './DetailInfoFilm.css'

function DetailInfoFilm() {
    const { id } = useParams();
    const api_keys = ['SD3MWNV-82PMJEM-PD7NGSV-F0V9YFX', 'XPXMBKB-6Z740AK-JNF897G-BVXZKBM', 'R89TYM0-4GAMXYJ-HBRVH4F-3XHY5B4', 'SH03P8B-PTZ4NQ1-QZD1TFX-G7965BT', 'Q76DWP0-CM5MXAJ-P2JZSR5-KY2H9AY'];
    const [whatApiKey, setWhatApiKey] = useState(0);
    const [filmInfo, setFilmInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const test = [{name: 'sssr'}, {name: 'sssr'}, {name: 'sssr'}, {name: 'sssr'}, {name: 'sssr'}, {name: 'sssr'}, {name: 'sssr'},]

    async function getFilmInfo(api_key) {
        try {
            const response = await axiosInstanceKinopoisk.get(`/movie/${id}?token=${'SH03P8B-PTZ4NQ1-QZD1TFX-G7965BT'}`);
            setFilmInfo(response.data);
            console.log(response.data);
        } catch (e) {
            console.log(e);
            if (e.request.status === 403) {
                switchApiKey();
            }
        } finally {
            setIsLoading(false)
        }
    }

    function switchApiKey() {
        setWhatApiKey(prevKey => (prevKey + 1) % api_keys.length);
    }

    useEffect(() => {
        getFilmInfo(api_keys[whatApiKey]);
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <section className={'DetailInfoSection'}>
                <img src={filmInfo?.poster.previewUrl} alt=""/>
                <div className={'InfoFilm-DetailInfo'}>
                    <h1>{filmInfo?.name}</h1>
                    <div className={'FilmGenres-detailInfo'}>
                        {filmInfo?.genres.map((item, idx) => {
                            return (<div>{item.name}</div>)
                        })}
                    </div>
                    <div className={'FilmCountry-detailInfo'}>
                        {filmInfo.countries.map((item, idx) => {
                            return (<span>{item.name}</span>)
                        })}
                    </div>
                    <p>{filmInfo?.description}</p>
                </div>
        </section>
    );
}

export default DetailInfoFilm;
