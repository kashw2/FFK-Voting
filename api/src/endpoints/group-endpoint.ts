import {AuthenticatedCrudEndpoint} from "@kashw2/lib-server";
import {Database} from "../db/database";
import {Group, GroupJsonSerializer, User} from "@kashw2/lib-ts";
import {Request, Response} from "express";
import {Either} from "funfix";
import {ApiUtils, EitherUtils} from "@kashw2/lib-util";

export class GroupEndpoint extends AuthenticatedCrudEndpoint {

    constructor(private db: Database) {
        super('/group');
    }

    create(req: Request): Promise<Either<string, any>> {
        return EitherUtils.sequence(this.validate(req)
            .map(g => {
                this.db.cache.groups.add(g);
                return this.db.procedures.insert.insertGroup(g)(this.getModifiedBy(req));
            }))
            .then(v => v.map(u => GroupJsonSerializer.instance.toJsonImpl(u)));
    }

    delete(req: Request): Promise<Either<string, any>> {
        return EitherUtils.sequence(this.getGroupId(req)
            .map(gid => this.db.procedures.delete.deleteGroup(gid)))
            .then(v => v.map(u => GroupJsonSerializer.instance.toJsonImpl(u)));
    }

    doesRequireAuthentication(req: Request): boolean {
        return true;
    }

    private getGroup(req: Request): Either<string, Group> {
        return ApiUtils.parseBodyParamSerialized(req, 'group', GroupJsonSerializer.instance);
    }

    private getGroupId(req: Request): Either<string, string> {
        return ApiUtils.parseStringQueryParam(req, 'group_id');
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

    read(req: Request): Promise<Either<string, any>> {
        if (this.getGroupId(req).isLeft()) {
            return Promise.resolve(EitherUtils.liftEither(GroupJsonSerializer.instance.toJsonArray(this.db.cache.groups.getGroups().toArray()), "Groups cache is empty"));
        }
        return Promise.resolve(this.getGroupId(req)
            .flatMap(gid => this.db.cache.groups.getGroupsById(gid)))
            .then(v => v.map(x => GroupJsonSerializer.instance.toJsonImpl(x)));
    }

    update(req: Request): Promise<Either<string, any>> {
        return EitherUtils.sequence(this.validate(req)
            .map(g => this.db.procedures.update.updateGroup(g)(this.getModifiedBy(req))))
            .then(v => v.map(x => GroupJsonSerializer.instance.toJsonImpl(x)));
    }

    private validate(req: Request): Either<string, Group> {
        switch (this.getHTTPMethod(req)) {
            case 'POST':
                return this.getGroup(req)
                    .filterOrElse(g => g.getLabel().nonEmpty(), () => 'Group must have a label');
            case 'PUT':
                return this.getGroup(req)
                    .filterOrElse(g => g.getId().nonEmpty(), () => 'Group must have an Id');
            default:
                return this.getGroup(req);
        }
    }

}
