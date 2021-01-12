import {None, Option} from 'funfix-core';
import * as moment from 'moment';
import {JsonBuilder, JsonSerializer, parseDate} from '@ffk/lib-util';
import {endKey, startKey} from './json-keys';

export class Timestamp {

	constructor(
		readonly start: Option<moment.Moment> = None,
		readonly end: Option<moment.Moment> = None,
	) {
	}

	getEnd(): Option<moment.Moment> {
		return this.end;
	}

	getStart(): Option<moment.Moment> {
		return this.start;
	}

}

export class TimestampJsonSerializer extends JsonSerializer<Timestamp> {

	static instance: TimestampJsonSerializer = new TimestampJsonSerializer();

	fromJson(json: any): Timestamp {
		return new Timestamp(
			parseDate(json[startKey]),
			parseDate(json[endKey]),
		);
	}

	toJson(value: Timestamp, builder: JsonBuilder): Record<string, any> {
		return builder.addOptionalDate(value.getStart(), startKey)
			.addOptionalDate(value.getEnd(), endKey)
			.build();
	}

}