import {AuthenticatedCrudEndpoint} from "@kashw2/lib-server";
import {Permission, PermissionJsonSerializer, User} from "@kashw2/lib-ts";
import {Request, Response} from "express";
import {Either} from "funfix";
import {ApiUtils, EitherUtils} from "@kashw2/lib-util";
import {Database} from "../db/database";

export class PermissionsEndpoint extends AuthenticatedCrudEndpoint {

    constructor(private db: Database) {
        super('/permission');
    }

    create(req: Request): Promise<Either<string, any>> {
        return EitherUtils.sequence(this.validate(req)
            .map(p => {
                this.db.cache.permissions.add(p);
                return this.db.procedures.insert.insertPermission(p)(this.getModifiedBy(req));
            }))
            .then(v => v.map(u => PermissionJsonSerializer.instance.toJsonImpl(u)));
    }

    delete(req: Request): Promise<Either<string, any>> {
        return EitherUtils.sequence(this.getPermissionId(req)
            .map(pid => this.db.procedures.delete.deletePermission(pid)))
            .then(v => v.map(x => PermissionJsonSerializer.instance.toJsonImpl(x)));
    }

    doesRequireAuthentication(req: Request): boolean {
        return true;
    }

    private getPermission(req: Request): Either<string, Permission> {
        return ApiUtils.parseBodyParamSerialized(req, 'permission', PermissionJsonSerializer.instance);
    }

    private getPermissionId(req: Request): Either<string, string> {
        return ApiUtils.parseStringQueryParam(req, 'permission_id');
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
        if (this.getPermissionId(req).isLeft()) {
            return Promise.resolve(EitherUtils.liftEither(PermissionJsonSerializer.instance.toJsonArray(this.db.cache.permissions.getPermissions().toArray()), "Permission cache is empty"));
        }
        return Promise.resolve(this.getPermissionId(req)
            .flatMap(pid => this.db.cache.permissions.getByPermissionId(pid)))
            .then(v => v.map(x => PermissionJsonSerializer.instance.toJsonImpl(x)));
    }

    update(req: Request): Promise<Either<string, any>> {
        return EitherUtils.sequence(this.validate(req)
            .map(p => this.db.procedures.update.updatePermission(p)(this.getModifiedBy(req))))
            .then(v => v.map(x => PermissionJsonSerializer.instance.toJsonImpl(x)));
    }

    private validate(req: Request): Either<string, Permission> {
        switch (this.getHTTPMethod(req)) {
            case 'POST':
                return this.getPermission(req)
                    .filterOrElse(p => p.getLabel().nonEmpty(), () => 'Permission must have a label');
            case 'PUT':
                return this.getPermission(req)
                    .filterOrElse(p => p.getId().nonEmpty(), () => 'Permission must have an Id');
            default:
                return this.getPermission(req);
        }
    }

}
