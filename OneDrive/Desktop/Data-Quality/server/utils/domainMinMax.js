const domainMinMax = (jsonArray, attribute, datatype) => {

    const valuesToCount = [
        "null",
        "NA",
        "-",
        ".",
        "Not Applicable",
        "NULL",
        "blank",
        "N/A",
        "N.A.",
        "Not Available",
        "Not Provided",
        "$",
        "`",
        "~",
        "!",
        "@",
        "#",
        "%",
        "^",
        "&",
        "*",
        "(",
        ")",
        "_",
        "+","=",
        "/",
        "<",
        ">",
        "?"
      ];

    switch (datatype) {
        case 'integer': {
            let flag = 0;
            let min = Number.MAX_SAFE_INTEGER;
            let max = Number.MIN_SAFE_INTEGER;

            for (let i = 0; i < jsonArray.length; i++) {
                const value = jsonArray[i][attribute];

                if (typeof value === 'number' && Number.isInteger(value)) {
                    flag = 1;
                    if (value < min) {
                        min = value;
                    }
                    if (value > max) {
                        max = value;
                    }
                }
            }

            if (flag === 0) {
                return { min: '***', max: '***' };
            }

            return { min, max };
        }

        case 'decimal': {
            let flag = 0;
            let min = Number.MAX_VALUE;
            let max = Number.MIN_VALUE;

            for (let i = 0; i < jsonArray.length; i++) {
                const value = jsonArray[i][attribute];

                if (typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value) && value % 1 !== 0 && value.toString().includes('.')) {
                    flag = 1;
                    if (value < min) {
                        min = value;
                    }
                    if (value > max) {
                        max = value;
                    }
                }
            }

            if (flag === 0) {
                return { min: '***', max: '***' };
            }

            return { min, max };
        }

        case 'string': {
            let flag = 0;
            let minLength = Infinity;
            let maxLength = -Infinity;

            for (let i = 0; i < jsonArray.length; i++) {
                const value = jsonArray[i][attribute];

                if (typeof value === 'string' && !valuesToCount.includes(value)) {
                    flag = 1;
                    const length = value.length;
                    if (length < minLength) {
                        minLength = length;
                    }
                    if (length > maxLength) {
                        maxLength = length;
                    }
                }
            }

            if (flag === 0) {
                return { min: '***', max: '***' };
            }

            return { min: minLength, max: maxLength };
        }

        case 'list': {
            let uniqueStrings = []

            for (let i = 0; i < jsonArray.length; i++) {
                const value = jsonArray[i][attribute];
                if (typeof value === 'string' && !valuesToCount.includes(value) && !uniqueStrings.includes(value)) {
                    uniqueStrings.push(value);
                }
            }

            return uniqueStrings;
        }

        default: {
            return { error: "Unsupported datatype." };
        }

        }

    }


module.exports = domainMinMax;
