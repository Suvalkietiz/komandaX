import { workingHoursCategoryMatches, parseWorkingHoursRange } from "./workingHours";

describe("parseWorkingHoursRange", () => {
  it("teisingai išanalizuoja darbo valandas", () => {
    expect(parseWorkingHoursRange("8:00-20:00")).toEqual({ start: 8, end: 20 });
  });

  it("grąžina null kai tuščia eilutė", () => {
    expect(parseWorkingHoursRange("")).toBeNull();
  });

  it("grąžina null kai neteisingas formatas", () => {
    expect(parseWorkingHoursRange("abc-xyz")).toBeNull();
  });
});

describe("workingHoursCategoryMatches", () => {
  it("morning - grąžina true kai vieta dirba ryte", () => {
    expect(workingHoursCategoryMatches("7:00-14:00", "morning")).toBe(true);
  });

  it("morning - grąžina false kai vieta nedirba ryte", () => {
    expect(workingHoursCategoryMatches("13:00-22:00", "morning")).toBe(false);
  });

  it("afternoon - grąžina true kai vieta dirba po pietų", () => {
    expect(workingHoursCategoryMatches("10:00-18:00", "afternoon")).toBe(true);
  });

  it("afternoon - grąžina false kai vieta nedirba po pietų", () => {
    expect(workingHoursCategoryMatches("6:00-11:00", "afternoon")).toBe(false);
  });

  it("evening - grąžina true kai vieta dirba vakare", () => {
    expect(workingHoursCategoryMatches("16:00-23:00", "evening")).toBe(true);
  });

  it("evening - grąžina false kai vieta nedirba vakare", () => {
    expect(workingHoursCategoryMatches("8:00-17:00", "evening")).toBe(false);
  });

  it("grąžina false kai tuščios darbo valandos", () => {
    expect(workingHoursCategoryMatches("", "morning")).toBe(false);
  });

  it("grąžina false kai nežinoma kategorija", () => {
    expect(workingHoursCategoryMatches("8:00-20:00", "night")).toBe(false);
  });
});