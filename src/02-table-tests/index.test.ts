import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 1, b: 2, action: Action.Subtract, expected: -1 },
  { a: 2, b: 2, action: Action.Subtract, expected: 0 },
  { a: 3, b: 2, action: Action.Subtract, expected: 1 },
  { a: 1, b: 2, action: Action.Multiply, expected: 2 },
  { a: 2, b: 2, action: Action.Multiply, expected: 4 },
  { a: 3, b: 2, action: Action.Multiply, expected: 6 },
  { a: 1, b: 2, action: Action.Divide, expected: 0.5 },
  { a: 2, b: 2, action: Action.Divide, expected: 1 },
  { a: 3, b: 2, action: Action.Divide, expected: 1.5 },
  { a: 2, b: 2, action: Action.Exponentiate, expected: 4 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 3, b: 2, action: Action.Exponentiate, expected: 9 },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should correctly perform %p operation on %p and %p',
    ({ a, b, action, expected }) => {
      expect(
        simpleCalculator({
          a,
          b,
          action,
        }),
      ).toBe(expected);
    },
  );

  test('should return null for invalid action', () => {
    expect(
      simpleCalculator({
        a: 1,
        b: 2,
        action: 'invalid',
      }),
    ).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    expect(
      simpleCalculator({
        a: 1,
        b: 'two',
        action: Action.Add,
      }),
    ).toBeNull();
  });

  test('should handle division by zero', () => {
    expect(simpleCalculator({ a: 10, b: 0, action: Action.Divide })).toBe(
      Infinity,
    );
  });
});
