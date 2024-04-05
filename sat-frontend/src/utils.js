import { TERMS } from "./constants";

export const extractCourseNumbers = (subjectCodes) => {
  return subjectCodes.map((courseCode) => {
    const parts = courseCode.split(" ");
    const lastPart = parts[parts.length - 1];
    const number = parseInt(lastPart);
    return isNaN(number) ? 0 : number;
  });
};

export function getNextTerm(startTerm) {
  const currentIndex = TERMS.findIndex((term) => term.value === startTerm);
  if (currentIndex === -1) {
    throw new Error("Invalid start term");
  }
  const nextIndex = (currentIndex + 1) % TERMS.length;
  const nextTerm = TERMS[nextIndex].value;
  return nextTerm;
}

export const getTermLabel = (value) => {
  const term = TERMS.find((term) => term.value === value);
  return term ? term.label : null;
};

export const getNextYears = (count) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < count; i++) {
    years.push({ label: currentYear + i, value: currentYear + i });
  }
  return years;
};

export const getBlockNameById = (blocksArray, blockId) => {
  console.log("blockId", blocksArray, blockId);
  for (let i = 0; i < blocksArray.length; i++) {
    if (blocksArray[i].block_id === blockId) {
      return blocksArray[i].name;
    }
  }
  return null;
};
