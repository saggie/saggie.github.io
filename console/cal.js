/* cal.js */

var Calendar = function() {
  var data = null,
      isCalculationFinished = false,
      today = new Date(),
      todaysColumnPosition,
      todaysLinePosition,
      dayOfWeekEn = "Su Mo Tu We Th Fr Sa",
      dayOfWeekJa = "ì˙ åé âŒ êÖ ñÿ ã‡ ìy",
      monthsEn = [
        "      January       ",
        "      February      ",
        "       March        ",
        "       April        ",
        "        May         ",
        "        June        ",
        "        July        ",
        "       August       ",
        "     September      ",
        "      October       ",
        "      November      ",
        "      December      "
      ],
      monthsJp = [
        "         1åé        ",
        "         2åé        ",
        "         3åé        ",
        "         4åé        ",
        "         5åé        ",
        "         6åé        ",
        "         7åé        ",
        "         8åé        ",
        "         9åé        ",
        "        10åé        ",
        "        11åé        ",
        "        12åé        "
      ],
      calendarOfGregorianReformation = [
        "       1  2 14 15 16",
        "17 18 19 20 21 22 23",
        "24 25 26 27 28 29 30"
      ],
      lastDatesOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      spanForFormat = "                    ",
      maxLineLengthForMonthlyCalendar = 8,
      maxColumnLengthForMonthlyCalendar = dayOfWeekEn.length,
      JAN = 0, FEB = 1, MAR = 2, APR = 3, MAY = 4, JUN = 5,
      JUL = 6, AUG = 7, SEP = 8, OCT = 9, NOV = 10, DEC = 11,
      SATURDAY = 6;
  
  function isLeapYear(year) {
    return year % 400 == 0 || (year % 100 != 0 && year % 4 == 0);
  }
  
  function getLastDateOfMonth(year, month) {
    return (month == 1 && isLeapYear(year)) ? 29 : lastDatesOfMonth[month]
  }
  
  this.getTodaysColumnPosition = function () { return todaysColumnPosition; };
  this.getTodaysLinePosition = function () { return todaysLinePosition; };
  
  function setTodaysPosition(line) {
    
    // set base position
    todaysColumnPosition = 0;
    todaysLinePosition = 2;
    
    // alias
    var offsetCol = maxColumnLengthForMonthlyCalendar;
    var offsetRow = maxLineLengthForMonthlyCalendar;
    
    // offset by month
    switch (today.getMonth()) {
      case JAN: todaysColumnPosition += 0;                   todaysLinePosition += 0; break;
      case FEB: todaysColumnPosition += (offsetCol + 2);     todaysLinePosition += 0; break;
      case MAR: todaysColumnPosition += (offsetCol + 2) * 2; todaysLinePosition += 0; break;
      case APR: todaysColumnPosition += 0;                   todaysLinePosition += offsetRow; break;
      case MAY: todaysColumnPosition += (offsetCol + 2);     todaysLinePosition += offsetRow; break;
      case JUN: todaysColumnPosition += (offsetCol + 2) * 2; todaysLinePosition += offsetRow; break;
      case JUL: todaysColumnPosition += 0;                   todaysLinePosition += offsetRow * 2; break;
      case AUG: todaysColumnPosition += (offsetCol + 2);     todaysLinePosition += offsetRow * 2; break;
      case SEP: todaysColumnPosition += (offsetCol + 2) * 2; todaysLinePosition += offsetRow * 2; break;
      case OCT: todaysColumnPosition += 0;                   todaysLinePosition += offsetRow * 3; break;
      case NOV: todaysColumnPosition += (offsetCol + 2);     todaysLinePosition += offsetRow * 3; break;
      case DEC: todaysColumnPosition += (offsetCol + 2) * 2; todaysLinePosition += offsetRow * 3; break;
    }
    
    // offset by date
    todaysColumnPosition += today.getDay() * 3;
    todaysLinePosition += line;
  }
  
  function isToday (other) {
    return today.getFullYear() == other.getFullYear() &&
           today.getMonth() == other.getMonth() &&
           today.getDate() == other.getDate();
  }
  
  function createMonthlyCalender(year, month, jpmode) {
    var ret = [];
    
    ret[0] = (jpmode) ? monthJp[month] : monthsEn[month];
    ret[1] = (jpmode) ? dayOfWeekJa : dayOfWeekEn;
    ret[2] = "";
    ret[3] = "";
    ret[4] = "";
    ret[5] = "";
    ret[6] = "";
    ret[7] = "";
    
    // consier the Gregorian reformation
    if (year == 1752 && month == 8) {
      ret[2] = calendarOfGregorianReformation[0];
      ret[3] = calendarOfGregorianReformation[1];
      ret[4] = calendarOfGregorianReformation[2];
      return ret;
    }
    
    // put all days of the month (line: 2-7)
    for (var date = 1, line = 2; date <= getLastDateOfMonth(year, month); date++) {
      
      ret[line] += (" " + date).slice(-2);
      
      var targetDate = new Date(year, month, date);
      
      if (isToday(targetDate)) { setTodaysPosition(line); }
      
      if (targetDate.getDay() < SATURDAY) {
        ret[line] +=  " ";
      } else {
        // when reached Saturday then go to next line
        ret[++line] = "";
      }
    }
    
    // format as calendar
    for (var line = 2; line < maxLineLengthForMonthlyCalendar; line++) {
      if (line == 2) {
        ret[line] = (spanForFormat + ret[line]).slice(-maxColumnLengthForMonthlyCalendar);
      } else {
        if (ret[line] == null) { ret[line] = ""; }
        ret[line] = (ret[line] + spanForFormat).slice(0, maxColumnLengthForMonthlyCalendar);
      }
    }
    
    return ret;
  }
  
  this.getData = function (year, jpmode) {
    
    if (isCalculationFinished) { return data; }
    
    var ret = [];
    var index = 0;
    
    ret[index++] = "                              " + year;
    ret[index++] = "";
    
    for (var i = 0; i < 12; i += 3) {
      var leftMonth   = createMonthlyCalender(year, i + 0, jpmode);
      var centerMonth = createMonthlyCalender(year, i + 1, jpmode);
      var rightMonth  = createMonthlyCalender(year, i + 2, jpmode);
      for (var j = 0; j < maxLineLengthForMonthlyCalendar; j++) {
        ret[index++] = leftMonth[j] + "  " + centerMonth[j]  + "  " + rightMonth[j];
      }
    }
    
    data = ret;
    isCalculationFinished = true;
    
    return ret;
  }
  
};
