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
    const result = { outDomain: [], totalChecks: [],inDomain:[], domainConsistency: 0 };
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
        // let d = ;
        result.inDomain.push({[attribute]: checkMade - count });
        result.outDomain.push({ [attribute]: count });
        result.totalChecks.push({ [attribute]: checkMade });
    });

    const totalChecks = result.totalChecks.reduce((total, attributeCount) => total + Object.values(attributeCount)[0], 0);
    const inconsistentChecks = result.outDomain.reduce((total, attributeCount) => total + Object.values(attributeCount)[0], 0);
    // const consistentChecks = result.inDomain.reduce((total, attributeCount) => total + Object.values(attributeCount)[0], 0);
    const domainConsistency = (inconsistentChecks / totalChecks) * 100;
    // result.correct_domain = (totalChecks - inconsistentChecks);
    result.domainConsistency = parseFloat(domainConsistency).toFixed(2);
    console.log(data);
    console.log(result);
    return result;
};

module.exports = calculateDomain;
