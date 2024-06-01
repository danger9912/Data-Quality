const temporalValidity = (attributes, data) => {
    const result = {};
    attributes.forEach(attr => {
        result[attr] = 0;
    });

    data.forEach(entry => {
        attributes.forEach(attr => {
            const date = entry[attr];
            if (!isValidDate(date)) {
                result[attr]++;
            }
        });
    });
    return result;
};

const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    
    return regex.test(dateString);
};

module.exports = temporalValidity;
