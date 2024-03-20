import React from 'react';
import Player from "../../components/player/Player";
import DetailInfoFilm from "../../elements/DetailInfoFilm/DetailInfoFilm";

function FilmPage(props) {
    return (
        <div>
            <DetailInfoFilm />
            <Player />
        </div>
    );
}

export default FilmPage;