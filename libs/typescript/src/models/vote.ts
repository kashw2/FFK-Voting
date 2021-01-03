import {JsonBuilder, JsonSerializer, MomentUtils, parseDate, parseSetSerialized, parseString} from '@ffk/lib-util';
import {None, Option} from 'funfix-core';
import {ballotsKey, candidateKey, createdKey, groupKey, idKey, sponsorKey} from '../misc/json-keys';
import {User, UserJsonSerializer} from './user';
import {Candidate, CandidateJsonSerializer} from './candidate';
import {Group, GroupJsonSerializer} from './group';
import {Set} from 'immutable';
import * as moment from 'moment';
import {Ballot, BallotJsonSerializer} from './ballot';

export class Vote {

	constructor(
		private id: Option<string> = None,
		private sponsor: Option<User> = None,
		private candidate: Option<Candidate> = None,
		private promotionGroup: Option<Group> = None,
		private ballots: Set<Ballot> = Set(),
		private created: Option<moment.Moment> = None,
	) {
	}

	public getBallots(): Set<Ballot> {
		return this.ballots;
	}

	public getCandidate(): Option<Candidate> {
		return this.candidate;
	}

	public getCandidateGroupColour(): Option<string> {
		return this.getCandidate()
			.flatMap(c => c.getGroup())
			.flatMap(g => g.getColour());
	}

	public getCandidateGroupName(): Option<string> {
		return this.getCandidate()
			.flatMap(c => c.getGroup())
			.flatMap(g => g.getLabel());
	}

	public getCandidateUsername(): Option<string> {
		return this.getCandidate()
			.flatMap(c => c.getDiscordUsername());
	}

	public getCreated(): Option<moment.Moment> {
		return this.created;
	}

	public getFormattedCreatedString(format: 'DMY'): Option<string> {
		return MomentUtils.format(this.getCreated(), format);
	}

	public getId(): Option<string> {
		return this.id;
	}

	public getPromotionGroup(): Option<Group> {
		return this.promotionGroup;
	}

	public getPromotionGroupColour(): Option<string> {
		return this.getPromotionGroup()
			.flatMap(g => g.getColour());
	}

	public getPromotionGroupName(): Option<string> {
		return this.getPromotionGroup()
			.flatMap(g => g.getLabel());
	}

	public getSponsor(): Option<User> {
		return this.sponsor;
	}

	public getSponsorId(): Option<string> {
		return this.getSponsor()
			.flatMap(s => s.getId());
	}

	public getSponsorUsername(): Option<string> {
		return this.getSponsor()
			.flatMap(s => s.getUsername());
	}

}

export class VoteJsonSerializer extends JsonSerializer<Vote> {

	static instance: VoteJsonSerializer = new VoteJsonSerializer();

	fromJson(json: any): Vote {
		return new Vote(
			parseString(json[idKey]),
			UserJsonSerializer.instance.fromJsonImpl(json[sponsorKey]),
			CandidateJsonSerializer.instance.fromJsonImpl(json[candidateKey]),
			GroupJsonSerializer.instance.fromJsonImpl(json[groupKey]),
			parseSetSerialized(json[ballotsKey], BallotJsonSerializer.instance),
			parseDate(json[createdKey]),
		);
	}

	toJson(value: Vote, builder: JsonBuilder): Record<string, any> {
		return builder.addOptional(value.getId(), idKey)
			.addOptionalSerialized(value.getSponsor(), sponsorKey, UserJsonSerializer.instance)
			.addOptionalSerialized(value.getCandidate(), candidateKey, CandidateJsonSerializer.instance)
			.addOptionalSerialized(value.getPromotionGroup(), groupKey, GroupJsonSerializer.instance)
			.addIterableSerialized(value.getBallots(), ballotsKey, BallotJsonSerializer.instance)
			.addOptionalDate(value.getCreated(), createdKey)
			.build();
	}

}
