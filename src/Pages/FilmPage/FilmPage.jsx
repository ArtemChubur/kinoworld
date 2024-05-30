import React from 'react';
import Player from "../../components/player/Player";
import DetailInfoFilm from "../../elements/DetailInfoFilm/DetailInfoFilm";
import './FilmPage.css'

function FilmPage(props) {
    return (
        <div>
            <DetailInfoFilm />
            <section className={'FilmPage-playerSection'}>
                <div className={'FilmPage-player'}>
                    <Player/>
                </div>
            </section>
        </div>
    );
}

export default FilmPage;