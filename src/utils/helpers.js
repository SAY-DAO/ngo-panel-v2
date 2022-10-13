// Age
export default function getAge(DOB) {
  const today = new Date();
  const birthDate = new Date(DOB);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
}

// urgent ==> index 0
// growth 0 ==> index 1
// joy 1 ==> index 2
// health 2 ==> index 3
// surroundings 3 ==> index 4
// isDone ==> index 5
// isConfirmed ==> index 6
// unpayable ==> index 7
export function getOrganizedNeeds(theNeeds) {
  const needData = [[], [], [], [], [], [], [], []];
  for (let i = 0; i < theNeeds.needs.length; i += 1) {
    if (theNeeds.needs[i].isUrgent) {
      needData[0].push(theNeeds.needs[i]);
    } else if (theNeeds.needs[i].isDone) {
      needData[5].push(theNeeds.needs[i]);
    } else if (theNeeds.needs[i].isConfirmed) {
      needData[6].push(theNeeds.needs[i]);
    } else if (theNeeds.needs[i].unpayable) {
      needData[7].push(theNeeds.needs[i]);
    }
    needData[theNeeds.needs[i].category + 1].push(theNeeds.needs[i]);
  }
  return needData;
}

  
//  -3:Deprived of education | -2:Kindergarten | -1:Not attending | 0:Pre-school | 1:1st grade | 2:2nd grade | ... | 13:University
export const EducationEnum = {
  Deprived: -3,
  KinderGarten: -2,
  'Not Attending': -1,
  'Pre School': 0,
  'First Grade': 1,
  'Second Grade': 2,
  'Third Grade': 3,
  'Fourth Grade': 4,
  'Fifth Grade': 5,
  'Six Grade': 6,
  'Seven Grade': 7,
  'Eight Grade': 8,
  'Nine Grade': 9,
  'Ten Grade': 10,
  'Eleven Grade': 11,
  'Twelve Grade': 12,
  'Thirteen Grade': 13,
};

// 0:homeless | 1:Resident| 2:Care centers
export const HousingStatusEnum = {
  homeless: 0,
  Resident: 1,
  'Care Centers': 2,
};
