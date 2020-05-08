import {Collection, List} from "immutable";
import {JsonBuilder} from "./json-builder";

export abstract class SimpleJsonSerializer<T> {

    abstract fromJson(json: any): T;

    // TODO: Explore making a fromJsonArray that takes a collection

    fromJsonArray(list: List<T>): List<T> {
        return list.map(x => this.fromJson(x));
    }

    /**
     * Pretty much goes against the TypeScript type system.
     * This works off the basis that you parse in what the system believes is an Object but isn't at runtime
     * Check the 'object' and if it's not an empty object then it's something else and we treat it like a Collection
     */
    fromObjectToList(obj: object): List<T> {
        // @ts-ignore
        if (obj !== "{}") {
            return this.fromJsonArray(List(obj as []));
        }
        return List();
    }

    abstract toJson(value: T, builder: JsonBuilder): object;

    toJsonArray(collection: Collection<number, T>): object {
        return collection.map(x => this.toJsonImpl(x));
    }

    toJsonArrayString(value: Collection<any, T>): string {
        return JSON.stringify(this.toJsonArray(value));
    }

    toJsonImpl(value: T): object {
        return this.toJson(value, new JsonBuilder());
    }

    toJsonString(value: T): string {
        return JSON.stringify(this.toJsonImpl(value));
    }

}
