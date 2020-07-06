import {None, Option} from "funfix-core";
import {contentKey, dateKey, idKey, titleKey, userKey} from "../misc/json-keys";
import {parseNumber, parseSerialized, parseString} from "../util/object-utils";
import {JsonBuilder} from "../misc/json-builder";
import {SimpleJsonSerializer} from "../misc/simple-json-serializer";
import {User, UserJsonSerializer} from "./user";

export class News {

    constructor(
        private id: Option<number> = None,
        private user: Option<User> = None,
        private content: Option<string> = None,
        private title: Option<string> = None,
        private date: Option<string> = None, // TODO: Use MomentJS data structure
    ) {
    }

    public getContent(): Option<string> {
        return this.content;
    }

    public getDate(): Option<string> {
        return this.date;
    }

    public getId(): Option<number> {
        return this.id;
    }

    public getTitle(): Option<string> {
        return this.title;
    }

    public getUser(): Option<User> {
        return this.user;
    }

    public getUserGroup(): Option<string> {
        return this.getUser()
            .flatMap(u => u.getGroup());
    }

    public getUsername(): Option<string> {
        return this.getUser()
            .flatMap(u => u.getUsername());
    }

}

export class NewsJsonSerializer extends SimpleJsonSerializer<News> {
    static instance: NewsJsonSerializer = new NewsJsonSerializer();

    fromJson(json: any): News {
        return new News(
            parseNumber(json[idKey]),
            parseSerialized(json[userKey], UserJsonSerializer.instance),
            parseString(json[contentKey]),
            parseString(json[titleKey]),
            parseString(json[dateKey]),
        );
    }

    toJson(value: News, builder: JsonBuilder): object {
        return builder
            .addOptional(value.getId(), idKey)
            .addOptionalSerialized(value.getUser(), userKey, UserJsonSerializer.instance)
            .addOptional(value.getContent(), contentKey)
            .addOptional(value.getTitle(), titleKey)
            .addOptional(value.getDate(), dateKey)
            .build();
    }

}
