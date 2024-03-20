import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {axiosInstanceKinopoisk} from "../../APIS/api/api";

function DetailInfoFilm(props) {
    const {id} = useParams()
    const api_key = 'XPXMBKB-6Z740AK-JNF897G-BVXZKBM'

    const [FilmInfo, setFilmInfo] = useState();
    useEffect(() => {
        getFilmInfo()
    }, []);

    async function getFilmInfo() {
        const response = await axiosInstanceKinopoisk.get(`/movie/${id}?token=${api_key}`)
        setFilmInfo(response.data)
        console.log(response)
    }

    return (
        <section>

        </section>
    );
}

export default DetailInfoFilm;