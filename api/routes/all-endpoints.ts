import {Router} from "express";
import {Database} from "../db/database";
import {ListNewsEndpoint} from "./news/list-news-endpoint";
import {ListUsersByGroupEndpoint} from "./users/list/list-users-by-group-endpoint";
import {ReadUserByIdEndpoint} from "./users/read/read-user-by-id-endpoint";
import {ReadUserByTokenEndpoint} from "./users/read/read-user-by-token-endpoint";
import {ReadUserByUsernameEndpoint} from "./users/read/read-user-by-username-endpoint";
import {UserRegisterEndpoint} from "./users/write/user-register-endpoint";
import {ListRecentVotesEndpoint} from "./votes/list/list-recent-votes-endpoint";
import {ListVotesByTypeEndpoint} from "./votes/list/list-votes-by-type-endpoint";
import {ListVotesByUserEndpoint} from "./votes/list/list-votes-by-user-endpoint";
import {ListVotesEndpoint} from "./votes/list/list-votes-endpoint";
import {ListVotesPassedEndpoint} from "./votes/list/list-votes-passed-endpoint";
import {ReadVoteByIdEndpoint} from "./votes/read/read-vote-by-id-endpoint";
import {WriteVoteEndpoint} from "./votes/write/write-vote-endpoint";
import {WriteCandidatesEndpoint} from "./candidates/write-candidates-endpoint";

export class AllEndpoints {

    static initialiseEndpoints(router: Router, db: Database): void {
        new ReadUserByIdEndpoint(db).routeEndpoint(router);
        new ReadUserByUsernameEndpoint(db).routeEndpoint(router);
        new ListUsersByGroupEndpoint(db).routeEndpoint(router);
        new UserRegisterEndpoint(db).routeEndpoint(router);
        new ReadUserByTokenEndpoint(db).routeEndpoint(router);
        new ListNewsEndpoint(db).routeEndpoint(router);
        new ListVotesEndpoint(db).routeEndpoint(router);
        new ReadVoteByIdEndpoint(db).routeEndpoint(router);
        new ListVotesByUserEndpoint(db).routeEndpoint(router);
        new ListVotesPassedEndpoint(db).routeEndpoint(router);
        new ListVotesByTypeEndpoint(db).routeEndpoint(router);
        new ListRecentVotesEndpoint(db).routeEndpoint(router);
        new WriteVoteEndpoint(db).routeEndpoint(router);
        new WriteCandidatesEndpoint(db).routeEndpoint(router);
    }

}
