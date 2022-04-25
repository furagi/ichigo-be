export function getDateWeek(date: Date): Date[] {
  // so for 04.25th 2022 we get 25 - 1
  const sunday = date.getDate() - date.getDay();
  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(date);
    day.setDate(sunday + i);
    /*
     * I cloud get and substract minutes, hours, etc, but instead I'm just subsctracting
     * the mss and writing this comment
     */
    day.setTime(+day - (+day % (1000 * 3600 * 24)));
    week.push(day);
  }
  return week;
}
