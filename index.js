var connect = require('connect');

var app = connect();

app.use(connect.logger());
app.use(connect.static(__dirname + '/public'));

var port = Number(process.env.PORT || 5000);
app.listen(port);
