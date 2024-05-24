import {Left, Right} from "funfix-core";
import {validateMaxLength, validateString} from '../src/validator-utils';
import {describe, test} from "vitest";

describe('ValidatorUtils', () => {
  test('validateMaxLength (string) should validate max length', t => {
    const result = validateMaxLength(`This string shouldn't be more than 5 characters long`, 5);
    t.expect(result).toEqual(Left('String is over max length'));
  });

  test('validateMaxLength (string) should validate min length', t => {
    const result = validateMaxLength(`This this string shouldn't be over 100 characters long`, 100);
    t.expect(result).toEqual(Right(`This this string shouldn't be over 100 characters long`));
  });

  test('validateMaxLength (number) should validate max length', t => {
    const result = validateMaxLength(123456, 5);
    t.expect(result).toEqual(Left('Number is over max length'));
  });

  test('validateMaxLength (number) should validate min length', t => {
    const result = validateMaxLength(1234, 100);
    t.expect(result).toEqual(Right('1234'));
  });

  test('validateMaxLength should hit default', t => {
    const result = validateMaxLength(true, 140);
    t.expect(result).toEqual(Left('Unknown type submitted for validation'));
  });

  test('validateString should validate', t => {
    const result = validateString('Hello World', v => v === 'Hello World');
    t.expect(result).toEqual(Right('Hello World'));
  });
});
