'use strict';

const express = require('express');
const router = express.Router();

let dsus = {};
let dsuId = 0;
let sites = {};
let siteId = 0;

/**
* Route to add a new DSU.
* @name PUT /v1/api/dsus
* @function
* @param {String} name - The name of the DSU to add. Max 10 characters.
* @param {String} description - The description of the DSU. Max 20 characters.
* @param {Number} [cert] - The operations cert for the DSU. If provided, must be >= 0.
*/
router.put('/dsus', (req, res) => {
    let data = req.body;

    if (!data.name || Object.prototype.toString.call(data.name) !== '[object String]' || (data.name.length && data.name.length > 10)) {
        res.status(400).send('Missing or invalid DSU name');
        return;
    }

    if (!data.description || Object.prototype.toString.call(data.description) !== '[object String]' || (data.description.length && data.description.length > 20)) {
        res.status(400).send('Missing or invalid DSU description');
        return;
    }

    if (data.cert && (Number.isNaN(Number(data.cert)) || Number(data.cert)) < 0) {
        res.status(400).send('Operations Cert must be greater than 0');
        return;
    }

    for (let i in dsus) {
        if (data.name.toLowerCase() === dsus[i].name.toLowerCase()) {
            res.status(400).send('DSU name already exists');
            return;
        }
    }

    let dsu = {
        id: dsuId,
        name: data.name,
        description: data.description,
        cert: data.cert || 0
    };

    dsus[dsuId++] = dsu;

    res.status(201).send(dsu);

});


/**
* Route to get all DSU's
* @name GET /v1/api/dsus
* @function
*/
router.get('/dsus', (req, res) => {

    res.status(200).send(dsus);

});

/**
* Route to add a new site.
* @name PUT /v1/api/sites
* @function
* @param {Number} dsuId - The id of the DSU that the site is attached to.
* @param {String} name - The name of the site. Max 10 characters.
* @param {String} description - The description of the site. Max 20 characters.
*/
router.put('/sites', (req, res) => {
    let data = req.body;

    if (Number.isNaN(data.dsuId) || !dsus[data.dsuId]) {
        res.status(400).send('Missing or invalid DSU id');
        return;
    }

    if (!data.name || Object.prototype.toString.call(data.name) !== '[object String]' || (data.name.length && data.name.length > 10)) {
        res.status(400).send('Missing or invalid site name');
        return;
    }

    if (!data.description || Object.prototype.toString.call(data.description) !== '[object String]' || (data.description.length && data.description.length > 20)) {
        res.status(400).send('Missing or invalid site description');
        return;
    }

    for (let i in sites) {

        if (data.name.toLowerCase() === sites[i].name.toLowerCase() && data.dsuId === sites[i].dsuId) {
            res.status(400).send('Site already exists in that DSU');
            return;
        } else if (data.name.toLowerCase() === sites[i].name.toLowerCase() && data.dsuId !== sites[i].dsuId) {
            sites[i].dsuId = data.dsuId;
            res.status(201).send(sites[i]);
            return;
        }
    }

    let site = {
        id: siteId,
        name: data.name,
        description: data.description,
        dsuId: data.dsuId
    };

    sites[siteId++] = site;

    res.status(201).send(site);

});

/**
* Route to get all sites
* @name GET /v1/api/sites
* @function
*/
router.get('/sites', (req, res) => {
    res.status(200).send(sites);
});

module.exports = router;
