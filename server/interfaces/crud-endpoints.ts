import {RequestHandler, RequestParamHandler} from "express";

export interface CrudEndpoints<T> {
    create?: RequestHandler<T>;
    read?:RequestHandler<T>;
    update?: RequestHandler<Partial<T>>;
    destroy?: RequestHandler<T>;
}