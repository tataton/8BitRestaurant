// arrays
var tables = [];
var employees = [];

$(document).ready(function() {
    getTablesAndServers();
    $(document).on('change', 'select', function() {
        console.log('changed a wait staff');
        var tableID = $(this).closest('p').data('id');
        var status = $(this).siblings('button').text();
        var employeeID = $(this).val();
        var objectToSend = {
            id: tableID,
            status: status,
            employee_id: employeeID
        };
        updateTable(objectToSend);
    });
    $(document).on('click', '.status', function() {
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
    }); // end .status
});

function updateTable(objectToSend) {
    $.ajax({
        url: '/tables',
        type: 'PUT',
        data: objectToSend,
        success: function(response) {
            console.log(response);
            getTablesAndServers();
        }
    });
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
        }
    });
}

var createEmployee = function() {
    console.log('in createEmployee');
    // get user input
    var employeeFirstName = $('#employeeFirstNameIn').val();
    var employeeLastName = $('#employeeLastNameIn').val();
    //ajax
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
            getTablesAndServers();
        }, // end success
        error: function(err) {
                console.log(err);
            } // end error
    }); // end ajax


    // update display
    listEmployees();
}; // end createEmployee

var createTable = function() {
    console.log('in createTable');
    // get user input
    var tableName = document.getElementById('nameIn').value;
    var tableCapacity = document.getElementById('capacityIn').value;
    // table object for new table
    $.ajax({
        type: 'POST',
        url: '/tables',
        data: {
            name: tableName,
            capacity: tableCapacity
        }, // end object
        success: function(response){
            console.log(response);
            // clear input value
            $('#nameIn').val('');
            $('#capacityIn').val('');
            getTablesAndServers();
        }
    });
}; // end createTable

var cycleStatus = function(status) {
    console.log('in cycleStatus: status when clicked:' + status);
    // move table status to next status
    switch (status) {
        case 'empty':
            return'seated';
        case 'seated':
            return 'served';
        case 'served':
            return 'dirty';
        case 'dirty':
            return 'empty';
        default:
            return 'empty';
    }
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
    }
    htmlString += '</ul>';
    // Add to the DOM
    $('#employeesOutput').html(htmlString);
}

function displayTables(tableArray, employeeArray) {
    // Displays tables on the DOM with a status button and a employee drop down
    // Clear the current table info
    $('#tablesOutput').html('');
    // Create the select box to use for each table
    var selectText = '<select><option disabled >Choose A Server</option>';
    for (var i = 0; i < employeeArray.length; i++) {
        selectText += '<option value="' + employeeArray[i].id + '">';
        selectText += employeeArray[i].first_name + ' ';
        selectText += employeeArray[i].last_name + '</option>';
    }
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
    }
}
