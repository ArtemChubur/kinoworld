import React from 'react';
import {Route, Routes} from "react-router-dom";
import {Main} from "../Pages/Main/Main";
import FilmPage from "../Pages/FilmPage/FilmPage";

const RoutesComponent = () => {
    return(
        <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/:id' element={<FilmPage />} />
        </Routes>
    )
}

export default RoutesComponent