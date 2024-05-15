const isDecimal = (num) => {
    // Check if the number is a finite number and it contains a decimal point
    return typeof num === 'number' && Number.isFinite(num) && num.toString().includes('.');
};

const nullValue = [
    "null", "NA", "-", ".", "Not Applicable", "NULL", "blank", "N/A", "N.A.",
    "Not Available", "Not Provided", "$", "`", "~", "!", "@", "#", "%", "^",
    "&", "*", "(", ")", "_", "+", "=", "/", "<", ">", "?"
];

const calculateDomain = (rules, data) => {
    rules.forEach((rule) => {
        const { attribute, datatype, values } = rule;
        let count = 0;
        let checkMade = 0;
        data.forEach((obj) => {
            const value = obj[attribute];
            if (!nullValue.includes(value)) {
                checkMade++;
                switch (datatype) {
                    case 'integer':
                        if (typeof value === "number" && value >= parseInt(values.min) && value <= parseInt(values.max) && !value.toString().includes('.')) {

                        } else {
                            count++;
                            if (!obj.hasOwnProperty('domainErrors')) {
                                obj.domainErrors = [];
                            }
                            obj.domainErrors.push(attribute);
                        }
                        break;

                    case 'decimal':
                        if (isDecimal(value) && value >= parseFloat(values.min) && value <= parseFloat(values.max)) {

                        } else {
                            count++;
                            if (!obj.hasOwnProperty('domainErrors')) {
                                obj.domainErrors = [];
                            }
                            obj.domainErrors.push(attribute);
                        }
                        break;

                    case 'list':
                        if (values.includes(value)) {

                        } else {
                            count++;
                            if (!obj.hasOwnProperty('domainErrors')) {
                                obj.domainErrors = [];
                            }
                            obj.domainErrors.push(attribute);
                        }
                        break;
                    case 'boolean':
                        if (values.includes(value)) {

                        } else {
                            count++;
                            if (!obj.hasOwnProperty('domainErrors')) {
                                obj.domainErrors = [];
                            }
                            obj.domainErrors.push(attribute);
                        }
                        break;
                    case 'string':
                        if (typeof value === 'string' && value.length >= parseInt(values.min, 10) && value.length <= parseInt(values.max, 10)) {

                        } else {
                            count++;
                            if (!obj.hasOwnProperty('domainErrors')) {
                                obj.domainErrors = [];
                            }
                            obj.domainErrors.push(attribute);
                        }
                        break;
                }
            }
        });
    });

    console.log(data);
    return data;
};

module.exports = calculateDomain;
