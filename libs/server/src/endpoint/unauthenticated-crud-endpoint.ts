import {Request, Response, Router} from "express";
import {ApiUtils} from "@kashw2/lib-util";
import {Either} from "funfix";
import {UnauthenticatedEndpoint} from "./unauthenticated-endpoint";

export abstract class UnauthenticatedCrudEndpoint extends UnauthenticatedEndpoint {

    constructor(readonly endpoint: string) {
        super(endpoint);
    }

    /**
     * Provides functionality for Creation of data
     */
    async create(req: Request): Promise<Either<string, any>> {
        return Promise.reject(`${this.getHTTPMethod(req)} Not Implemented for ${this.getEndpoint()}`);
    }

    /**
     * Provides functionality for Deletion of data
     */
    async delete(req: Request): Promise<Either<string, any>> {
        return Promise.reject(`${this.getHTTPMethod(req)} Not Implemented for ${this.getEndpoint()}`);
    }

    /**
     * Mounts all the methods for Crud to be achievable
     */
    mount(router: Router): void {
        // C - Create
        router.post(this.getEndpoint(), (req: Request, res: Response) => {
            this.runImpl(req, res);
        });
        // R - Read
        router.get(this.getEndpoint(), (req: Request, res: Response) => {
            this.runImpl(req, res);
        });
        // U - Update
        router.put(this.getEndpoint(), (req: Request, res: Response) => {
            this.runImpl(req, res);
        });
        // D - Delete
        router.delete(this.getEndpoint(), (req: Request, res: Response) => {
            this.runImpl(req, res);
        });
    }

    /**
     * Provides functionality for Reading/Retrieval of data
     */
    async read(req: Request): Promise<Either<string, any>> {
        return Promise.reject(`${this.getHTTPMethod(req)} Not Implemented for ${this.getEndpoint()}`);
    }

    runImpl(req: Request, res: Response): void {
        try {
            switch (this.getHTTPMethod(req)) {
                case 'POST':
                    this.create(req)
                        .then(x => x.fold((error) => ApiUtils.sendError(res, error, 500), (v) => res.send(v)))
                        .catch(err => ApiUtils.sendError(res, err, 500));
                    break;
                case 'GET':
                    this.read(req)
                        .then(x => x.fold((error) => ApiUtils.sendError(res, error, 500), (v) => res.send(v)))
                        .catch(err => ApiUtils.sendError(res, err, 500));
                    break;
                case 'PUT':
                    this.update(req)
                        .then(x => x.fold((error) => ApiUtils.sendError(res, error, 500), (v) => res.send(v)))
                        .catch(err => ApiUtils.sendError(res, err, 500));
                    break;
                case 'DELETE':
                    this.delete(req)
                        .then(x => x.fold((error) => ApiUtils.sendError(res, error, 500), (v) => res.send(v)))
                        .catch(err => ApiUtils.sendError(res, err, 500));
                    break;
                default:
                    return ApiUtils.send505(res);
            }
        } catch (error) {
            console.error(error);
            return ApiUtils.send500(res);
        }
    }

    /**
     * Provides functionality for Updating of data
     */
    async update(req: Request): Promise<Either<string, any>> {
        return Promise.reject(`${this.getHTTPMethod(req)} Not Implemented for ${this.getEndpoint()}`);
    }

}