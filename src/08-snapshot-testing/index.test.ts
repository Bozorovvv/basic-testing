import { generateLinkedList } from '08-snapshot-testing';

describe('generateLinkedList', () => {
  test('generates linked list from a non-empty array of numbers', () => {
    const input = [1, 2, 3];
    const expectedOutput = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };

    const result = generateLinkedList(input);
    expect(result).toStrictEqual(expectedOutput);
  });

  test('matches the linked list structure for strings with snapshot', () => {
    const input = ['a', 'b', 'c'];
    const result = generateLinkedList(input);

    expect(result).toMatchSnapshot();
  });

  test('returns an empty linked list for an empty array', () => {
    const input: any[] = [];
    const expectedOutput = { value: null, next: null };

    const result = generateLinkedList(input);
    expect(result).toStrictEqual(expectedOutput);
  });
});
