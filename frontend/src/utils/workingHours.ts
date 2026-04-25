export const parseWorkingHoursRange = (workingHours: string) => {
  if (!workingHours) return null;

  const [startStr, endStr] = workingHours.split("-");

  const startHour = Number(startStr.split(":")[0]);
  const endHour = Number(endStr.split(":")[0]);

  if (Number.isNaN(startHour) || Number.isNaN(endHour)) {
    return null;
  }

  return {
    start: startHour,
    end: endHour,
  };
};

export const workingHoursCategoryMatches = (workingHours: string, category: string) => {
  const range = parseWorkingHoursRange(workingHours);
  if (!range) return false;

  if (category === "morning") return range.start < 12 && range.end > 6;
  if (category === "afternoon") return range.start < 18 && range.end > 12;
  if (category === "evening") return range.start < 24 && range.end > 18;

  return false;
};