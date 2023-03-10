import {
  NeedTypeEnum,
  PaymentStatusEnum,
  ProductStatusEnum,
  RolesEnum,
  SAYPlatformRoles,
  ServiceStatusEnum,
} from './types';

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

// "-1": "تائید نشده",
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
  if (flakUserType === RolesEnum.SAY_SUPERVISOR) {
    role = SAYPlatformRoles.AUDITOR;
  } else if (flakUserType === RolesEnum.ADMIN) {
    role = SAYPlatformRoles.AUDITOR;
  } else if (flakUserType === RolesEnum.SUPER_ADMIN) {
    role = SAYPlatformRoles.AUDITOR;
  } else if (flakUserType === RolesEnum.SOCIAL_WORKER) {
    role = SAYPlatformRoles.SOCIAL_WORKER;
  } else if (flakUserType === RolesEnum.COORDINATOR) {
    role = SAYPlatformRoles.PURCHASER;
  } else if (flakUserType === RolesEnum.NGO_SUPERVISOR) {
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
  } else if (sayRole === SAYPlatformRoles.FRIEND) {
    roleInteger = SAYPlatformRoles.FRIEND;
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
  } else if (sayRole === SAYPlatformRoles.FRIEND) {
    roleString = 'friend';
  } else if (sayRole === SAYPlatformRoles.NO_ROLE) {
    roleString = 'noRole';
  }
  return roleString;
}

export function getUserSAYRoleString(userTypeId) {
  if (userTypeId === RolesEnum.SOCIAL_WORKER) {
    return 'socialWorker';
  }
  if (userTypeId === RolesEnum.NGO_SUPERVISOR) {
    return 'ngoSupervisor';
  }
  if (
    userTypeId === RolesEnum.ADMIN ||
    userTypeId === RolesEnum.SUPER_ADMIN ||
    userTypeId === RolesEnum.SAY_SUPERVISOR
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

// duplicates need filtering by name property, and unpaid
export function getDuplicateChildNeeds(childNeeds, theNeed) {
  return childNeeds.filter((n) => {
    return (
      n.name === theNeed.name &&
      n.child_id === theNeed.child_id &&
      n.id !== theNeed.id &&
      n.status < PaymentStatusEnum.COMPLETE_PAY
    );
  });
}
