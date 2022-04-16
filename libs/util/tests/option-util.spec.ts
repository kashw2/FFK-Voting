import {OptionUtils} from "../src";
import {Left, None, Option, Right, Some} from "funfix";
import {List, Set} from "immutable";
import test from "ava";


test('exists2 should pass exists2', t => {
    const result = OptionUtils.exists2(Option.of(true), Option.of(false), (a, b) => {
        return a && !b;
    });
    t.deepEqual(result, true);
});

test('exists2 should fail exists2', t => {
    const result = OptionUtils.exists2(Option.of(true), None, (a, b) => {
        return a && !b;
    });
    t.deepEqual(result, false);
});

test('flattenCollection should naturally transform to collection', t => {
    const collection = List.of(Option.of(1));
    const result = OptionUtils.flattenCollection(collection).toArray();
    t.deepEqual(result, [1]);
});

test('flattenList should naturally transform to list', t => {
    const collection = List.of(Option.of(1));
    const result = OptionUtils.flattenList(collection).toArray();
    t.deepEqual(result, [1]);
});

test('flattenSet should naturally transform to set', t => {
    const collection = Set.of(Option.of(1));
    const result = OptionUtils.flattenSet(collection).toArray();
    t.deepEqual(result, [1]);
});

test('toEtesther should naturally transform to either', t => {
    const result = OptionUtils.toEither(Option.of(1), 'not 1');
    t.deepEqual(result, Right(1));
});

test('toEtesther should not naturally transform to either', t => {
    const result = OptionUtils.toEither(None, 'not 1');
    t.deepEqual(result, Left('not 1'));
});

test('toList should transform varargs to list', t => {
    const result = OptionUtils.toList(Option.of(1), Option.of(2), Option.of(3)).toArray();
    t.deepEqual(result, [1, 2, 3]);
});

test('toSet should transform varargs to set', t => {
    const result = OptionUtils.toSet(Option.of(1), Option.of(2), Option.of(3)).toArray();
    t.deepEqual(result, [1, 2, 3]);
});

test('when should create option if predicate is true', t => {
    const result = OptionUtils.when(Some(1).nonEmpty(), () => {
        return 2;
    });
    t.deepEqual(result, Some(2));
});