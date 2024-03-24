const filmYearConst = []

const date = new Date();
const year = date.getFullYear();

for (let i = 2000; i <= year; i++){
    filmYearConst.push(i)
}

export {filmYearConst}