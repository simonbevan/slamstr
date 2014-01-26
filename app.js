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

	//console.log(req.body.sqlString1);
	//console.log('req received');
	//res.redirect('/');
	res.json({'id':'test'});

});


app.post('/addToDB', express.bodyParser(), function (req, res){

	

	var db = new TransactionDatabase(
			new sqlite3.Database('bbbDB', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
	);

	var sqlString =   req.body.sqlString1 ;
	var sqlString2 =   req.body.sqlString2 ;

	
	sqlStr = "INSERT INTO CONTENT (VIDID,USER,FILELINK,FILETYPE,GENRE,TITLE,ARTIST,CREATED,CITY,COUNTRY,LINK) VALUES ("+sqlString+")" 
	sqlStr2 = "INSERT INTO BATTLE (VIDID,VIEWS,STATUS,VOTE) VALUES ("+sqlString2+")" 
	//console.log(sqlStr)
	//console.log(sqlStr2)

	db.serialize(function() {

		vidID = 0
		db.run(sqlStr);  
		db.run(sqlStr2 );  

		});

	res.json({'id':'test'});

});


app.get('/initialOpen', function(req, res) {

	var db = new TransactionDatabase(
			new sqlite3.Database('bbbDB', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
	);


	db.serialize(function() {

		//console.log('here');
		db.beginTransaction(function(err, transaction) {

			sqlString = "SELECT VIDID,VOTE FROM BATTLE WHERE STATUS = 0 ORDER BY VOTE DESC LIMIT 1"	;	 
			//db.get(sqlString, function(tx,results){
			transaction.each(sqlString, function(err, row) {
//				console.log(row);
				var vidID = JSON.stringify(row.VIDID);
				votes = row.VOTE;
				sqlString = "SELECT FILELINK,TITLE,ARTIST,LINK,USER FROM CONTENT WHERE VIDID =" + vidID;
				//console.log(sqlString)	
				transaction.each(sqlString, function(err, row2) {	

					output1 = {'id':vidID,'userID':'noid','fileLink':row2.FILELINK,'songName':row2.TITLE,'bandName':row2.ARTIST,'artistLink':row2.LINK,'votes':votes};

					sqlString = "SELECT VIDID,VOTE FROM BATTLE WHERE STATUS = 1 ORDER BY RANDOM() LIMIT 1"	;	 
					//db.get(sqlString, function(tx,results){
					transaction.each(sqlString, function(err, row3) {

						var vidID = JSON.stringify(row3.VIDID);
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

	var db = new sqlite3.Database('bbbDB');

	db.serialize(function() {

		//console.log("HERE");

		db.run("CREATE TABLE IF NOT EXISTS CONTENT"+
				"(VIDID VARCHAR(50)  PRIMARY KEY     NOT NULL,"+
				"USER         VARCHAR(50)    NOT NULL,"+
				"FILELINK           VARCHAR(50)    NOT NULL,"+
				"FILETYPE           VARCHAR(50)    NOT NULL,"+
				"GENRE            VARCHAR(50)     NOT NULL,"+
				"TITLE        VARCHAR(50)    NOT NULL,"+
				"ARTIST         VARCHAR(50)    NOT NULL,"+
				"CREATED        DATE    NOT NULL,"+
				"CITY        VARCHAR(50)     NOT NULL,"+
				"COUNTRY      VARCHAR(50)     NOT NULL,"+
				"LINK VARCHAR(50)    NOT NULL);");


		db.run("CREATE TABLE IF NOT EXISTS PROFILE"+
				"(TYPE           VARCHAR(50)    NOT NULL,"+
				"EMAIL 		VARCHAR(50) PRIMARY KEY    NOT NULL,"+
				"EMAILCONFIRM           VARCHAR(50)    NOT NULL,"+
				"USERNAME 		VARCHAR(50)    NOT NULL,"+
				"CREATED           DATE    NOT NULL,"+
				"FIRSTNAME           VARCHAR(50)    NOT NULL,"+
				"SURNAME            VARCHAR(50)     NOT NULL,"+
				"PASSWORD        VARCHAR(50)    NOT NULL,"+
				"COUNTRY         VARCHAR(50)    NOT NULL,"+
				"CITY        VARCHAR(50)    NOT NULL,"+
				"AGE        VARCHAR(10),"+
				"GENDER        VARCHAR(10)    NOT NULL,"+
				"PREFERENCES        VARCHAR(50)    NOT NULL,"+
				"LINK        VARCHAR(50)    NOT NULL,"+
				"PLAYLISTS        VARCHAR(500)    NOT NULL);");


		db.run("CREATE TABLE IF NOT EXISTS VOTES"+
				"(ID VARCHAR(50) PRIMARY KEY NOT NULL,"+
				"VIDID INT  NOT NULL,"+
				"USER VARCHAR(50)     NOT NULL,"+
				"VOTE           INT    NOT NULL,"+
				"DATE            VARCHAR(50)     NOT NULL);");


		db.run("CREATE TABLE IF NOT EXISTS BATTLE"+
				"(VIDID VARCHAR(50) PRIMARY KEY NOT NULL,"+
				"VIEWS           INT    NOT NULL,"+
				"STATUS           INT    NOT NULL,"+
				"VOTE           INT    NOT NULL);");



		db.run("CREATE TABLE IF NOT EXISTS PLAYLIST"+
				"(VIDID VARCHAR(50) NOT NULL,"+
				"USER VARCHAR(50) NOT NULL,"+
				"PLAYS           INT    NOT NULL,"+
				"DATE     VARCHAR(50)     NOT NULL,"+
				"PLAYLISTNAME    VARCHAR(50)  NOT NULL);");


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
		playList = ' \"playList1,playList2,playList3,playList4,playList5\" ';
		insertString = email + "," + emailConfirm + "," + created+ "," + firstname + "," + surname + "," + password + "," + country + "," + city + "," + birthday + "," + gender + "," + preferences + "," + link+ "," + playList;


		db.run("INSERT INTO PROFILE (EMAIL,EMAILCONFIRM,CREATED,FIRSTNAME,SURNAME,PASSWORD,COUNTRY,CITY,AGE,GENDER,PREFERENCES,LINK,PLAYLISTS) VALUES ("+insertString+")");  			       

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
	var playlistName = req.body.pLName;

	//var db = new sqlite3.Database('bbbDB');
	var db = new TransactionDatabase(
			new sqlite3.Database('bbbDB', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
	);


	//console.log(userID);

	db.serialize(function() {

		if(userID=='noid'){

			db.beginTransaction(function(err, transaction) {

				sqlString = "SELECT VIDID,VOTE FROM BATTLE WHERE STATUS = 0 ORDER BY RANDOM() LIMIT 1"	;	 
				//db.get(sqlString, function(tx,results){
				transaction.each(sqlString, function(err, row) {
//					console.log(row);
					var vidID = JSON.stringify(row.VIDID);
					votes = row.VOTE;
					sqlString = "SELECT FILELINK,TITLE,ARTIST,LINK,USER FROM CONTENT WHERE VIDID =" + vidID;	
					transaction.each(sqlString, function(err, row2) {	

						output1 = {'id':vidID,'userID':'noid','fileLink':row2.FILELINK,'songName':row2.TITLE,'bandName':row2.ARTIST,'artistLink':row2.LINK,'votes':votes};

						sqlString = "SELECT VIDID,VOTE FROM BATTLE WHERE STATUS = 1 ORDER BY RANDOM() LIMIT 1"	;	 
						//db.get(sqlString, function(tx,results){
						transaction.each(sqlString, function(err, row3) {

							var vidID = JSON.stringify(row3.VIDID);
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

				//console.log(type);
				timestamp = new Date().getTime();
				var uuid = JSON.stringify(guid());

				db.beginTransaction(function(err, transaction) {

					if(type=="legendbin") {	//vote					
						transaction.run("INSERT INTO VOTES (ID,VIDID,USER,VOTE,DATE) VALUES ("+uuid+","+vidID+","+userID+",1,"+timestamp+" )") 
						transaction.run("UPDATE BATTLE set VOTE = VOTE+1 where VIDID="+vidID)
					}else if(type=="legendkeep") {	//add to playlist					
						//transaction.run("INSERT INTO VOTES (ID,VIDID,USER,VOTE,DATE) VALUES ("+uuid+","+vidID+","+userID+",1,"+timestamp+" )")
						
						//console.log("INSERT INTO PLAYLIST (VIDID,USER,PLAYLISTNAME,PLAYS,DATE) VALUES ("+vidID+","+userID+","+playlistName+",1,"+timestamp+" )");

						transaction.run("INSERT INTO PLAYLIST (VIDID,USER,PLAYLISTNAME,PLAYS,DATE) VALUES ("+vidID+","+userID+","+playlistName+",1,"+timestamp+" )")
						//transaction.run("UPDATE BATTLE set VOTE = VOTE+1 where VIDID="+vidID)
					}else if(type=="challengerbin") {						
						transaction.run("INSERT INTO VOTES (ID,VIDID,USER,VOTE,DATE) VALUES ("+uuid+","+vidID+","+userID+",1,"+timestamp+" )") 
						transaction.run("UPDATE BATTLE set VOTE = VOTE+1 where VIDID="+vidID)
					}else if(type=="challengerkeep") {	
						transaction.run("INSERT INTO PLAYLIST (VIDID,USER,PLAYLISTNAME,PLAYS,DATE) VALUES ("+vidID+","+userID+","+playlistName+",1,"+timestamp+" )")
						//transaction.run("INSERT INTO VOTES (ID,VIDID,USER,VOTE,DATE) VALUES ("+uuid+","+vidID+","+userID+",1,"+timestamp+" )") 
						//transaction.run("UPDATE BATTLE set VOTE = VOTE+1 where VIDID="+vidID)
					}
	

						
						sqlString = "SELECT DISTINCT VIDID,VOTE,VIEWS FROM BATTLE " +
						"WHERE VIDID NOT IN " +
						"(SELECT VIDID FROM VOTES WHERE " +
						"USER = "+ userID +") AND STATUS = 0 " +
						"ORDER BY RANDOM() LIMIT 1"	; 

						transaction.each(sqlString, function(err, row) {

							//console.log(userID);
							//console.log(row);
							
							vidID2 = JSON.stringify(row.VIDID);
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

									vidID2 = JSON.stringify(row3.VIDID);
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
			new sqlite3.Database('bbbDB', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
	);

	db.serialize(function() {


		var output2 = 1;
		sqlString = "SELECT EMAIL,FIRSTNAME,PLAYLISTS from PROFILE WHERE EMAIL="+email+" AND PASSWORD ="+password

		db.get(sqlString, function(tx,results){

			if(results){


				userName = results.FIRSTNAME;
				loggedIn  = 1;
				pLName = results.PLAYLISTS;

				output3 = {'userName':userName,'userID':userID,'loggedIn':loggedIn,'plName':pLName};

				db.beginTransaction(function(err, transaction) {

					
					sqlString = "SELECT VIDID,VOTE,VIEWS FROM BATTLE " +
					"WHERE VIDID NOT IN " +
					"(SELECT VIDID FROM VOTES WHERE " +
					"USER = "+ userID +") AND STATUS = 0 " +
					"ORDER BY VOTE DESC LIMIT 1"	; 

					transaction.each(sqlString, function(err, row) {

						//console.log(userID);
						//console.log(row);
						
						vidID2 = JSON.stringify(row.VIDID);
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

								vidID2 = JSON.stringify(row3.VIDID);
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

									//console.log('body: ' + email);
									//console.log('body: ' + password);

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
	"<title>slamstr</title>"+
	"<script src=\"js/jquery.min.js\" type=\"text/javascript\"></script>"+
	"</head>"+
	"<body>"+


	"<script type=\"text/javascript\">"+
	"$(document).ready(function() {"+

	"	 window.location.replace(\"/\");"+

	"});"+
	" </script>"
	"<h3>Redirecting</h3>"+
	"</body>"+
	"</html>";

	var db = new sqlite3.Database('bbbDB');

	if(req.body.type=="fan"){

	var type =   JSON.stringify(req.body.type) ;
	var email =   JSON.stringify(req.body.email) ;
	var emailConfirm = '\"1\"';
	timestamp = new Date();
	created = JSON.stringify(timestamp) ;
	username = JSON.stringify(req.body.uname) ;
	firstname = JSON.stringify(req.body.firstname) ;
	surname  = JSON.stringify(req.body.lastname) ;
	password =  JSON.stringify(req.body.password) ;
	country= JSON.stringify(req.body.country) ;
	city =  JSON.stringify(req.body.city) ;
	birthday = JSON.stringify(req.body.age2) ;
	gender = JSON.stringify(req.body.gender2) ;
	preferences  = '\"'+req.body.prefs3 + '\"';
	link =  ' \"slamstr.com \"';
	playList = ' \"playList1,playList2,playList3,playList4,playList5\" ';
	insertString = type +"," + email + "," + emailConfirm + "," + username +"," +created+ "," + firstname + "," + surname + "," + password + "," + country + "," + city + "," + birthday + "," + gender + "," + preferences + "," + link + "," + playList;
	}else{

	var type =   JSON.stringify(req.body.type) ;
	var email =   JSON.stringify(req.body.email) ;
	var emailConfirm = '\"1\"';
	timestamp = new Date();
	created = JSON.stringify(timestamp) ;
	username = JSON.stringify(req.body.uname) ;
	firstname = JSON.stringify(req.body.firstname) ;
	surname  = JSON.stringify(req.body.lastname) ;
	password =  JSON.stringify(req.body.password) ;
	country= JSON.stringify(req.body.country) ;
	city =  JSON.stringify(req.body.city) ;
	birthday = JSON.stringify(req.body.age) ;
	gender = JSON.stringify(req.body.gender) ;
	preferences  = '\"'+req.body.prefs2 + '\"';
	link =  ' \"slamstr.com \"';
	playList = ' \"playList1,playList2,playList3,playList4,playList5\" ';
	insertString = type +"," + email + "," + emailConfirm + "," + username +"," + created+ "," + firstname + "," + surname + "," + password + "," + country + "," + city + "," + birthday + "," + gender + "," + preferences + "," + link + "," + playList;
	


	}



	data = 0;
	sqlStr = "SELECT EMAIL from PROFILE WHERE EMAIL="+email
	//console.log(sqlStr);
			

	db.serialize(function() {

//console.log(db.all(sqlStr))

		db.all(sqlStr, function(err, row) {

			if(row.length>0){   
				//console.log('exists')				
				//console.log(row)
				
				//res.json({'msg':'email_already_exists','msg2':'sdfdsds'});
			}else{

				//res.json({'msg':'insering','msg2':'sdfdsds'});

				//console.log("INSERT INTO PROFILE (TYPE,EMAIL,EMAILCONFIRM,USERNAME,CREATED,FIRSTNAME,SURNAME,PASSWORD,COUNTRY,CITY,AGE,GENDER,PREFERENCES,LINK,PLAYLISTS) VALUES (" +insertString +")");  


				db.run("INSERT INTO PROFILE (TYPE,EMAIL,EMAILCONFIRM,USERNAME,CREATED,FIRSTNAME,SURNAME,PASSWORD,COUNTRY,CITY,AGE,GENDER,PREFERENCES,LINK,PLAYLISTS) VALUES ("+insertString+")");  
				
				//finalString = "INSERT INTO PROFILE (ID, EMAIL,FIRSTNAME,SURNAME,PASSWORD,COUNTRY,CITY,BIRTHDAY,GENDER,PREFERENCES,LINK) VALUES ("+insertString+")"

			}

		});
	});

res.send( output );

	//console.log(firstname);

	
});


app.get('/createTable', function (req, res) {

	var artistsA = new Array();
	var fileLinkA = new Array();
	var genreA = new Array();
	var titleA = new Array();
	var linkA = new Array();

	var db = new TransactionDatabase(
			new sqlite3.Database('bbbDB', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
	);


	

	db.serialize(function() {

		db.beginTransaction(function(err, transaction) {

			transaction.all("SELECT VIDID,VOTE FROM BATTLE ORDER BY VOTE DESC", function(err, row) {

				vidID = [];
				votes = [];
				row.forEach(function(rows4){
					vidID.push(JSON.stringify(rows4.VIDID));
					votes.push(rows4.VOTE);
					
					//vidID =  row.ID
					//votes = row.VOTE
				});



				output=[];
				for (var i=0;i<vidID.length;i++){


					sqlQuery = "SELECT CONTENT.ARTIST,CONTENT.FILELINK,CONTENT.GENRE,CONTENT.TITLE,CONTENT.LINK,BATTLE.VOTE "+
										"from CONTENT JOIN BATTLE ON BATTLE.VIDID = CONTENT.VIDID "+
										"WHERE CONTENT.VIDID="+vidID[i];
					//console.log(sqlQuery)				
					transaction.all(sqlQuery, function(err2, row2) {
						

						
						row2.forEach(function(rows2){


							 artistsA.push(rows2.ARTIST);
							// fileLinkA.push(rows2.FILELINK);
							// genreA.push(rows2.GENRE);
							// titleA.push(rows2.TITLE);
							// linkA.push(rows2.LINK);


							output.push({'artist':rows2.ARTIST,'fileLink':rows2.FILELINK,'genre':rows2.GENRE,'title':rows2.TITLE,'votes':rows2.VOTE});
							
							if(artistsA.length==vidID.length-1){
								//console.log({'artist':artistsA,'fileLink':fileLinkA,'genre':genreA,'title':titleA,'link':linkA})
								//res.json({'artist':artistsA,'fileLink':fileLinkA,'genre':genreA,'title':titleA,'link':linkA});
								res.json(output);
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





app.post('/getPlaylist', function (req, res) {

	var userID = req.body.uID;
	var artistsA = new Array();
	//console.log(userID);


	var db = new TransactionDatabase(
			new sqlite3.Database('bbbDB', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
	);



if(userID=='noid'){

res.json({'message':'noid'});

}else{

	db.serialize(function() {




		db.beginTransaction(function(err, transaction) {

			transaction.all("SELECT VIDID,PLAYS,DATE from PLAYLIST WHERE USER="+userID+" ORDER BY plays", function(err, row) {

				vidID = [];
				votes = [];
				row.forEach(function(rows4){
					vidID.push(JSON.stringify(rows4.VIDID));
				});



				output=[];
				for (var i=0;i<vidID.length;i++){


					sqlQuery = "SELECT CONTENT.ARTIST,CONTENT.FILELINK,CONTENT.GENRE,CONTENT.TITLE,CONTENT.LINK,PLAYLIST.PLAYS,PLAYLIST.DATE "+
										"from CONTENT JOIN PLAYLIST ON PLAYLIST.VIDID = CONTENT.VIDID "+
										"WHERE CONTENT.VIDID="+vidID[i] 
										"AND PLAYLIST.USER="+userID;
					//console.log(sqlQuery)				
					transaction.all(sqlQuery, function(err2, row2) {
						

						
						row2.forEach(function(rows2){


							artistsA.push(rows2.ARTIST);

							//console.log(1)	

							output.push({'artist':rows2.ARTIST,'fileLink':rows2.FILELINK,'genre':rows2.GENRE,'title':rows2.TITLE,'plays':rows2.PLAYS,'dates':rows2.DATES});
							
							if(artistsA.length==vidID.length){
								//console.log({'artist':artistsA,'fileLink':fileLinkA,'genre':genreA,'title':titleA,'link':linkA})
								//res.json({'artist':artistsA,'fileLink':fileLinkA,'genre':genreA,'title':titleA,'link':linkA});
								res.json(output);
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

}
	//res.json({'msg':artistsA});

})


app.post('/getAccount', function (req, res) {

	var userID = req.body.uID;
	var artistsA = new Array();
	//console.log(userID);


	var db = new TransactionDatabase(
			new sqlite3.Database('bbbDB', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
	);



if(userID=='noid'){

res.json({'message':'noid'});

}else{



	db.serialize(function() {

		db.beginTransaction(function(err, transaction) {

		
				output = [];
				sqlQuery = "SELECT TYPE, EMAIL, USERNAME, FIRSTNAME, SURNAME, COUNTRY, CITY, AGE, GENDER, PREFERENCES, LINK FROM PROFILE WHERE EMAIL="+userID;     						
					transaction.all(sqlQuery, function(err2, row2) {
										
						//console.log(row2)		
						
						row2.forEach(function(rows2){
							//console.log(1)	
							
								//console.log({'artist':artistsA,'fileLink':fileLinkA,'genre':genreA,'title':titleA,'link':linkA})
								//res.json({'artist':artistsA,'fileLink':fileLinkA,'genre':genreA,'title':titleA,'link':linkA});
							
							
								output.push({'type':rows2.TYPE,'email':rows2.EMAIL,'uname':rows2.USERNAME,  'fname':rows2.FIRSTNAME, 'lname':rows2.SURNAME, 'country':rows2.COUNTRY,'city':rows2.CITY,'age':rows2.AGE, 'gender':rows2.GENDER,'prefs':rows2.PREFERENCES,'link':rows2.LINK});
							
							if(output.length==1){
								res.json(output);
							}
							 
						});
						//console.log(artistsA)
					});
					//console.log(artistsA		

			});

		

		});	

		

}
	//res.json({'msg':artistsA});

})



//Begin listening

var port = process.env.PORT || 5000;
app.listen(port, function() {
  //console.log("Listening on " + port);
});
//console.log("Express server is listening on port %d in %s mode", app.address().port, app.settings.env);//Module dependencies




//		db.each(sqlString , function(err, row) {


//		if(row){
//		output = output + "sessionStorage.userName= "+ row.FIRSTNAME + " ;"+
//		"sessionStorage.loggedIn = 1 ;";

//		//console.log(output2);
//		}


//		output = output + "window.location.replace(\"http://localhost:3000\");"+ 
//		"});"+
//		" </script>"

//		output = output + "<h3>Redirecting</h3>"+
//		"</body>"+
//		"</html>";

//		console.log(output);
//		res.send( output );

//		});













