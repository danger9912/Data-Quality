const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3001;
const fs = require('fs/promises');
const path = require('path');
const xlsx = require('xlsx')
const generaldetailsRoutes = require('./routes/generalDetailsRoutes');
const omissionRoutes = require('./routes/omissionRoutes');
const domainconsistencyRoutes = require('./routes/domainConsistencyRoutes');
const formatConsistencyRoutes = require('./routes/formatConsistencyRoutes');
const comissionRoutes = require('./routes/comissionRoutes');
const temporalQualityRoutes = require('./routes/temporatQualityRoutes');
const accuracyRoutes = require('./routes/accuracyRoutes')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
require('dotenv').config();

app.use('/api/generaldetails', generaldetailsRoutes);
app.use('/api/omission', omissionRoutes);
app.use('/api/domainconsistency', domainconsistencyRoutes);
app.use('/api/format', formatConsistencyRoutes);
app.use('/api/comission', comissionRoutes);
app.use('/api/temporalquality', temporalQualityRoutes);
app.use('/api/accuracymeasurement', accuracyRoutes);



app.post('/api/fieldnames', async (req, res) => {
    try {
        console.log(req.body)
        const filename = req.body.filename;
        const filepath = path.join(__dirname, 'uploads', filename);
        const rawData = await fs.readFile(filepath);
        // console.log(rawData);
        const data = JSON.parse(rawData);
        
        res.send({ field_names: Object.keys(data[0]) });
    }
    catch (err) {
        console.error(err);
        throw new Error(err);
    }
});


app.get('/api/view/:name', async (req, res, next) => {
    try {
        const filename = req.params.name;
        console.log(filename);

        if (!filename) {
            return res.status(400).json({ error: 'Filename is required in the request body.' });
        }

        const filePath = path.join(__dirname, './uploads', filename);

        const data = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        res.status(200).json({ file_data: jsonData });
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
        next(error);
    }
});

app.get('/', (req, res) => {
    res.status(200).send("API works sccessfully");
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});


app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});