//Module dependencies

var express    = require('express');
//var jade = require('jade');

var testVar = '';

var app = module.exports = express.createServer();
app.use(express.static(__dirname + '/kendoui'));
app.use("/", express.static(__dirname + "/"));
//app.use(express.static(__dirname));
//app.set("view engine", "jade");
var sqlite3 = require("sqlite3"),
TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;

app.use(express.bodyParser());
//Database setup
//Configuration
//Main route sends our HTML file


function s4() {
	return Math.floor((1 + Math.random()) * 0x10000)
	.toString(16)
	.substring(1);
};

function guid() {
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	s4() + '-' + s4() + s4() + s4();
}

app.post('/ajax', express.bodyParser(), function (req, res){

	console.log(req.body.field1);
	console.log('req received');
	//res.redirect('/');
	res.json({'id':'test'});

});


app.get('/initialOpen', function(req, res) {

	var db = new TransactionDatabase(
			new sqlite3.Database('/Users/si_bevan/Desktop/bbbDB', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
	);


	db.serialize(function() {

		//console.log('here');
		db.beginTransaction(function(err, transaction) {

			sqlString = "SELECT VIDID,VOTE FROM BATTLE WHERE STATUS = 0 ORDER BY VOTE DESC LIMIT 1"	;	 
			//db.get(sqlString, function(tx,results){
			transaction.each(sqlString, function(err, row) {
//				console.log(row);
				var vidID = row.VIDID;
				votes = row.VOTE;
				sqlString = "SELECT FILELINK,TITLE,ARTIST,LINK,USER FROM CONTENT WHERE VIDID =" + vidID;	
				transaction.each(sqlString, function(err, row2) {	

					output1 = {'id':vidID,'userID':'noid','fileLink':row2.FILELINK,'songName':row2.TITLE,'bandName':row2.ARTIST,'artistLink':row2.LINK,'votes':votes};

					sqlString = "SELECT VIDID,VOTE FROM BATTLE WHERE STATUS = 1 ORDER BY RANDOM() LIMIT 1"	;	 
					//db.get(sqlString, function(tx,results){
					transaction.each(sqlString, function(err, row3) {

						var vidID = row3.VIDID;
						votes = row3.VOTE;
						sqlString = "SELECT FILELINK,TITLE,ARTIST,LINK,USER FROM CONTENT WHERE VIDID =" + vidID;	
						transaction.each(sqlString, function(err, row4) {

							output2 = {'id':vidID,'userID':'noid','fileLink':row4.FILELINK,'songName':row4.TITLE,'bandName':row4.ARTIST,'artistLink':row4.LINK,'votes':votes};
//							console.log(output2);
							res.json({'out1':output1,'out2':output2})

						});
					});
				});
			});

		});

	});
});

app.get('/createDB', function(req, res) {

	var db = new sqlite3.Database('/Users/si_bevan/Desktop/bbbDB');

	db.serialize(function() {

		console.log("HERE");

		db.run("CREATE TABLE IF NOT EXISTS CONTENT"+
				"(VIDID INT PRIMARY KEY     NOT NULL,"+
				"USER         VARCHAR(50)    NOT NULL,"+
				"FILELINK           VARCHAR(50)    NOT NULL,"+
				"GENRE            VARCHAR(50)     NOT NULL,"+
				"TITLE        VARCHAR(50)    NOT NULL,"+
				"ARTIST         VARCHAR(50)    NOT NULL,"+
				"CREATED        DATE    NOT NULL,"+
				"CITY        VARCHAR(50)     NOT NULL,"+
				"COUNTRY      VARCHAR(50)     NOT NULL,"+
		"LINK VARCHAR(50)    NOT NULL);");

		console.log("HERE");

		db.run("CREATE TABLE IF NOT EXISTS PROFILE"+
				"(EMAIL 		VARCHAR(50) PRIMARY KEY    NOT NULL,"+
				"EMAILCONFIRM           VARCHAR(50)    NOT NULL,"+
				"CREATED           DATE    NOT NULL,"+
				"FIRSTNAME           VARCHAR(50)    NOT NULL,"+
				"SURNAME            VARCHAR(50)     NOT NULL,"+
				"PASSWORD        VARCHAR(50)    NOT NULL,"+
				"COUNTRY         VARCHAR(50)    NOT NULL,"+
				"CITY        VARCHAR(50)    NOT NULL,"+
				"AGE        VARCHAR(10),"+
				"GENDER        VARCHAR(10)    NOT NULL,"+
				"PREFERENCES        VARCHAR(50)    NOT NULL,"+
		"LINK        VARCHAR(50)    NOT NULL);");


		db.run("CREATE TABLE IF NOT EXISTS VOTES"+
				"(ID VARCHAR(50) PRIMARY KEY NOT NULL,"+
				"VIDID INT  NOT NULL,"+
				"USER VARCHAR(50)     NOT NULL,"+
				"VOTE           INT    NOT NULL,"+
		"DATE            VARCHAR(50)     NOT NULL);");


		db.run("CREATE TABLE IF NOT EXISTS BATTLE"+
				"(VIDID INT PRIMARY KEY NOT NULL,"+
				"VIEWS           INT    NOT NULL,"+
				"STATUS           INT    NOT NULL,"+
		"VOTE           INT    NOT NULL);");



		db.run("CREATE TABLE IF NOT EXISTS PLAYLIST"+
				"(ID INT NOT NULL,"+
				"USER VARCHAR(50) PRIMARY KEY  NOT NULL,"+
				"PLAYS           INT    NOT NULL,"+
		"DATE            VARCHAR(50)     NOT NULL);");


		var email = ' \"swbevan@googlemail.com\" ';
		var emailConfirm = '\"1\"';
		created = ' \"2013-12-12\" ';
		firstname = ' \"simon\" ';
		surname  = ' \"bevan\" ';
		password = ' \"cheese2000\" ';
		country = ' \"UK\" ';
		city = ' \"London\" ';
		birthday = ' \"30-40\" ';
		gender = ' \"male\" ';
		preferences  = ' \"rock,electronic,folk\" ';
		link = ' \"www.slambox.com\" ';
		insertString = email + "," + emailConfirm + "," + created+ "," + firstname + "," + surname + "," + password + "," + country + "," + city + "," + birthday + "," + gender + "," + preferences + "," + link;

		db.run("INSERT INTO PROFILE (EMAIL,EMAILCONFIRM,CREATED,FIRSTNAME,SURNAME,PASSWORD,COUNTRY,CITY,AGE,GENDER,PREFERENCES,LINK) VALUES ("+insertString+")");  			       


//		var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//		stmt.run(querystring.parse(postData).text +" " + 1);

//		for (var i = 0; i < 10; i++) {
//		//stmt.run("Ipsum " + i);
//		}
//		stmt.finalize();

//		db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//		console.log(row.id + ": " + row.info);
//		});


	});

});






app.post('/like', function(req, res) {

	//var vidID =   JSON.stringify(req.body.vidID) ;
	//var userID =   JSON.stringify(req.body.userID) ;

	var userID = req.body.uID;
	var vidID = req.body.vID;
	var type = req.body.type;

	//var db = new sqlite3.Database('/Users/si_bevan/Desktop/bbbDB');
	var db = new TransactionDatabase(
			new sqlite3.Database('/Users/si_bevan/Desktop/bbbDB', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
	);


	console.log(userID);

	db.serialize(function() {

		if(userID=='noid'){

			db.beginTransaction(function(err, transaction) {

				sqlString = "SELECT VIDID,VOTE FROM BATTLE WHERE STATUS = 0 ORDER BY VOTE DESC LIMIT 1"	;	 
				//db.get(sqlString, function(tx,results){
				transaction.each(sqlString, function(err, row) {
//					console.log(row);
					var vidID = row.VIDID;
					votes = row.VOTE;
					sqlString = "SELECT FILELINK,TITLE,ARTIST,LINK,USER FROM CONTENT WHERE VIDID =" + vidID;	
					transaction.each(sqlString, function(err, row2) {	

						output1 = {'id':vidID,'userID':'noid','fileLink':row2.FILELINK,'songName':row2.TITLE,'bandName':row2.ARTIST,'artistLink':row2.LINK,'votes':votes};

						sqlString = "SELECT VIDID,VOTE FROM BATTLE WHERE STATUS = 1 ORDER BY RANDOM() LIMIT 1"	;	 
						//db.get(sqlString, function(tx,results){
						transaction.each(sqlString, function(err, row3) {

							var vidID = row3.VIDID;
							votes = row3.VOTE;
							sqlString = "SELECT FILELINK,TITLE,ARTIST,LINK,USER FROM CONTENT WHERE VIDID =" + vidID;	
							transaction.each(sqlString, function(err, row4) {

								output2 = {'id':vidID,'userID':'noid','fileLink':row4.FILELINK,'songName':row4.TITLE,'bandName':row4.ARTIST,'artistLink':row4.LINK,'votes':votes};
//								console.log(output2);
								res.json({'out1':output1,'out2':output2})

							});
						});
					});
				});

				transaction.commit(function(err) {
					if (err) return console.log("Sad panda :-( commit() failed.", err);
					//console.log("Happy panda :-) commit() was successful.");
				});
				
			});

		}else{

				console.log(type);
				timestamp = new Date().getTime();
				var uuid = JSON.stringify(guid());

				db.beginTransaction(function(err, transaction) {

					if(type=="legendbin") {						
						transaction.run("INSERT INTO VOTES (ID,VIDID,USER,VOTE,DATE) VALUES ("+uuid+","+vidID+","+userID+",-1,"+timestamp+" )") 
						transaction.run("UPDATE BATTLE set VOTE = VOTE+1 where VIDID="+vidID)
					}else if(type=="legendkeep") {						
						transaction.run("INSERT INTO VOTES (ID,VIDID,USER,VOTE,DATE) VALUES ("+uuid+","+vidID+","+userID+",1,"+timestamp+" )") 
						transaction.run("UPDATE BATTLE set VOTE = VOTE+1 where VIDID="+vidID)
					}else if(type=="challengerbin") {						
						transaction.run("INSERT INTO VOTES (ID,VIDID,USER,VOTE,DATE) VALUES ("+uuid+","+vidID+","+userID+",-1,"+timestamp+" )") 
						transaction.run("UPDATE BATTLE set VOTE = VOTE+1 where VIDID="+vidID)
					}else if(type=="challengerkeep") {						
						transaction.run("INSERT INTO VOTES (ID,VIDID,USER,VOTE,DATE) VALUES ("+uuid+","+vidID+","+userID+",1,"+timestamp+" )") 
						transaction.run("UPDATE BATTLE set VOTE = VOTE+1 where VIDID="+vidID)
					}
	

						
						sqlString = "SELECT DISTINCT VIDID,VOTE,VIEWS FROM BATTLE " +
						"WHERE VIDID NOT IN " +
						"(SELECT VIDID FROM VOTES WHERE " +
						"USER = "+ userID +") AND STATUS = 0 " +
						"ORDER BY RANDOM() LIMIT 1"	; 

						transaction.each(sqlString, function(err, row) {

							//console.log(userID);
							//console.log(row);
							
							vidID2 = row.VIDID;
							votes2 = row.VOTE;
							views2 = row.VIEWS;


							sqlString = "SELECT FILELINK,TITLE,ARTIST,LINK,USER FROM CONTENT WHERE VIDID =" + vidID2;	


							transaction.get(sqlString, function(err, row2) {


								output1 = {'vID':vidID2,'fileLink':row2.FILELINK,'songName':row2.TITLE,'bandName':row2.ARTIST,'artistLink':row2.LINK,'votes':votes2[0]};

								sqlString = "SELECT DISTINCT VIDID,VOTE,VIEWS FROM BATTLE " +
								"WHERE VIDID NOT IN " +
								"(SELECT VIDID FROM VOTES WHERE " +
								"USER = "+ userID +") AND STATUS = 1 " +
								"ORDER BY RANDOM() LIMIT 1"	; 

								transaction.each(sqlString, function(err, row3) {

									vidID2 = row3.VIDID;
									votes2 = row3.VOTE;
									views2 = row3.VIEWS;

									sqlString = "SELECT FILELINK,TITLE,ARTIST,LINK,USER FROM CONTENT WHERE VIDID =" + vidID2;	

									transaction.get(sqlString, function(err, row4) {


										output2 = {'vID':vidID2,'fileLink':row4.FILELINK,'songName':row4.TITLE,'bandName':row4.ARTIST,'artistLink':row4.LINK,'votes':votes2};
										//res.json({'out1':output1,'out2':output2});
										//res.writeHead(200, { 'Content-Type': 'application/json' });
										//res.write(JSON.stringify({'out1':output1,'out2':output2,'out2':output3}));
										//res.end();

										res.json({'out1':output1,'out2':output2});

			

										return false;

									});

								});
							});
						});

						transaction.commit(function(err) {
							if (err) return console.log("Sad panda :-( commit() failed.", err);
							//console.log("Happy panda :-) commit() was successful.");
						});
					
					

				});



			}

	});


	//res.sendfile( 'index.html' , {root:__dirname});
	//res.json({'msg':'like','msg2':'sdfdsds'});

});





app.post('/login', function (req, res) {



	var email =   JSON.stringify(req.body.username) ;
	var password =   JSON.stringify(req.body.password) ;
	var userID = email;



	var db = new TransactionDatabase(
			new sqlite3.Database('/Users/si_bevan/Desktop/bbbDB', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
	);

	db.serialize(function() {


		var output2 = 1;
		sqlString = "SELECT EMAIL,FIRSTNAME from PROFILE WHERE EMAIL="+email+" AND PASSWORD ="+password

		db.get(sqlString, function(tx,results){

			if(results){


				userName = results.FIRSTNAME;
				loggedIn  = 1;

				output3 = {'userName':userName,'userID':userID,'loggedIn':loggedIn};

				db.beginTransaction(function(err, transaction) {

					
					sqlString = "SELECT VIDID,VOTE,VIEWS FROM BATTLE " +
					"WHERE VIDID NOT IN " +
					"(SELECT VIDID FROM VOTES WHERE " +
					"USER = "+ userID +") AND STATUS = 0 " +
					"ORDER BY VOTE DESC LIMIT 1"	; 

					transaction.each(sqlString, function(err, row) {

						console.log(userID);
						console.log(row);
						
						vidID2 = row.VIDID;
						votes2 = row.VOTE;
						views2 = row.VIEWS;

//						index = vidID2.indexOf(vidID3[j]);
//						if (index > -1) {
//						vidID2.splice(index, 1);
//						votes2.splice(index, 1);
//						}


						sqlString = "SELECT FILELINK,TITLE,ARTIST,LINK,USER FROM CONTENT WHERE VIDID =" + vidID2;	


						transaction.get(sqlString, function(err, row2) {


							output1 = {'vID':vidID2,'fileLink':row2.FILELINK,'songName':row2.TITLE,'bandName':row2.ARTIST,'artistLink':row2.LINK,'votes':votes2[0]};

							sqlString = "SELECT VIDID,VOTE,VIEWS FROM BATTLE " +
							"WHERE VIDID NOT IN " +
							"(SELECT VIDID FROM VOTES WHERE " +
							"USER = "+ userID +") AND STATUS = 1 " +
							"ORDER BY RANDOM() LIMIT 1"	; 

							transaction.each(sqlString, function(err, row3) {

								vidID2 = row3.VIDID;
								votes2 = row3.VOTE;
								views2 = row3.VIEWS;

								sqlString = "SELECT FILELINK,TITLE,ARTIST,LINK,USER FROM CONTENT WHERE VIDID =" + vidID2;	

								transaction.get(sqlString, function(err, row4) {


									output2 = {'vID':vidID2,'fileLink':row4.FILELINK,'songName':row4.TITLE,'bandName':row4.ARTIST,'artistLink':row4.LINK,'votes':votes2};
									//res.json({'out1':output1,'out2':output2});
									//res.writeHead(200, { 'Content-Type': 'application/json' });
									//res.write(JSON.stringify({'out1':output1,'out2':output2,'out2':output3}));
									//res.end();

									res.json({'out1':output1,'out2':output2,'out3':output3});

									console.log('body: ' + email);
									console.log('body: ' + password);

									return false;

								});

							});
						});
					});

					transaction.commit(function(err) {
						if (err) return console.log("Sad panda :-( commit() failed.", err);
						//console.log("Happy panda :-) commit() was successful.");
					});

				});


			}else{
				res.json({'out1':'invalidID'})

			}

		});



	});



});




app.post('/register', function (req, res) {


	output = "<!DOCTYPE html>"+
	"<html>"+
	"<head>"+
	"<title>BlackBoxBoom</title>"+
	"<script src=\"js/jquery.min.js\" type=\"text/javascript\"></script>"+
	"</head>"+
	"<body>"+


	"<script type=\"text/javascript\">"+
	"$(document).ready(function() {"+

	"	 window.location.replace(\"http://localhost:3000\");"+

	"});"+
	" </script>"
	"<h3>Redirecting</h3>"+
	"</body>"+
	"</html>";

	var db = new sqlite3.Database('/Users/si_bevan/Desktop/bbbDB');

	var email =   JSON.stringify(req.body.email) ;
	var emailConfirm = '\"1\"';
	created = ' \"2013-12-12\" ';
	firstname = JSON.stringify(req.body.firstname) ;
	surname  = JSON.stringify(req.body.lastname) ;
	password =  JSON.stringify(req.body.password) ;
	country= JSON.stringify(req.body.country) ;
	city =  JSON.stringify(req.body.city) ;
	birthday = JSON.stringify(req.body.age) ;
	gender = JSON.stringify(req.body.gender) ;
	preferences  = JSON.stringify(req.body.prefs) ;
	link =  JSON.stringify(req.body.link) ;
	insertString = email + "," + emailConfirm + "," + created+ "," + firstname + "," + surname + "," + password + "," + country + "," + city + "," + birthday + "," + gender + "," + preferences + "," + link;
	console.log(insertString);

	data = 0;

	db.serialize(function() {
		db.each("SELECT EMAIL from PROFILE WHERE EMAIL="+email, function(err, row) {

			//console.log(row);
			if(row){   
				//res.json({'msg':'email_already_exists','msg2':'sdfdsds'});
			}else{

				//res.json({'msg':'insering','msg2':'sdfdsds'});
				db.run("INSERT INTO PROFILE (EMAIL,EMAILCONFIRM,CREATED,FIRSTNAME,SURNAME,PASSWORD,COUNTRY,CITY,AGE,GENDER,PREFERENCES,LINK) VALUES ("+insertString+")");  

				//finalString = "INSERT INTO PROFILE (ID, EMAIL,FIRSTNAME,SURNAME,PASSWORD,COUNTRY,CITY,BIRTHDAY,GENDER,PREFERENCES,LINK) VALUES ("+insertString+")"

			}

		});
	});

	//console.log(firstname);

	res.send( output );

});


app.get('/createTable', function (req, res) {

	var artistsA = new Array();
	var fileLinkA = new Array();
	var genreA = new Array();
	var titleA = new Array();
	var linkA = new Array();

	var db = new TransactionDatabase(
			new sqlite3.Database('/Users/si_bevan/Desktop/bbbDB', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
	);




	db.serialize(function() {

		db.beginTransaction(function(err, transaction) {
			transaction.all("SELECT ID,VOTE from BATTLE ORDER BY VOTE", function(err, row) {

				vidID = [];
				votes = [];
				row.forEach(function(rows4){
					vidID.push(rows4.ID);
					votes.push(rows4.VOTE);
					//vidID =  row.ID
					//votes = row.VOTE
				});




				for (var i=0;i<vidID.length;i++){


					transaction.all("SELECT ARTIST,FILELINK,GENRE,TITLE,LINK from CONTENT WHERE ID="+vidID[i], function(err2, row2) {



						row2.forEach(function(rows2){


							artistsA.push(rows2.ARTIST);
							fileLinkA.push(rows2.FILELINK);
							genreA.push(rows2.GENRE);
							titleA.push(rows2.TITLE);
							linkA.push(rows2.LINK);

							//console.log(vidID.length-1)
							if(artistsA.length==vidID.length-1){
								//console.log(artistsA)
								res.json({'artist':artistsA});
							}

						});

						//console.log(artistsA)
					});
					//console.log(artistsA)

				}

			});

			transaction.commit(function(err) {
				if (err) return console.log("Sad panda :-( commit() failed.", err);
				//console.log("Happy panda :-) commit() was successful.");
			});

		});

	});

	//res.json({'msg':artistsA});

})


app.get('/getPlaylist', function (req, res) {

	var artistsA = new Array();
	var fileLinkA = new Array();
	var genreA = new Array();
	var titleA = new Array();
	var linkA = new Array();
	var dateA = new Array();
	var playsA = new Array();

	userID = "swbevan@googlemail.com";

	var db = new TransactionDatabase(
			new sqlite3.Database('/Users/si_bevan/Desktop/bbbDB', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
	);


	db.serialize(function() {
		db.each("SELECT ID,PLAYS,DATE from PLAYLIST WHERE USER="+userID+" ORDER BY plays", function(err, row) {

			vidID =  row.ID
			playsA.push(row.PLAYS)
			dateA.push(row.DATE)
			db.each("SELECT ARTIST,FILELINK,GENRE,TITLE,LINK from CONTENT WHERE ID="+vidID, function(err2, row2) {
				artistA.push(row.ARTIST);
				fileLinkA.push(row.FILELINK)
				genreA.push(row.GENRE);
				titleA.push(row.TITLE);
				linkA.push(row.LINK);


			});
		});
	});

	res.json({'msg':artistsA});

})


//Begin listening

app.listen(3000);
console.log("Express server is listening on port %d in %s mode", app.address().port, app.settings.env);