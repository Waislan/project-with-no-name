import express from 'express';

export default class App {
    constructor(db, routes = []) {
        this.db = db;
        this.routes = routes;
        this.express = express();
    }

    async setup() {
        this.express.use(express.json());
        this.registerRoutes();  
    }

    registerRoutes() {
        this.routes.forEach((register) => register(this.express, this.db));
    }

    getInstance() {
        return this.express;
    }
}
