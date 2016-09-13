/* cal.js */

var Calendar = function() {
  var data = null,
      data2 = null,
      isCalculationFinished = false,
      isCalculationFinished2 = false,
      today = new Date(),
      todaysColumnPosition,
      todaysLinePosition,
      dayOfWeekEn = "Su Mo Tu We Th Fr Sa",
      dayOfWeekJa = "日  月  火  水  木  金  土 ",
      monthsEn = [
        "      January       ", "      February      ", "       March        ",
        "       April        ", "        May         ", "        June        ",
        "        July        ", "       August       ", "     September      ",
        "      October       ", "      November      ", "      December      "
      ],
      monthsWithYearEn = [
        "    January ", "    February ", "     March ",
        "     April ", "      May ", "      June ",
        "      July ", "     August ", "   September ",
        "    October ", "    November ", "    December "
      ],
      monthsJp = [
        "         1月         ", "         2月         ", "         3月         ",
        "         4月         ", "         5月         ", "         6月         ",
        "         7月         ", "         8月         ", "         9月         ",
        "        10月         ", "        11月         ", "        12月         "
      ],
      monthsWithYearJp = [
        "      1月  ", "      2月  ", "      3月  ",
        "      4月  ", "      5月  ", "      6月  ",
        "      7月  ", "      8月  ", "      9月  ",
        "     10月  ", "     11月  ", "     12月  "
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
  
  function setTodaysPositionForMonthlyMode(line, threeMonthMode) {
    todaysColumnPosition = today.getDay() * 3;
    todaysLinePosition = line;
  }
  
  function setTodaysPositionForAnnualMode(line) {
    
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
  
  function createMonthlyCalender(year, month, withYear, jpmode) {
    var ret = [];
    
    ret[0] = withYear ? jpmode ? monthsWithYearJp[month] + year
                               : monthsWithYearEn[month] + year
                      : jpmode ? monthsJp[month] : monthsEn[month];
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
    
    // input all days of the month (line: 2-7)
    for (var date = 1, line = 2; date <= getLastDateOfMonth(year, month); date++) {
      
      ret[line] += (" " + date).slice(-2);
      
      var targetDate = new Date(year, month, date);
      
      if (isToday(targetDate)) {
        if (withYear) { setTodaysPositionForMonthlyMode(line); }
        else { setTodaysPositionForAnnualMode(line); }
      }
      
      if (targetDate.getDay() < SATURDAY) {
        ret[line] +=  " ";
      } else {
        // when reached Saturday then go to next line
        ret[++line] = "";
      }
    }
    
    // format as calendar
    for (var line = 0; line < maxLineLengthForMonthlyCalendar; line++) {
      if (line == 2) {
        ret[line] = (spanForFormat + ret[line]).slice(-maxColumnLengthForMonthlyCalendar);
      } else {
        if (ret[line] == null) { ret[line] = ""; }
        ret[line] = (ret[line] + spanForFormat).slice(0, maxColumnLengthForMonthlyCalendar);
      }
    }
    
    return ret;
  }
  
  this.getAnnualData = function (year, jpmode) {
    
    if (isCalculationFinished) { return data; }
    
    var ret = [];
    var index = 0;
    
    ret[index++] = "                              " + year;
    ret[index++] = "";
    
    for (var i = 0; i < 12; i += 3) {
      var leftMonth   = createMonthlyCalender(year, i + 0, false, jpmode);
      var centerMonth = createMonthlyCalender(year, i + 1, false, jpmode);
      var rightMonth  = createMonthlyCalender(year, i + 2, false, jpmode);
      for (var j = 0; j < maxLineLengthForMonthlyCalendar; j++) {
        ret[index++] = leftMonth[j] + "  " + centerMonth[j]  + "  " + rightMonth[j];
      }
    }
    
    data = ret;
    isCalculationFinished = true;
    
    return ret;
  }
  
  this.get3MonthsData = function (jpmode) {
    
    if (isCalculationFinished) { return data; }
    
    var thisYear = today.getFullYear();
    var thisMonth = today.getMonth();
    var lastMonth = today.getMonth() - 1;
    var nextMonth = today.getMonth() + 1;
    
    var leftMonth = (lastMonth >= 0) ? createMonthlyCalender(thisYear, lastMonth, true, jpmode)
                                     : createMonthlyCalender(thisYear-1, 11, true, jpmode);
    
    var centerMonth = createMonthlyCalender(thisYear, thisMonth, true, jpmode);
    
    var rightMonth  = (nextMonth <= 11) ? createMonthlyCalender(thisYear, nextMonth, true, jpmode)
                                        : createMonthlyCalender(thisYear+1, 0, true, jpmode);
    
    var ret = [];
    for (var i = 0; i < maxLineLengthForMonthlyCalendar; i++) {
      ret[i] = leftMonth[i] + "  " + centerMonth[i]  + "  " + rightMonth[i];
    }
    
    // move today's position to center
    todaysColumnPosition += maxColumnLengthForMonthlyCalendar + 2;
    
    data = ret;
    isCalculationFinished = true;
    
    return ret;
  }
  
  this.get1MonthData = function (year, month, jpmode, dataSlot) {
    
    if (dataSlot == 1 && isCalculationFinished) { return data; }
    if (dataSlot == 2 && isCalculationFinished2) { return data2; }
    
    var ret = createMonthlyCalender(year, month, true, jpmode);
    
    if (dataSlot == 1) { data = ret; }
    if (dataSlot == 2) { data2 = ret; }
    
    return ret;
  }
};
