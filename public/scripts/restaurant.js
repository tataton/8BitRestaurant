// arrays
var tables = [];
var employees = [];

$(document).ready(function() {
    getInfo();
});

function getInfo() {
    console.log('Getting info');
    $.ajax({
        url: '/combined',
        type: 'GET',
        success: function(response) {
            console.log(response);
            displayOnDOM(response);
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
    var newTable = {
        'name': tableName,
        'capacity': tableCapacity,
        'server': -1,
        'status': 'empty'
    };
    // push new obejct into tables array
    tables.push(newTable);
    console.log('added table: ' + newTable.name);
    // update output
    listTables();
}; // end createTable

var cycleStatus = function(index) {
    console.log('in cycleStatus: ' + index);
    // move table status to next status
    switch (tables[index].status) {
        case 'empty':
            tables[index].status = 'seated';
            break;
        case 'seated':
            tables[index].status = 'served';
            break;
        case 'served':
            tables[index].status = 'dirty';
            break;
        case 'dirty':
        default:
            tables[index].status = 'empty';
    }
    // show tables on DOM
    listTables();
}; // end cycleStatus

var listEmployees = function() {
    console.log('in listEmployees', employees);
    document.getElementById('employeesOutput').innerHTML = '<ul>';
    // loop through the tables array and display each table
    for (i = 0; i < employees.length; i++) {
        var line = employees[i].firstName + " " + employees[i].lastName + ', id: ' + i;
        // add line to output div
        document.getElementById('employeesOutput').innerHTML += '<li>' + line + '</li>';
    }
    document.getElementById('employeesOutput').innerHTML += '</ul>';
    // update tables display
    listTables();
}; // end listEmployees

var listTables = function() {
    console.log("in listTables");
    // target our output div
    document.getElementById('tablesOutput').innerHTML = '';
    // loop through the tables array and display each table

    // select to assign a server to this table
    var selectText = '<select>';
    for (var i = 0; i < employees.length; i++) {
        selectText += '<option value=' + i + '>' + employees[i].firstName + ' ' + employees[i].lastName + '</option>';
    }
    selectText += '</select>';
    // display employees
    for (i = 0; i < tables.length; i++) {
        // status is a button that, when clicked runs cycleStatus for this table
        var line = tables[i].name + " - capacity: " + tables[i].capacity + ', server: ' + selectText + ', status: <button onClick="cycleStatus(' + i + ')">' + tables[i].status + "</button>";
        // add line to output div
        document.getElementById('tablesOutput').innerHTML += '<p>' + line + '</p>';
    }
}; // end listTables

function displayOnDOM(dataObject) {
    displayEmployees(dataObject.employees);
    displayTables(dataObject.tables, dataObject.employees);
}

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
    var selectText = '<select>';
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
        var htmlString = '<p>' + table.name + ' - capacity: ' + table.capacity;
        htmlString += ', server: ' + selectText + ', status: <button>';
        htmlString += table.status + '</button>';
        $('#tablesOutput').append(htmlString);
    }
}
