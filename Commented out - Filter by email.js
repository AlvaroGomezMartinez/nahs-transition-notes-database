// The functions below get the user's email then filters and returns the
// rows that have their name in the teacher columns of the Lodash Output sheet.
// function getEmailAndSendTable() {
//   try {
//     // Define mapping of userEmails to names
//     const userEmails = {
//       'alvaro.gomez2011@gmail.com': 'Gomez, Alvaro',
//       // Add more mappings for the rest of the teachers at NAHS
//       // Add a mapping for administrators so that they see all of the names
//     };

//     // Retrieve the user's email
//     var userEmail = Session.getActiveUser().getEmail();
  
//     // Access the sheet and get data
//     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Lodash Output');
//     const range = sheet.getDataRange();
//     const data = range.getValues();

//     // Filter rows where userEmail matches cellValue in the mapping object
//     var results = _.filter(data, function(row) {
//       for (var colIndex = 0; colIndex < 60; colIndex++) { // Adjust column range as needed
//         var cellValue = row[colIndex];
//         // Check if cellValue exists in userEmails object
//         if (userEmails.hasOwnProperty(userEmail) && cellValue === userEmails[userEmail]) {
//           return true;
//         }
//       }
//       return false;
//     });

//     // Create HTML table from results for the email
//     var htmlTable = '<html><body><table style="border-collapse: collapse;" border="1">';
//     // Table header
//     htmlTable += '<tr><th>Name</th><th>ID</th><th>Grade</th></tr>'; // Adjust headers as per your data

//     // Table rows
//     results.forEach(function(row) {
//       htmlTable += '<tr>';
//       // Assuming row structure, adjust indexes accordingly
//       htmlTable += '<td>' + row[0] + '</td>'; // ID
//       htmlTable += '<td>' + row[1] + '</td>'; // Name
//       htmlTable += '<td>' + row[2] + '</td>'; // Grade
//       htmlTable += '<td>' + row[3] + '</td>'; // Action
//       htmlTable += '</tr>';
//     });

//     htmlTable += '</table></body></html>';

//     // Send email with HTML table
//     var subject = 'Matching Rows Table';
//     var recipient = userEmail; // Replace with teacher's email address
//     var body = 'Dear Teacher,<br><br>Please find below the matching rows:<br><br>' + htmlTable;

//     MailApp.sendEmail({
//       to: recipient,
//       subject: subject,
//       htmlBody: body
//     });

//     Logger.log('Email sent successfully.');

//   } catch (error) {
//     Logger.log('Error: ' + error.message);
//   }
// }
