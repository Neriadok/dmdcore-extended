import express, {Express, RequestHandler} from "express";
import path from "path";
import http from "http";
import {AddressInfo} from "net";
import {sync} from "glob";
import {CrudEndpoints} from "./interfaces/crud-endpoints";
import i18next from "i18next";

export const app = runExpressApp();
export default app;

function runExpressApp(): Express {
    const app = express();
    initI18next();
    serveStaticFiles(app);
    serveApp(app);
    serveApi(app);
    choosePort(app, parseInt(process.env.PORT) || 80);
    return app;
}

function initI18next(){
    i18next.init({
        fallbackLng: 'en',
        ns: ['en', 'es'],
        defaultNS: 'en',
        debug: true
    });
    i18next.addResourceBundle('en', 'en', require('../client/src/translations/en'), true, true);
    i18next.addResourceBundle('es', 'es', require('../client/src/translations/es'), true, true);

}

function serveApp(app: Express) {
    app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, '../client/build/index.html')));
}

function serveApi(app: Express) {
    app.use(express.json());
    const routePath = path.resolve(__dirname, 'endpoints').replace(/\\/gi, '/');
    const endpoints = sync(path.resolve(routePath, '**/*.ts').replace(/\\/gi, '/'));
    endpoints.forEach((endpoint) => useEndpoint(app, routePath, endpoint));
}

function useEndpoint(app: Express, routePath: string, endpoint: string) {
    const route = '/api' + endpoint.replace(routePath, '').replace(/\.ts$/, '');
    const {create, read, update, destroy}: CrudEndpoints<any> = require(endpoint)?.default || {};
    if (create) {
        app.post(route, handleEndpoint(create));
        console.log(`POST -> ${route} `);
    }
    if (read) {
        app.get(route, handleEndpoint(read));
        console.log(`GET -> ${route}`);
    }
    if (update) {
        app.patch(route, handleEndpoint(update));
        console.log(`PATCH -> ${route}`);
    }
    if (destroy) {
        app.delete(route, handleEndpoint(destroy));
        console.log(`DELETE -> ${route}`);
    }
}

 function handleEndpoint(handler: RequestHandler<any>): RequestHandler<any> {
    return async (req, res, ...args) => {
        try{
            await handler(req, res, ...args);
        } catch (e){
            const status = {
                SequelizeUniqueConstraintError: 409,
                SequelizeForeignKeyConstraintError: 409,
                SequelizeExclusionConstraintError: 409,
                SequelizeTimeoutError: 408,
                SequelizeConnectionTimedOutError: 408,
                SequelizeValidationError: 400,
                SequelizeValidationErrorItem: 400
                
            }[e?.name];
            res.status(status || 500).send(e)
        }
    }
}

function serveStaticFiles(app: Express) {
    app.use(express.static(path.join(__dirname, '../client/build')));

}

function choosePort(app: Express, PORT: string | number) {
    if (PORT) {
        app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
    } else {
        let server = http.createServer(app);
        server.listen(0, () => logServerPort(server.address()));
    }

}

function logServerPort(address: AddressInfo | string | number | null) {
    if (typeof address === "string" || typeof address === "number") {
        console.log(`Server listening on "${address}"`)
    } else {
        console.log(`Server listening on "${address?.port}"`)
    }
}

function initializeApp() {
    throw new Error("Function not implemented.");
}
