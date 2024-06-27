// The formula below takes the data from the Schedules page and transforms the data so that
// students' schedules are on one row.
// A trigger needs to be set so that it runs everytime new data is added to Schedules.
function transformData() {
  const _ = LodashGS.load();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const outputSheet = spreadsheet.getSheetByName('Lodash Output');

  // Get the last row with content in the sheet
  let lastRow = outputSheet.getLastRow();
  
  // Clear content in outputSheet from row 2 to the last row
  if (lastRow > 1) {
    outputSheet.getRange(2, 1, lastRow - 1, outputSheet.getLastColumn()).clearContent();
  }
  
  const schedulesSheet = spreadsheet.getSheetByName('Schedules');
  const tentativeSheet = spreadsheet.getSheetByName('TENTATIVE');

  // Get data from sheets
  const schedulesData = schedulesSheet.getDataRange().getValues().slice(1); // Exclude header
  const tentativeData = tentativeSheet.getDataRange().getValues().slice(1); // Exclude header

  // Group schedulesData by student ID
  var groupedData = _.groupBy(schedulesData, function(row) {
    return row[2]; // Student ID is at index 2 in schedulesData
  });

  // Transform grouped data into desired format
  var transformedData = _.map(groupedData, function(courses, studentId) {
    // Extract student grade from the first course entry
    var studentGrade = courses[0][0]; // Assuming student grade is at index 0 in schedulesData
    
    // Extract student name from the second course entry
    var studentName = courses[0][1]; // Assuming student name is at index 1 in schedulesData

    // Initialize an array to hold student ID, name, and grade
    var studentRow = [studentId, studentName, studentGrade]; // Add student ID, name, and grade

    // Initialize an array to store courses and teachers for each period (0 through 9)
    var periods = new Array(10).fill(null).map(() => ['', '', '', '', '', '']); // Initialize 10 periods with 6 empty values

    // Iterate over courses for the student so that it puts the periods in the right order from zero to 9
    _.forEach(courses, function(course) {
      var period = course[5]; // Assuming period is at index 5 in schedulesData
      var courseCode = course[7]; // Assuming course code is at index 7 in schedulesData
      var teacher = course[13]; // Assuming teacher is at index 13 in schedulesData

      // Store course code and teacher in the corresponding period slot
      if (periods[period]) {
        periods[period][0] = courseCode;
        periods[period][1] = teacher;
      }
    });

    // Flatten periods array and push to studentRow
    _.forEach(periods, function(periodData) {
      studentRow.push(...periodData);
    });

    return studentRow;
  });

  // Write transformedData to outputSheet starting from row 2
  for (var j = 0; j < transformedData.length; j++) {
    // Write student name (studentRow[1]) to 2nd column (column B)
    outputSheet.getRange(j + 2, 2).setValue(transformedData[j][1]);

    // Write student ID (studentRow[0]) to 3rd column (column C)
    outputSheet.getRange(j + 2, 3).setValue(transformedData[j][0]);

    // Write student grade (studentRow[2]) to 4th column (column D)
    outputSheet.getRange(j + 2, 4).setValue(transformedData[j][2]);

    // Write courses and teachers starting from 5th column (column E)
    for (var k = 3; k < transformedData[j].length; k++) {
      outputSheet.getRange(j + 2, k + 2).setValue(transformedData[j][k]);
    }
  }
}

