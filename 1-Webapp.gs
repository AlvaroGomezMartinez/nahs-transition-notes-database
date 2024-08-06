// Define the doGet function to create the web app interface
function doGet() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('1-Index')
    .setTitle('NAHS Transition Input')
  return htmlOutput;
}

// Function to fetch initial data and filter based on user's email
function fetchInitialData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Lodash Output');
  const range = sheet.getDataRange();
  const data = range.getValues();

  // Filter logic based on user's email
  const userEmail = Session.getActiveUser().getEmail();
  const userEmails = {
    'alvaro.gomez2011@gmail.com': 'Gomez, Alvaro'
      // Add more mappings for the rest of the teachers at NAHS
      // Add a mapping for administrators so that they see all of the names
  };

  // Filter rows where userEmail matches cellValue in the mapping object
  var filteredResults = data.filter(function(row) {
    for (var colIndex = 0; colIndex < row.length; colIndex++) {
      var cellValue = row[colIndex];
      if (userEmails.hasOwnProperty(userEmail) && cellValue === userEmails[userEmail]) {
        return true;
      }
    }
    return false;
  });

  // Function to get data from the four indexes following the matched name
  function getDataFollowingName(filteredResults, userEmail) {
    const userName = userEmails[userEmail];
    const results = [];

    filteredResults.forEach(row => {
      row.forEach((cell, index) => {
        if (cell === userName) {
          // Get the data from the first four columns (indexes 0, 1, 2, and 3)
          const initialData = row.slice(0, 4);
          // Get the value before the matched name
          const valueBefore = index > 0 ? row[index - 1] : null;
          // Get the data from the four indexes following the matched name
          const dataFollowing = row.slice(index + 1, index + 5);
          // Flatten the results and add them to the final results array
          const combinedData = initialData.concat(valueBefore).concat(dataFollowing);
          results.push(combinedData);
        } 
      });
    });
  
    return results;
  }

  // Get the data following the matched name
  const dataFollowingName = getDataFollowingName(filteredResults, userEmail);
  Logger.log(dataFollowingName);
  return dataFollowingName;
}

// Function to update an existing record
function updateOpenedRecord(formData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Lodash Output');
  const data = sheet.getDataRange().getValues();

  const userEmail = Session.getActiveUser().getEmail();
  const userEmails = {
    'alvaro.gomez2011@gmail.com': 'Gomez, Alvaro'
    // Add more mappings for the rest of the teachers at NAHS
    // Add a mapping for administrators so that they see all of the names
  };

  const courseColumns = [4, 10, 16, 22, 28, 34, 40, 46, 52, 58];

  data.forEach(function(row, rowIndex) {
    if (formData.index == rowIndex) {
      if (userEmails.hasOwnProperty(userEmail) && row.includes(userEmails[userEmail])) {
        for (var i = 0; i < courseColumns.length; i++) {
          var courseIndex = courseColumns[i];
          if (row[courseIndex] === formData.course && (courseIndex + 4) < row.length) {
            row[courseIndex + 2] = formData.trnfrGrd;
            row[courseIndex + 3] = formData.currGrd;
            row[courseIndex + 4] = formData.growth;
            row[courseIndex + 5] = formData.progress;
            sheet.getRange(rowIndex + 1, 1, 1, row.length).setValues([row]);
            break;
          }
        }
      }
    }
  });
}
