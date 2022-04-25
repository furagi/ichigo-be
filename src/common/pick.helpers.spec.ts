import { pick } from './pick.helpers';

describe('pick', () => {
  it('should be defined', () => {
    expect(pick).toBeDefined();
  });

  it('should select only passed values', () => {
    const testObject = { a: 1, b: 2, 3: 4 };
    expect(pick(testObject, ['a', 3])).toEqual({ a: 1, 3: 4 });
  });
});
