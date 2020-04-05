import {Option} from "funfix-core";
import {List} from "immutable";
import {SimpleJsonSerializer} from "./simple-json-serializer";

export class JsonBuilder {

    constructor(private object: object = {}) {
    }

    add<T>(value: any, key: string): JsonBuilder {
        // @ts-ignore
        this.object[key] = value;
        return new JsonBuilder(this.object);
    }

    addList<T>(values: List<T>, key: string): JsonBuilder {
        if (!values.isEmpty()) {
            values.map((value, iteration) => this.object[key][iteration]);
            return new JsonBuilder(this.object);
        }
        return new JsonBuilder(this.object);
    }

    addOptional(value: Option<any>, key: string): JsonBuilder {
        if (!value.isEmpty()) {
            // @ts-ignore
            this.object[key] = value.get();
            return new JsonBuilder(this.object);
        }
        return new JsonBuilder(this.object);
    }

    addOptionalSerialized<T>(value: Option<T>, key: string, serializer: SimpleJsonSerializer<T>): JsonBuilder {
        if (!value.isEmpty()) {
            this.object[key] = serializer.toJson(value.get());
            return new JsonBuilder(this.object);
        }
        return new JsonBuilder(this.object);
    }

    build(): object {
        return this.object;
    }

}
