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
function updateRecord(formData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Lodash Output');
  const data = sheet.getDataRange().getValues();

  // Find the row to update based on the Index
  for (var i = 1; i < data.length; i++) {   // Start from 1 assuming header row
    if (data[i][0] == formData.id) {    // ID is in the 3rd column of Lodash Output
      sheet.getRange(i + 1, 7).setValue(formData.trnfrGrd); // +1 to adjust for header row
      sheet.getRange(i + 1, 8).setValue(formData.currGrd); // figure out how to put it in the right cell
      sheet.getRange(i + 1, 9).setValue(formData.growth); // figure out how to put it in the right cell
      sheet.getRange(i + 1, 10).setValue(formData.progress); // figure out how to put it in the right cell
      break;
    }
  }
// return fetchInitialData();  // Return updated data after modification
}

// // Function to delete a record based on ID
// function deleteRecord(id) {
//   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Lodash Output');
//   const data = sheet.getDataRange().getValues();

//   // Find the row to delete based on ID
//   for (var i = 1; i < data.length; i++) {   // Start from 1 assuming header row
//     if (data[i][0] == id) {    // Assuming ID is in the first column
//       sheet.deleteRow(i + 1);    // +1 to adjust for header row
//       break;
//     }
//   }

// return fetchInitialData();  // Return updated data after deletion
// }
