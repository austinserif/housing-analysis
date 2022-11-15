const Axios = require('axios');
const mashConfigs = require('../../configs/mashvisor.config');
const services = require('./services');

const REQUIRED_MASH_ENV_VARS = ['MASH_BASE_URL', 'MASH_VERSION', 'MASH_API_KEY'];

/** 
 * Checks that the environment specifies all required
 * credential and version variables. Throws an error if
 * any are missing. NOTE: correctness or shape of variables
 * are not asserted here.
*/
function checkConfig () {
    const missingConfigs = [];
    REQUIRED_MASH_ENV_VARS.forEach((key) => {
        if (!mashConfigs[key]) {
            missingConfigs.push(key);
        }
    });

    if (missingConfigs.length) {
        throw new Error(`Mashvisor client cannot be used without ${(missingConfigs.length > 1) ? 'the following environment variables:' : 'setting'} ${missingConfigs.join(', ')}.`);
    }
}

/** 
 * TODO: look into  the dangers of handling path construction in `getFullUrl` below.
 * If it needs to be validated or sanitized, do it here. If it otherwise needs to be
 * handled differently, update the original func and delete this. 
 */
function isSanitized (relPath) {
    return true;
}

function getFullUrl (base, relPath = []) {
    if (relPath.length && isSanitized(relPath)) {
        return base + '/' + relPath.join('/');
    } else {
        return base;
    }
}

function serviceApiFactory (services, callback) {
    const api = {};
    const servicesArray = Object.entries(services);
    for (const service of servicesArray) {
        // if the service has any endpoints, convert them into
        // [key, value] using Object.entries()
        const [serviceKey, endpoints] = service;

        // initialize empty object for the current service key
        api[serviceKey] = {};
        const endpointsArray = Object.entries(endpoints);

        // `endpoint[1]` contains two mapping functions,
        // `path` and `params`, each of which transforms a single
        // key word argument into a value that can be accepted by
        // the client driver function.
        for (const endpoint of endpointsArray) {
            const [endpointKey, { path, params }] = endpoint;
            api[serviceKey][endpointKey] = async function (args) {
                return await callback(path(args), params(args));
            }
        }
    }
    return api;
}

module.exports = function MashClient () {
    // assert all the right env vars are present
    checkConfig();
    const { MASH_API_KEY, MASH_BASE_URL, MASH_VERSION } = mashConfigs;

    // build versioned api endpoint
    const baseUrl = `${MASH_BASE_URL}/${MASH_VERSION}/client`

    async function cDriver (relPath = [], params = {}) {
        // NOTE: this could be moved into the `AxioRequestConfig` body
        // using the `baseURL` and `url` keys in tandem.
        const url = getFullUrl(baseUrl, relPath);

        return await Axios({ 
            method: 'GET',
            url,
            headers: {
                'X-Api-Key': MASH_API_KEY
            },
            params
        })
    }

    return {
        ...serviceApiFactory(services, cDriver)
    }
}
