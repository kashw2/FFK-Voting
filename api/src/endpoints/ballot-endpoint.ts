import {AuthenticatedCrudEndpoint} from "@kashw2/lib-server";
import {Database} from "../db/database";
import {Ballot, BallotJsonSerializer, User} from "@kashw2/lib-ts";
import {Request, Response} from "express";
import {Either} from "funfix";
import {ApiUtils, EitherUtils} from "@kashw2/lib-util";

export class BallotEndpoint extends AuthenticatedCrudEndpoint {

    constructor(private db: Database) {
        super('/ballot');
    }

    create(req: Request): Promise<Either<string, any>> {
        return EitherUtils.sequence(Either.map2(
            this.validate(req),
            this.getVoteId(req),
            (b, vid) => {
                return EitherUtils.sequence(this.db.cache.votes.getByVoteId(vid)
                    .map(v => {
                        this.db.cache.votes.setIn(v.withBallot(b), x => x.getId().contains(vid));
                        return this.db.procedures.insert.insertBallot(b, vid)(this.getModifiedBy(req));
                    }));
            }
        ))
            .then(v => v.map(b => BallotJsonSerializer.instance.toJsonImpl(b)));
    }


    doesRequireAuthentication(req: Request): boolean {
        return true;
    }

    private getBallot(req: Request): Either<string, Ballot> {
        return ApiUtils.parseBodyParamSerialized(req, 'ballot', BallotJsonSerializer.instance);
    }

    private getVoteId(req: Request): Either<string, string> {
        return ApiUtils.parseStringQueryParam(req, 'vote_id');
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
        return Promise.resolve(this.getVoteId(req)
            .flatMap(bid => this.db.cache.ballots.getBallotById(bid)))
            .then(v => v.map(x => BallotJsonSerializer.instance.toJsonImpl(x)));
    }

    private validate(req: Request): Either<string, Ballot> {
        switch (this.getHTTPMethod(req)) {
            case 'POST':
                return this.getBallot(req)
                    .filterOrElse(b => b.getVoterId().nonEmpty(), () => 'Ballot must have a voter id')
                    .filterOrElse(b => b.getResponse().nonEmpty(), () => 'Ballot must have a response');
            case 'PUT':
                return this.getBallot(req)
                    .filterOrElse(b => b.getVoterId().nonEmpty(), () => 'Ballot must have a voter id')
                    .filterOrElse(b => b.getResponse().nonEmpty(), () => 'Ballot must have a response');
            default:
                return this.getBallot(req);
        }
    }

}