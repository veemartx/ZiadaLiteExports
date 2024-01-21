import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)


export const addCommas = (number, dp) => {
    return number.toLocaleString("en-US", {
        minimumFractionDigits: dp,
        maximumFractionDigits: dp,
    });
}



export const numberFormat = (number, options) => {

    let precision = 0;

    if (options.type == 'number' && options.notation == 'compact') {

        if (number > 1000) {
            precision = 2;
        }
    }



    if (options.type == 'currency') {
        precision = 2;
    }

    const formatter = Intl.NumberFormat('en-GB', {
        notation: options.notation,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
    });

    let n = formatter.format(number);

    return n;
}

export const formatDate = (d) => {

    // if date includes time
    if (d.length > 12) {
        return dayjs(d).format("MMM DD 'YY H:m:s");

    } else {
        return dayjs(d).format("MMM DD 'YY");

    }
}


export const  capitalize = (str) => {
    return str.split(' ').map((s) => s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase()).join(' ');
}

export const arraySum = (arr) => {
    return arr.reduce((a, b) => a + b, 0)
}
