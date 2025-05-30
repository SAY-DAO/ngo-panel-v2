/* eslint-disable no-param-reassign */
import { round } from 'lodash';
import {
  NeedTypeEnum,
  PaymentStatusEnum,
  ProductStatusEnum,
  FlaskUserTypesEnum,
  SAYPlatformRoles,
  ServiceStatusEnum,
  NeedCategoryEnum,
} from './types';
import { PRODUCT_UNPAYABLE_PERIOD } from './configs';

export function truncateString(str, num) {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str;
  }
  // Return str truncated with '...' concatenated to the end of str.
  return `${str.slice(0, num)}...`;
}

export function shortenWallet(address) {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
}
export function median(values) {
  if (values.length === 0) throw new Error('No inputs');
  values.sort((a, b) => {
    return a - b;
  });
  const half = Math.floor(values.length / 2);
  if (values.length % 2) return values[half];
  return (values[half - 1] + values[half]) / 2.0;
}

// Age
export function getAge(DOB) {
  const today = new Date();
  const birthDate = new Date(DOB);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
}

// "-1": "تأیید نشده",
// "0": "پرداخت نشده,
// "1": "نیم‌پرداخت",
// "2": "پرداخت کامل",
// "p3": "کالا خریده شده",
// "p4": "به سمن ارسال شده",
// "p5": "به کودک ارسال شده",
// "s3": "هزینه به سمن ارسال شده",
// "s4": "به کودک ارسال شده",
// "signature": "امضا",
// "sign": "امضا",
// "pending": "به کودک ارسال نشده"

export function getCurrentStatusString(need) {
  if (!need.isConfirmed) {
    return '-1';
  }
  if (need.status === PaymentStatusEnum.PARTIAL_PAY) {
    return '1';
  }
  if (need.status === PaymentStatusEnum.COMPLETE_PAY) {
    return '2';
  }
  if (need.type === NeedTypeEnum.PRODUCT) {
    if (need.status === ProductStatusEnum.PURCHASED_PRODUCT) {
      return 'p3';
    }
    if (need.status === ProductStatusEnum.DELIVERED_TO_NGO) {
      return 'p4';
    }
    if (need.status === ProductStatusEnum.DELIVERED) {
      return 'p5';
    }
  }
  if (need.type === NeedTypeEnum.SERVICE) {
    if (need.status === ServiceStatusEnum.MONEY_TO_NGO) {
      return 's3';
    }
    if (need.status === ServiceStatusEnum.DELIVERED) {
      return 's4';
    }
  }
  return '0';
}

export function convertFlaskToSayRoles(flakUserType) {
  let role;
  if (flakUserType === FlaskUserTypesEnum.SAY_SUPERVISOR) {
    role = SAYPlatformRoles.AUDITOR;
  } else if (flakUserType === FlaskUserTypesEnum.ADMIN) {
    role = SAYPlatformRoles.AUDITOR;
  } else if (flakUserType === FlaskUserTypesEnum.SUPER_ADMIN) {
    role = SAYPlatformRoles.AUDITOR;
  } else if (flakUserType === FlaskUserTypesEnum.SOCIAL_WORKER) {
    role = SAYPlatformRoles.SOCIAL_WORKER;
  } else if (flakUserType === FlaskUserTypesEnum.COORDINATOR) {
    role = SAYPlatformRoles.PURCHASER;
  } else if (flakUserType === FlaskUserTypesEnum.NGO_SUPERVISOR) {
    role = SAYPlatformRoles.NGO_SUPERVISOR;
  } else if (!flakUserType) {
    role = SAYPlatformRoles.FAMILY;
  }
  return role;
}

export function getSAYRoleInteger(sayRole) {
  let roleInteger;
  if (sayRole === SAYPlatformRoles.AUDITOR) {
    roleInteger = SAYPlatformRoles.AUDITOR;
  } else if (sayRole === SAYPlatformRoles.SOCIAL_WORKER) {
    roleInteger = SAYPlatformRoles.SOCIAL_WORKER;
  } else if (sayRole === SAYPlatformRoles.PURCHASER) {
    roleInteger = SAYPlatformRoles.PURCHASER;
  } else if (sayRole === SAYPlatformRoles.NGO_SUPERVISOR) {
    roleInteger = SAYPlatformRoles.NGO_SUPERVISOR;
  } else if (sayRole === SAYPlatformRoles.FAMILY) {
    roleInteger = SAYPlatformRoles.FAMILY;
  } else if (sayRole === SAYPlatformRoles.RELATIVE) {
    roleInteger = SAYPlatformRoles.RELATIVE;
  } else if (sayRole === SAYPlatformRoles.NO_ROLE) {
    roleInteger = SAYPlatformRoles.NO_ROLE;
  }
  return roleInteger;
}

export function getSAYRoleString(sayRole) {
  let roleString;
  if (sayRole === SAYPlatformRoles.AUDITOR) {
    roleString = 'auditor';
  } else if (sayRole === SAYPlatformRoles.SOCIAL_WORKER) {
    roleString = 'socialWorker';
  } else if (sayRole === SAYPlatformRoles.PURCHASER) {
    roleString = 'purchaser';
  } else if (sayRole === SAYPlatformRoles.NGO_SUPERVISOR) {
    roleString = 'ngoSupervisor';
  } else if (sayRole === SAYPlatformRoles.FAMILY) {
    roleString = 'familyMember';
  } else if (sayRole === SAYPlatformRoles.RELATIVE) {
    roleString = 'relative';
  } else if (sayRole === SAYPlatformRoles.NO_ROLE) {
    roleString = 'noRole';
  }
  return roleString;
}

export function getUserSAYRoleString(userTypeId) {
  if (userTypeId === FlaskUserTypesEnum.SOCIAL_WORKER) {
    return 'socialWorker';
  }
  if (userTypeId === FlaskUserTypesEnum.NGO_SUPERVISOR) {
    return 'ngoSupervisor';
  }
  if (
    userTypeId === FlaskUserTypesEnum.ADMIN ||
    userTypeId === FlaskUserTypesEnum.SUPER_ADMIN ||
    userTypeId === FlaskUserTypesEnum.SAY_SUPERVISOR
  ) {
    return 'auditor';
  }
  return 'noRole';
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
  if (theNeeds.needs) {
    for (let i = 0; i < theNeeds.needs.length; i += 1) {
      if (theNeeds.needs[i].isUrgent) {
        needData[0].push(theNeeds.needs[i]);
      }
      if (theNeeds.needs[i].isDone) {
        needData[5].push(theNeeds.needs[i]);
      }
      if (theNeeds.needs[i].isConfirmed) {
        needData[6].push(theNeeds.needs[i]);
      }
      if (theNeeds.needs[i].unpayable) {
        needData[7].push(theNeeds.needs[i]);
      }
      needData[theNeeds.needs[i].category + 1].push(theNeeds.needs[i]);
    }
  } else {
    for (let i = 0; i < theNeeds.length; i += 1) {
      if (theNeeds[i].isUrgent) {
        needData[0].push(theNeeds[i]);
      }
      if (theNeeds[i].isDone) {
        needData[5].push(theNeeds[i]);
      }
      if (theNeeds[i].isConfirmed) {
        needData[6].push(theNeeds[i]);
      }
      if (theNeeds[i].unpayable) {
        needData[7].push(theNeeds[i]);
      }
      needData[theNeeds[i].category + 1].push(theNeeds[i]);
    }
  }
  return needData;
}

export function daysDifference(time1, time2) {
  const date1 = new Date(time1);
  const date2 = new Date(time2);
  // calculate days difference by dividing total milliseconds in a day
  return (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);
}

export function timeDifference(time1, time2) {
  const diff = time2.getTime() - time1.getTime();
  let msec = diff;
  const hh = Math.floor(msec / 1000 / 60 / 60);
  msec -= hh * 1000 * 60 * 60;
  const mm = Math.floor(msec / 1000 / 60);
  msec -= mm * 1000 * 60;
  const ss = Math.floor(msec / 1000);
  msec -= ss * 1000;
  return { hh, mm, ss, diff };
}

// format to yyyy-mm-dd
export function formatDate(date) {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
}

export function prepareUrl(imageUrl) {
  let url;
  if (imageUrl && imageUrl.startsWith('/')) {
    url = `https://api.sayapp.company/${imageUrl.slice(1)}`;
  } else {
    url = `https://api.sayapp.company/${imageUrl}`;
  }

  return url;
}

export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isUnpayable(need) {
  return (
    need.unavailable_from &&
    timeDifference(new Date(need.unavailable_from), new Date()).hh < PRODUCT_UNPAYABLE_PERIOD
  );
}

export function getCategoryString(categoryId, isUrgent) {
  if (isUrgent) {
    return 'childData.needCategory.urgent';
  }
  if (categoryId === NeedCategoryEnum.GROWTH) {
    return 'childData.needCategory.growth';
  }
  if (categoryId === NeedCategoryEnum.HEALTH) {
    return 'childData.needCategory.health';
  }
  if (categoryId === NeedCategoryEnum.JOY) {
    return 'childData.needCategory.joy';
  }
  if (categoryId === NeedCategoryEnum.SURROUNDING) {
    return 'childData.needCategory.surroundings';
  }
  return 'N/A';
}

export function shuffleArray(array) {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

// Function to calculate Levenshtein distance
function levenshtein(a, b) {
  const tmp = [];

  for (let i = 0; i <= b.length; i++) {
    tmp[i] = [i];
  }

  for (let i = 0; i <= a.length; i++) {
    tmp[0][i] = i;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1, // Deletion
        tmp[i][j - 1] + 1, // Insertion
        tmp[i - 1][j - 1] + (a[j - 1] === b[i - 1] ? 0 : 1), // Substitution
      );
    }
  }

  return tmp[b.length][a.length];
}

export function getSimilarityPercentage(sentence1, sentence2) {
  const distance = levenshtein(sentence1.toLowerCase(), sentence2.toLowerCase());
  const maxLength = Math.max(sentence1.length, sentence2.length);
  const similarity = 1 - distance / maxLength;

  return round(similarity * 100);
}

export function urlSimilarityPercentage(url1, url2) {
  // Convert URLs to lowercase to make the comparison case-insensitive
  url1 = url1.toLowerCase();
  url2 = url2.toLowerCase();

  // Calculate Levenshtein distance
  function levenshteinDistance(s1, s2) {
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = [];

    // Initialize the matrix with default values
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // Calculate Levenshtein distance
    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        if (s1[i - 1] === s2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          );
        }
      }
    }

    return matrix[len1][len2];
  }

  // Calculate similarity percentage
  const distance = levenshteinDistance(url1, url2);
  const maxLength = Math.max(url1.length, url2.length);
  const similarityPercentage = ((maxLength - distance) / maxLength) * 100;

  return similarityPercentage.toFixed(2);
}

export function categoryToString(category) {
  if (category === 0) {
    return 'need.categories.growth';
  }
  if (category === 1) {
    return 'need.categories.joy';
  }
  if (category === 2) {
    return 'need.categories.health';
  }
  return 'need.categories.surroundings';
}

export function persianMonthString(value) {
  return new Intl.DateTimeFormat('en-US-u-ca-persian', {
    month: 'short',
  }).format(value);
}

export function persianMonthStringFarsi(pm) {
  return pm === 1
    ? 'فروردین'
    : pm === 2
    ? 'اردیبهشت'
    : pm === 3
    ? 'خرداد'
    : pm === 4
    ? 'تیر'
    : pm === 5
    ? 'مرداد'
    : pm === 6
    ? 'شهریور'
    : pm === 7
    ? 'مهر'
    : pm === 8
    ? 'آبان'
    : pm === 9
    ? 'آذر'
    : pm === 10
    ? 'دی'
    : pm === 11
    ? 'بهمن'
    : pm === 12
    ? 'اسفند'
    : null;
}
