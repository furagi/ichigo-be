import { getDateWeek } from './date.helpers';

describe('getDateWeek', () => {
  it('should be defined', () => {
    expect(getDateWeek).toBeDefined();
  });

  it('should return week dates for passed date starting from Sunday midnight', () => {
    const date = new Date('2020-03-19T00:20:00Z');
    const expected = [];
    for (let i = 0; i < 7; i++) {
      expected.push(new Date(`2020-03-${15 + i}T00:00:00Z`));
    }
    expect(getDateWeek(date)).toEqual(expected);
  });
});
