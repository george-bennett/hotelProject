/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var newId = 0;
var totalCost = 0;

//submit button 
function checkAvailability() {
    saveForm();
    var storedData = getObject('form1Data');
    if (storedData.checkin === "" || storedData.checkout === "") {
        alert("please enter dates");
    } else {
        availForm('http://localhost:8081/avail_form', storedData);
    }
}
;

//saves data locally to browser storage
function saveForm() {
    var form1Data = {};
    form1Data.checkin = $('#startingDate').val();
    form1Data.checkout = $('#endingDate').val();
    form1Data.nights = ((new Date($('#endingDate').val())) - (new Date($('#startingDate').val()))) / 86400000;
    setObject('form1Data', form1Data);
}
;

// submit data for storage by using AJAX (to be implemented) 
function availForm(path, data) {
    // convert the parameters to a JSON data string
    var json = JSON.stringify(data);
    console.log(json);
    $.ajax({
        url: path,
        type: "POST",
        data: json,
        success: function (rt) {
            console.log("success");
            var json = JSON.parse(rt);

            var supreme_double = 0;
            var supreme_twin = 0;
            var standard_double = 0;
            var standard_twin = 0;

            var sup_d_data = {};
            var sup_d_room_numbers = [];
            var sup_t_data = {};
            var sup_t_room_numbers = [];
            var std_d_data = {};
            var std_d_room_numbers = [];
            var std_t_data = {};
            var std_t_room_numbers = [];

            for (i in json) {
                switch (json[i].r_class) {
                    case 'sup_d':
                        supreme_double++;
                        sup_d_room_numbers.push(json[i].r_no);
                        break;
                    case 'sup_t':
                        supreme_twin++;
                        sup_t_room_numbers.push(json[i].r_no);
                        break;
                    case 'std_d':
                        standard_double++;
                        std_d_room_numbers.push(json[i].r_no);
                        break;
                    case 'std_t':
                        standard_twin++;
                        std_t_room_numbers.push(json[i].r_no);
                        break;
                }
            }

            sup_d_data.numberOfRooms = supreme_double;
            sup_d_data.pricePerNight = 77;
            sup_d_data.roomNumbers = sup_d_room_numbers;
            if (sup_d_data.numberOfRooms > 0) {
                var nights = getObject("form1Data").nights;
                $('#sup_d_price').append("£" + (sup_d_data.pricePerNight * nights));
                $('#sup_d_ppn').append("£" + sup_d_data.pricePerNight + "/ppn");
            } else {
                $('#sup_d_price').append(" Not available during these dates ");
                $('#sup_d_ppn').append(" - ");
                $('#sup_d_button').hide();
            }
            setObject('sup_d', sup_d_data);

            sup_t_data.numberOfRooms = supreme_twin;
            sup_t_data.pricePerNight = 75;
            sup_t_data.roomNumbers = sup_t_room_numbers;
            if (sup_t_data.numberOfRooms > 0) {
                var nights = getObject("form1Data").nights;
                $('#sup_t_price').append("£" + (sup_t_data.pricePerNight * nights));
                $('#sup_t_ppn').append("£" + sup_t_data.pricePerNight + "/ppn");
            } else {
                $('#sup_t_price').append(" Not available during these dates ");
                $('#sup_t_ppn').append(" - ");
                $('#sup_t_button').hide();
            }
            setObject('sup_t', sup_t_data);

            std_d_data.numberOfRooms = standard_double;
            std_d_data.pricePerNight = 65;
            std_d_data.roomNumbers = std_d_room_numbers;
            if (std_d_data.numberOfRooms > 0) {
                var nights = getObject("form1Data").nights;
                $('#std_d_price').append("£" + (std_d_data.pricePerNight * nights));
                $('#std_d_ppn').append("£" + std_d_data.pricePerNight + "/ppn");
            } else {
                $('#std_d_price').append(" Not available during these dates ");
                $('#std_d_ppn').append(" - ");
                $('#std_d_button').hide();
            }
            setObject('std_d', std_d_data);

            std_t_data.numberOfRooms = standard_twin;
            std_t_data.pricePerNight = 62;
            std_t_data.roomNumbers = std_t_room_numbers;
            if (std_t_data.numberOfRooms > 0) {
                var nights = getObject("form1Data").nights;
                $('#std_t_price').append("£" + (std_t_data.pricePerNight * nights));
                $('#std_t_ppn').append("£" + std_t_data.pricePerNight + "/ppn");
            } else {
                $('#std_t_price').append(" Not available during these dates ");
                $('#std_t_ppn').append(" - ");
                $('#std_t_button').hide();
            }
            setObject('std_t', std_t_data);

            $('#availableRooms').collapse('show');
        },
        error: function () {
            console.log("error");
            alert("error");
        }
    });
}
;


function submitPayment() {
    var paymentData = {};
    //customerData.c_name = $('#c_name');
    //customerData.c_email = $('#c_email');
    //customerData.c_address=$('#addr_line') + ", " + $('#city') + ", " + $('#postcode');
    //customerData.c_cardtype=$('#c_cardtype');
    //customerData.c_cardexp=$('#c_cardexp');
    //customerData.c_cardno=$('#c_cardno');
    paymentData.c_name = "fred flintstone";
    paymentData.c_email = "bigstone@gmail.com";
    paymentData.c_address = "seriously stoney house, stonesville sv69 3bd";
    paymentData.c_cardtype = "V";
    paymentData.c_cardexp = "12/19";
    paymentData.c_cardno = 1234567890123456;
    paymentData.bookings = [];
    for (var key in sessionStorage) {
        if (key.includes("roomBooking")) {
            var newBooking = {};

            newBooking.checkin = getObject(key).checkin;
            newBooking.checkout = getObject(key).checkout;
            newBooking.b_cost = getObject(key).cost;
            newBooking.r_no = getObject(key).roomNo;
            paymentData.bookings.push(newBooking);
        }
    }

    console.log(paymentData);
    paymentForm('http://localhost:8081/submit_form', paymentData);
}
;
// submit payment details
function paymentForm(path, data) {
    // convert the parameters to a JSON data string
    var json = JSON.stringify(data);
    console.log(json);
    $.ajax({
        url: path,
        type: "POST",
        data: json,
        success: function (rt) {
            console.log("success");
            var json = JSON.parse(rt);


        },
        error: function () {
            console.log("error");
            alert("error");
        }
    });
}
function addRoom(room_type) {
    newId++;
    var objectKey = "roomBooking" + newId;
    var bookingData = {};
    bookingData.r_class = room_type;
    bookingData.checkin = getObject('form1Data').checkin;
    bookingData.checkout = getObject('form1Data').checkout;
    bookingData.nights = getObject('form1Data').nights;
    bookingData.cost = (getObject('form1Data').nights) * (getObject(room_type).pricePerNight);
    
    bookingData.roomNo = getObject(room_type).roomNumbers[0];
    var new_var = getObject(room_type);
    new_var.roomNumbers.shift();
    setObject(room_type, new_var);
    
    setObject(objectKey, bookingData);

    var r_type = getObject(room_type);
    var r_class_total = r_type.numberOfRooms - 1;
    if (r_class_total > 0) {
        var nights = getObject("form1Data").nights;
        $('#'+room_type+'_price').empty();
        $('#'+room_type+'_ppn').empty();
        $('#'+room_type+'_price').append("£" + (r_type.pricePerNight * nights));
        $('#'+room_type+'_ppn').append("£" + r_type.pricePerNight + "/ppn");
        $('#'+room_type+'_button').show();
    } else {
        $('#'+room_type+'_price').empty();
        $('#'+room_type+'_ppn').empty();
        $('#'+room_type+'_price').append(" Not available during these dates ");
        $('#'+room_type+'_ppn').append(" - ");
        $('#'+room_type+'_button').hide();
    }


    r_type.numberOfRooms = r_class_total;
    setObject(room_type, r_type);
    var typeOfRoom = "";
    switch (room_type) {
        case 'sup_d':
            typeOfRoom = "Supreme Double";
            break;
        case 'sup_t':
            typeOfRoom = "Supreme Twin";
            break;
        case 'std_d':
            typeOfRoom = "Standard Double";
            break;
        case 'std_t':
            typeOfRoom = "Standard Twin";
            break;
    }
    //$('#basket_content').append("<div id='" + objectKey + "'>" + room_type + '<button type="button" onclick="removeFromBasket(\'' + objectKey + '\')">Remove</button>' + "total cost is - " + bookingData.nights * (r_type.pricePerNight) + "</div>");
    $('#basket_content').append('<div id="' + objectKey + '"class="row"><div class="well well-sm"><div class="row"><div class="col-md-3"> ' + typeOfRoom + ' </div><div class="col-md-2">From - ' + bookingData.checkin + '</div><div class="col-md-2">Until - ' + bookingData.checkout + '</div><div class="col-md-2">Cost - ' + bookingData.nights * (r_type.pricePerNight) + '</div><div class="col-md-2"><button class="btn" onclick="removeFromBasket(\''+ objectKey + '\')">Remove</button></div></div></div></div>');
    $('#basket').collapse('show');
    totalCost += bookingData.nights * (r_type.pricePerNight);
    $('#pay_p').empty();
    $('#pay_p').append();


}

function removeFromBasket(id) {
    var r_class = getObject(id).r_class;
    var room = getObject(r_class);
    var r_class_total = room.numberOfRooms + 1;

    var new_var = getObject(r_class);
    new_var.roomNumbers.push(getObject(id).roomNo);
    $('#' + r_class + '_p').empty();
    if (r_class_total > 0) {
        var nights = getObject("form1Data").nights;
        $('#'+r_class+'_price').empty();
        $('#'+r_class+'_ppn').empty();
        $('#'+r_class+'_price').append("£" + (new_var.pricePerNight * nights));
        $('#'+r_class+'_ppn').append("£" + new_var.pricePerNight + "/ppn");
        $('#'+r_class+'_button').show();
    } else {
        $('#'+r_class+'_price').empty();
        $('#'+r_class+'_ppn').empty();
        $('#'+r_class+'_price').append(" Not available during these dates ");
        $('#'+r_class+'_ppn').append(" - ");
        $('#'+r_class+'_button').hide();
    }
    new_var.numberOfRooms = r_class_total;
    setObject(r_class, new_var);
    $('#' + id).remove();
    clearObject(id);

    var close = 0;
    for (var key in sessionStorage) {
        if (key.includes("roomBooking")) {
            close++;
        }
    }
    if (close == 0) {
        $('#basket').collapse('hide');
    }
}

function payNow() {
    $('#payment').collapse('show');
}
/*
 function navBarClicked(id) {
 console.log(id);
 console.log(getObject('currentPage'));
 if (id != getObject('currentPage')) {
 console.log("not the same");
 hidingCurrentPage();
 showingNewPage(id);
 setObject('currentPage', id);
 } else {
 console.log("same")
 }
 }
 
 function hidingCurrentPage(id){
 $('#' + getObject('currentPage')).collapse('hide');
 }
 
 function showingNewPage(id){
 $('#' + id).collapse('show');
 }
 */
function navBarClicked(id) {
    $('.thing_to_collapse').collapse('hide');
    $('#navbar').collapse('hide');
    $('#' + id).collapse('show');
}