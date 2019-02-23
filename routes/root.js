'use strict';

const sUtil = require('../lib/util');
const swaggerUi = require('../lib/swagger-ui');
const spawn = require('child_process').spawn;

/**
 * The main router object
 */
const router = sUtil.router();

/**
 * The main application object reported when this module is require()d
 */
let app;

/**
 * GET /robots.txt
 * Instructs robots no indexing should occur on this domain.
 */
router.get('/robots.txt', (req, res) => {

    res.set({
        'User-Agent': '*',
        Disallow: '/'
    }).end();

});

/**
 * GET /
 * Main entry point. Currently it only responds if the spec or doc query
 * parameter is given, otherwise lets the next middleware handle it
 */
router.get('/', (req, res, next) => {

    if ({}.hasOwnProperty.call(req.query || {}, 'spec')) {
        res.json(app.conf.spec);
    } else if ({}.hasOwnProperty.call(req.query || {}, 'doc')) {
        return swaggerUi.processRequest(app, req, res);
    } else {
        next();
    }

});

/**
 * GET /ri-diff-fixture-updater/
 * Special entrypoint for ri-diffbot
 */
router.get('/ri-diff-fixture-updater/', (req, res, next) => {

    const diffProcess = spawn(`git reset --hard origin/master \
&& git pull
&& rm -rf node_modules
&& npm install \
&& export DIFF_UPDATE=true \
&& npm run test:diff \
&& git commit -a -m "Hygiene: Update diff fixtures \
&& git review -Ry`);

    diffProcess.stdout.on('data', (data) => {
        res.write(data);
        req.logger.log('info', data.toString());
    });

    diffProcess.stderr.on('data', (data) => {
        res.write(data);
        req.logger.log('error', data.toString());
    });

    diffProcess.on('exit', (code) => {
        req.logger.log('exit: child process exited with code ' + code.toString());
    });

    diffProcess.on('close', (code) => {
        req.logger.log('close: child process exited with code ' + code.toString());
    });
});

module.exports = (appObj) => {

    app = appObj;

    return {
        path: '/',
        skip_domain: true,
        router
    };

};
