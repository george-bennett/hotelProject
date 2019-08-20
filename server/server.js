var http = require('http');
// the quick and dirty trick which prevents crashing.
        process.on('uncaughtException', function (err) {
        console.error(err);
                console.log("Node NOT Exiting...");
        });
        http.createServer(function (req, res) {
        console.log(req.url)
                console.log(req.method)

                // Website you wish to allow to connect
                // add this line to address the cross-domain XHR issue.
                res.setHeader('Access-Control-Allow-Origin', '*');
                switch (req.url) {
        case '/avail_form':
                if (req.method == 'POST') {
        console.log("data sent to server");
                var body = '';
                req.on('data', function (data) {
                body += data;
                        console.log("Partial body: " + body);
                });
                req.on('end', async function () {
                console.log("Body: " + body);
                        var json = JSON.parse(body);
                        const {Client} = require('pg');
                        const connectionString = 'postgresql://groupde:bgw123@cmp-18stunode.cmp.uea.ac.uk/groupde';
                        const client = new Client({
                        connectionString: connectionString,
                        });
                        await client.connect();
                        const sqlquery1 = "SET SEARCH_PATH TO hotelbooking";
                        const res2 = await client.query(sqlquery1);
                        const sqlquery2 = "SELECT * FROM avail_query('" + json.checkin + "', '" + json.checkout + "');";
                        const res1 = await client.query(sqlquery2);
                        await client.end();
                        json = res1.rows;
                        var json_str_new = JSON.stringify(json);
                        console.log(json_str_new);
                        res.end(json_str_new);
                });
        }
        break;
                case '/submit_form':
                if (req.method == 'POST') {
        console.log("submit data sent to server");
                var body = '';
                req.on('data', function (data) {
                body += data;
                });
                req.on('end', async function () {
                    var json = JSON.parse(body);
                    console.log(json)
                    const {Client} = require('pg');
                    const connectionString = 'postgresql://groupde:bgw123@cmp-18stunode.cmp.uea.ac.uk/groupde';
                    const client = new Client({
                    connectionString: connectionString,
                    });
                    await client.connect();
                    var SQLStatement = "SET SEARCH_PATH TO hotelbooking;";
                    var res = await client.query(SQLStatement);
                    SQLStatement = "SELECT COALESCE(MAX(c_no), 0) AS c_no FROM customer;";
                    res = await client.query(SQLStatement);
                    customerNumberRaw = res.rows;
                    customerNumber = customerNumberRaw[0].c_no;
                    customerNumber += Math.round((Math.random() * 10) + 1);
                    insertCustomer = "SELECT insert_customer(" + customerNumber + ", '" + json.c_name + "', '" + json.c_email + "', '" + json.c_address + "', '" + json.c_cardtype + "', '" + json.c_cardexp + "', '" + json.c_cardno + "');"
                    var res = await client.query(insertCustomer);
                    SQLStatement = "SELECT COALESCE(MAX(b_ref), 0) AS b_ref FROM booking;";
                    res = await client.query(SQLStatement);
                    bookingReferenceRaw = res.rows;
                    bookingReference = bookingReferenceRaw[0].b_ref;
                    bookingReference += Math.round((Math.random() * 10) + 1);
                    
                    var totalCost = 0.00;
                    
                    for (x in json.bookings){
                        bookingCost = json.bookings[x].b_cost;
                        bookingCostInt = parseFloat(bookingCost);
                        totalCost += bookingCostInt;
                    }
                    
                    var insertBooking = "SELECT insert_booking(" + bookingReference + ", " + customerNumber + ", " + totalCost + ", " + totalCost + ", '');";
                    res = await client.query(insertBooking);
                    
                    for (x in json.bookings){
                        var insertRoomBooking = "INSERT INTO roombooking VALUES(" + json.bookings[x].r_no + ", " + bookingReference + ", '" + json.bookings[x].checkin + "', '" + json.bookings[x].checkout + "');";
                        res = await client.query(insertRoomBooking);
                    }
                    
                    await client.end();

//                    res.end(res);
                        
                }); }
        break;
                default:
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end('error');
        }
        }).listen(8081); // listen to port 8081
