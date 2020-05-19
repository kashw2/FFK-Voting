import {Request, Response} from "express";
import {Either} from "funfix-core";
import {List} from "immutable";
import {ApiUtils} from "../../../../core/src";
import {Comment, CommentJsonSerializer} from "../../../../core/src/models/comment";
import {GetEndpoint} from "../../../../core/src/server/get-endpoint";
import {Database} from "../../../db/database";

export class ListCommentsEndpoint extends GetEndpoint {

    constructor(private db: Database) {
        super("/comments");
    }

    private getComments(): Either<string, List<Comment>> {
        return this.db.cache.comments.getCommentsEither();
    }

    isAuthorized(): boolean {
        return true;
    }

    run(req: Request, res: Response): void {
        ApiUtils.sendSerializedCollectionResult(this.getComments(), CommentJsonSerializer.instance, res);
    }

}
