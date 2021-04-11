import {CrudEndpoint} from "@kashw2/lib-server";
import {User, UserJsonSerializer} from "@kashw2/lib-ts";
import {Request, Response} from "express";
import {ApiUtils, EitherUtils} from "@kashw2/lib-util";
import {Either, Right} from "funfix-core";
import {Database} from "../db/database";

export class UserEndpoint extends CrudEndpoint {

    constructor(private db: Database) {
        super('/user');
    }

    async create(req: Request): Promise<Either<string, any>> {
        return EitherUtils.sequence(this.getUser(req)
            .map(u => this.db.procedures.insert.insertUser(u)(this.getRequestUsername(req))))
    }

    async delete(req: Request): Promise<Either<string, any>> {
        return EitherUtils.sequence(this.getUserId(req)
            .map(uid => this.db.procedures.delete.deleteUser(uid)));
    }

    private getUser(req: Request): Either<string, User> {
        return ApiUtils.parseBodyParamSerialized(req, 'user', UserJsonSerializer.instance);
    }

    private getUserId(req: Request): Either<string, string> {
        return ApiUtils.parseStringQueryParam(req, 'user_id');
    }

    hasPermission(req: Request, res: Response, user: User): boolean {
        switch (this.getHTTPMethod(req)) {
            case 'POST':
                return true;
            case 'GET':
                return true;
            case 'PUT':
                return true;
            case 'DELETE':
                return true;
            default:
                return false;
        }
    }

    async read(req: Request): Promise<Either<string, any>> {
        if (this.shouldReadCurrentUser(req)) {
            return Right(req.user);
        }
        // TODO: I don't like this, i think some utility functions could make it look better
        // Maybe in the future we should parse the serializer into the method that sends the result or something like that.
        return EitherUtils.sequence(this.getUserId(req)
                .map(uid => this.db.procedures.read.readUserByDiscordId(uid)))
            .then(v => v.map(u => UserJsonSerializer.instance.toJsonImpl(u)))
    }

    private shouldReadCurrentUser(req: Request): boolean {
        return ApiUtils.parseBooleanQueryParam(req, 'current_user')
            .getOrElse(false);
    }

    async update(req: Request): Promise<Either<string, any>> {
        return super.update(req);
    }

}
