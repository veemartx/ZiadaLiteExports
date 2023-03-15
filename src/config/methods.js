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