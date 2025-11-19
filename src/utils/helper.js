
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return date.toLocaleDateString('en-IN', options).replace(',', ' ');
};

export const convertTo12HourFormat = (time24) => {
  if (!time24) return time24;
  
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  
  return `${hour12}:${minutes} ${ampm}`;
};

export const getGameStatus = (openTime, closeTime) => {
  if (!openTime || !closeTime) return { status: 'Close for Today', color: '#EF4444' };
  
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  // Calculate close time minus 10 minutes for bidding cutoff
  const [closeHours, closeMinutes] = closeTime.split(':');
  const closeDate = new Date();
  closeDate.setHours(parseInt(closeHours), parseInt(closeMinutes) - 10, 0, 0);
  const biddingCutoffTime = `${closeDate.getHours().toString().padStart(2, '0')}:${closeDate.getMinutes().toString().padStart(2, '0')}`;
  
  if (currentTime < openTime) {
    return { status: 'Open', color: '#10B981' };
  } else if (currentTime < biddingCutoffTime) {
    return { status: 'Bidding for Close', color: '#F59E0B' };
  } else {
    return { status: 'Close for Today', color: '#EF4444' };
  }
};
// Helper function to get bidding cutoff time (10 minutes before close time)
export const getBiddingCutoffTime = (closeTime) => {
  if (!closeTime) return null;
  
  const [hours, minutes] = closeTime.split(':');
  const closeDate = new Date();
  closeDate.setHours(parseInt(hours), parseInt(minutes) - 10, 0, 0);
  
  return `${closeDate.getHours().toString().padStart(2, '0')}:${closeDate.getMinutes().toString().padStart(2, '0')}`;
};

export const getSinglePannaCombinations = (digit) => {
  const combinations = {
    '0': ['127', '136', '145', '190', '235', '280', '370', '389', '460', '479', '569', '578'],
    '1': ['128', '137', '146', '236', '245', '290', '380', '470', '489', '560', '579', '678'],
    '2': ['129', '138', '147', '156', '237', '246', '345', '390', '480', '570', '589', '679'],
    '3': ['120', '139', '148', '157', '238', '247', '256', '346', '490', '580', '670', '689'],
    '4': ['130', '149', '158', '167', '239', '248', '257', '347', '356', '590', '680', '789'],
    '5': ['140', '159', '168', '230', '249', '258', '267', '348', '357', '456', '690', '780'],
    '6': ['123', '150', '169', '178', '240', '259', '268', '349', '358', '367', '457', '790'],
    '7': ['124', '160', '278', '179', '250', '269', '340', '359', '368', '458', '467', '890'],
    '8': ['125', '134', '170', '189', '260', '279', '350', '369', '468', '378', '459', '567'],
    '9': ['126', '135', '180', '234', '270', '289', '360', '379', '450', '469', '478', '568'],
  };
  return combinations[digit] || [];
};

export const getDoublePannaCombinations = (digit) => {
  const combinations = {
    '0': ['118', '226', '244', '299', '334', '488', '550', '668', '677'],
    '1': ['100', '119', '155', '227', '335', '344', '399', '588', '669'],
    '2': ['110', '200', '228', '255', '336', '499', '660', '688', '778'],
    '3': ['166', '229', '300', '337', '355', '445', '599', '779', '788'],
    '4': ['112', '220', '266', '338', '400', '446', '455', '699', '770'],
    '5': ['113', '122', '177', '339', '366', '477', '500', '799', '889'],
    '6': ['600', '114', '277', '330', '448', '466', '556', '880', '899'],
    '7': ['115', '133', '188', '223', '377', '449', '557', '566', '700'],
    '8': ['116', '224', '233', '288', '440', '477', '558', '800', '990'],
    '9': ['117', '144', '199', '225', '388', '559', '577', '667', '900'],

  };
  return combinations[digit] || [];
};

export const getKatPannaCombinations = (digit) => {
  const combinations = {
    '0': ['136','127','389','479','550'],
    '1': ['380','489','560','146','227'],
    '2': ['138','499','156','570','137'],
    '3': ['247','166','238','490','580'],
    '4': ['167','257','338','149','590'],
    '5': ['168','267','348','249','500'],
    '6': ['150','277','358','349','169'],
    '7': ['160','278','368','449','250'],
    '8': ['279','350','116','378','459'],
    '9': ['126','388','450','270','469'],

  };
  return combinations[digit] || [];
};

export const getPannaType = (number) => {
  if (number.length !== 3) return null;
  
  const digits = number.split('');
  
  // Check if all digits are same (TP)
  if (digits[0] === digits[1] && digits[1] === digits[2]) {
    return 'TP';
  }
  // Check if any two digits are same (DP)
  else if (digits[0] === digits[1] || digits[1] === digits[2] || digits[0] === digits[2]) {
    return 'DP';
  }
  // All digits are different (SP)
  else {
    return 'SP';
  }
};

export const generateJugarCombinations = (jugarNumber) => {
  const parts = jugarNumber.split('/');
  if (parts.length !== 2) return [];
  
  const beforeSlash = parts[0];
  const afterSlash = parts[1];
  const combinations = [];
  
  for (let i = 0; i < beforeSlash.length; i++) {
    for (let j = 0; j < afterSlash.length; j++) {
      combinations.push(beforeSlash[i] + afterSlash[j]);
    }
  }
  
  return combinations;
};

export const generateMultiplePannaCombinations = (selectedNumbers, type) => {
  const allCombinations = [];
  
  selectedNumbers.forEach(number => {
    if (type === 'SP') {
      const combinations = getSinglePannaCombinations(number.toString());
      allCombinations.push(...combinations);
    } else if (type === 'DP') {
      const combinations = getDoublePannaCombinations(number.toString());
      allCombinations.push(...combinations);
    }
  });
  
  return allCombinations;
};