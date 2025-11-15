export const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

export const formatValue = (value) => Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value);

export const formatThousands = (value) => Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value);

// To use in decimal type of inputs (e.g Price)
export const convertToDecimal = (value) => {
  if (value.includes('.')) {
    if (value[(value.length - 1)] === '.') {
      value = (!value || value === '') ? null : value;
      value = isNaN(value) ? 0 : value;
      return value;
    }
    else{
      value = (!value || value === '') ? null : value;
      value = isNaN(value) ? 0 : parseFloat(value);
      return value;
    }
  }
  else {
    value = (!value || value === '') ? null : value;
    value = isNaN(value) ? 0 : Number(value);
    return value;
  }
}

/**
 * 
 * @param {value} value 
 * @returns 0 if input number is null or 0
 */
export const isNullNumber = (value) => {
  if(value === null || value === 0 || !value || value < 0 || isNaN(value)){
    return 0;
  }
  else{
    return value;
  }
}

/**
 * 
 * @param {value} value 
 * @returns empty string if string is null or empty 
 */
export const isNullString = (value) => {
  if(value === null || value === "" || !value){
    return "";
  }
  else{
    return value;
  }
}


/**
 * 
 * @param {value} value 
 * @returns empty false if boolean is null or undefined 
 */
 export const isNullBoolean = (value) => {
  if(value === null || value === "" || value === undefined){
    return false;
  }
  else{
    return value;
  }
}

export const getFileSource = (module, name) => {
  // src={APIURL + "Common/GetImage?type=resourcedescription&&fileName=" + value.resourceDescriptionImage} 
  if(module && name){

  }
}

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
/**
 * Get the digit of Month from given Date
 * If date string is not valid then return 0
 * @param  {string} dateString The valid date string
 * @return {Number}      The month digit
 */
export const dateMonth = (dateString) => {
    let month = 0;
    if (!isNaN(Date.parse(dateString))) {
        month = new Date(dateString).toLocaleString('default', { month: 'numeric' });
        return month;
    }
    return month;

}
/**
 * Get the Difference of Years between two valid dates
 * @param {Date} endDate - the end date
 * @param {Date} startDate - the start date
 * @return {number} Difference of Years between startDate and endDate
*/
export const yearDifference = (endDate, startDate) => {
    if (!isNaN(Date.parse(startDate)) && !isNaN(Date.parse(endDate))) {
        let sDate = new Date(startDate);
        let eDate = new Date(endDate);
        let yearsDiff = eDate.getFullYear() - sDate.getFullYear();
        return yearsDiff;

    }

}
/**
 * Get the Difference of Months between two valid dates
 * @param {Date} endDate - the end date
 * @param {Date} startDate - the start date
 * @return {number} Difference of Months between startDate and endDate
*/
export const monthDifference = (endDate, startDate, roundUpFractionalMonths) => {
    if (!isNaN(Date.parse(startDate)) && !isNaN(Date.parse(endDate))) {
        let sDate = new Date(startDate);
        let eDate = new Date(endDate);
        let inverse = false;
        if (startDate > endDate) {
            eDate = new Date(startDate);
            sDate = new Date(endDate);
            inverse = true;
        }

        let yearsDifference = yearDifference(eDate,sDate);
        let monthsDifference = eDate.getMonth() - sDate.getMonth();
        let daysDifference = eDate.getDate() - sDate.getDate();
        let monthCorrection = 0;

        //If roundUpFractionalMonths is true, check if an extra month needs to be added from rounding up.
        //The difference is done by ceiling (round up), e.g. 3 months and 1 day will be 4 months.
        if (roundUpFractionalMonths === true && daysDifference > 0) {
            monthCorrection = 1;
        }

        //If the day difference between the 2 months is negative, the last month is not a whole month.
        else if (roundUpFractionalMonths !== true && daysDifference < 0) {
            monthCorrection = -1;
        }
        let months = (inverse ? -1 : 1) * (yearsDifference * 12 + monthsDifference + monthCorrection);

        return months;

    }

}


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