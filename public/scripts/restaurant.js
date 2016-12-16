// arrays
var tables = [];
var employees = [];

$(document).ready(function() {
    getTablesAndServers();
    $(document).on('change', 'select', employeeChanged);
    $(document).on('click', '.status', statusChanged);
}); // end .status click

function statusChanged() {
    // If a table's status is changed, get the new status and update the
    // database
    console.log('status button clicked');
    var status = cycleStatus($(this).text());
    var tableID = $(this).closest('p').data('id');
    var employeeID = $(this).siblings('select').val();
    var objectToSend = {
        id: tableID,
        status: status,
        employee_id: employeeID
    }; // end objectToSend
    console.log(objectToSend);
    updateTable(objectToSend);
}

function employeeChanged() {
    // If a table's employee is changed, update the database
    console.log('changed a wait staff');
    var tableID = $(this).closest('p').data('id');
    var status = $(this).siblings('button').text();
    var employeeID = $(this).val();
    var objectToSend = {
        id: tableID,
        status: status,
        employee_id: employeeID
    }; // end objectToSend
    updateTable(objectToSend);
}

function updateTable(objectToSend) {
    // Puts a table to the server to update the DB
    $.ajax({
        url: '/tables',
        type: 'PUT',
        data: objectToSend,
        success: function(response) {
                console.log(response);
                getTablesAndServers();
            } // end success
    }); // end ajax
} // end updateTable

function validateServerInputs() {
    // Reset input classes and get values
    var firstName = $('#employeeFirstNameIn').removeClass('bad-input').val();
    var lastName = $('#employeeLastNameIn').removeClass('bad-input').val();
    if (firstName === '') {
        // Highlight first input if no value
        $('#employeeFirstNameIn').addClass('bad-input');
    }
    if (lastName === '') {
        // Highlight second input if no value
        $('#employeeLastNameIn').addClass('bad-input');
    }
    // Only return true if neither input is blank
    return firstName !== '' && lastName !== '';
}

function getTablesAndServers() {
    console.log('Getting info');
    $.ajax({
        url: '/combined',
        type: 'GET',
        success: function(response) {
                console.log(response);
                displayEmployees(response.employees);
                displayTables(response.tables, response.employees);
            } // end success
    }); // end ajax
} // end getTablesAndServers

var createEmployee = function() {
    console.log('in createEmployee');
    // get user input
    var employeeFirstName = $('#employeeFirstNameIn').val();
    var employeeLastName = $('#employeeLastNameIn').val();
    // Check if inputs have valid values and only POST to server if true
    if (validateServerInputs()) {
        // POST AJAX to server
        $.ajax({
            type: 'POST',
            url: '/employees',
            data: {
                first_name: employeeFirstName,
                last_name: employeeLastName
            }, // end object
            success: function(response) {
                console.log(response);
                //clear input values
                $('#employeeFirstName').val('');
                $('#employeeLastName').val('');
                // Display updated info
                getTablesAndServers();
            }, // end success
            error: function(err) {
                    console.log(err);
                } // end error
        }); // end ajax
    } // end if
}; // end createEmployee

var createTable = function() {
    console.log('in createTable');
    // get user input
    var tableName = document.getElementById('nameIn').value;
    var tableCapacity = document.getElementById('capacityIn').value;
    //validate user input for blanks
    if (tableName === "") {
        $('#nameIn').addClass('bad-input');
    } else {
        $('#nameIn').removeClass('bad-input');
        // table object for new table
        $.ajax({
            type: 'POST',
            url: '/tables',
            data: {
                name: tableName,
                capacity: tableCapacity
            }, // end object
            success: function(response) {
                    console.log(response);
                    // clear input value
                    $('#nameIn').val('');
                    $('#capacityIn').val('');
                    getTablesAndServers();
                } // end success
        }); // end ajax
    } // end else
}; // end createTable

var cycleStatus = function(status) {
    console.log('in cycleStatus: status when clicked:' + status);
    // move table status to next status
    switch (status) {
        case 'empty':
            return 'seated';
        case 'seated':
            return 'served';
        case 'served':
            return 'dirty';
        case 'dirty':
            return 'empty';
        default:
            return 'empty';
    } // end switch
}; // end cycleStatus

function displayEmployees(employeeArray) {
    // Displays employees in an unordered list
    var htmlString = '<ul>';
    // Iterate through employees
    for (var i = 0; i < employeeArray.length; i++) {
        // Grab the current employee
        var emp = employeeArray[i];
        // and build their list item
        htmlString += '<li>' + emp.first_name + ' ' + emp.last_name + ', id: ' + emp.id + '</li>';
    } // end for
    htmlString += '</ul>';
    // Add to the DOM
    $('#employeesOutput').html(htmlString);
} // end displayEmployees

function displayTables(tableArray, employeeArray) {
    // Displays tables on the DOM with a status button and a employee drop down
    // Clear the current table info
    $('#tablesOutput').html('');
    // Create the select box to use for each table
    var selectText = '<select class="form-control current-tables"><option disabled >Choose A Server</option>';
    for (var i = 0; i < employeeArray.length; i++) {
        selectText += '<option value="' + employeeArray[i].id + '">';
        selectText += employeeArray[i].first_name + ' ';
        selectText += employeeArray[i].last_name + '</option>';
    } // end for
    selectText += '</select>';
    // Iterate through tables
    for (i = 0; i < tableArray.length; i++) {
        // Get the current table
        var table = tableArray[i];
        var htmlString = '<p id="table-' + table.id + '" data-id="' + table.id + '" class="text-center">' + table.name + ' - capacity: ' + table.capacity;
        htmlString += ', server: ' + selectText + ', status: <button class="status btn btn-primary" type="button">';
        htmlString += table.status + '</button>';
        $('#tablesOutput').append(htmlString);
        $('#table-' + table.id).find('select').val(table.employee_id);
    } // end for
} // end displayTables
