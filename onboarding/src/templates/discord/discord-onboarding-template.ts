import {OnboardingTemplate} from "../onboarding-template";
import {Candidate, CandidateJsonSerializer, FfkApi} from "@kashw2/lib-ts";
import {Either} from "funfix";
import {DiscordApi, DiscordGuildMember} from "@kashw2/lib-external";
import {filter, map, switchMap, tap} from "rxjs/operators";
import {List} from "immutable";
import {DiscordOnboardingCandidate} from "./discord-onboarding-candidate";
import {firstValueFrom, from} from "rxjs";
import {EitherUtils, OptionUtils} from "@kashw2/lib-util";

export class DiscordOnboardingTemplate extends OnboardingTemplate {

    constructor() {
        super();
    }

    async importCandidate(): Promise<Either<string, List<Candidate>>> {
        const discordApi: DiscordApi = new DiscordApi(
            '607005043043860521',
            process.env.FFK_DISCORD_CLIENT_SECRET!,
            process.env.FFK_DISCORD_REDIRECT!,
            process.env.FFK_DISCORD_BOT_TOKEN!,
        );
        const ffkApi: FfkApi = new FfkApi(process.env.FFK_API_SERVER!);
        return firstValueFrom(discordApi.getGuildMembers('539188746114039818')
            .pipe(map(v => v.getOrElse(List<DiscordGuildMember>())))
            .pipe(map(members => members.map(member => new DiscordOnboardingCandidate(member).buildCandidate())))
            .pipe(map(v => OptionUtils.flattenList(v)))
            .pipe(map(candidates => EitherUtils.liftEither(candidates, 'Unable to transform Candidates')))
            .pipe(filter(v => v.isRight()))
            .pipe(map(v => v.get()))
            .pipe(switchMap(discordCandidates => {
                return from(ffkApi.candidate().sendReadRequestList(CandidateJsonSerializer.instance))
                    .pipe(filter(v => v.isRight()))
                    .pipe(map(v => v.get()))
                    .pipe(map(cachedCandidates => discordCandidates.filter(dc => cachedCandidates.every(cc => cc.getDiscordId().equals(dc.getDiscordId())))));
            }))
            .pipe(tap(v => console.log(`Ingested ${v.size} Candidates`)))
            .pipe(switchMap(candidates => {
                return from(ffkApi.candidate()
                    .sendCreateRequestList(
                        CandidateJsonSerializer.instance,
                        {},
                        {candidates: CandidateJsonSerializer.instance.toJsonArray(candidates.toArray())})
                );
            }))
        );
    }

}