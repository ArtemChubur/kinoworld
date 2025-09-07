const filmYearConst = []

const date = new Date();
const year = date.getFullYear();

for (let i = year; i >= 2000; i--){
    filmYearConst.push(i)
}

export {filmYearConst}