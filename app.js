//Module dependencies

var express    = require('express');
var fs = require('fs');
var pg = require('pg'); 
var request = require('request');
var AWS = require('aws-sdk');
//var jade = require('jade');

var testVar = '';

var app = module.exports = express.createServer();
app.use(express.static(__dirname + '/kendoui'));
app.use("/", express.static(__dirname + "/"));

app.use(express.bodyParser());

function s4() {
	return Math.floor((1 + Math.random()) * 0x10000)
	.toString(16)
	.substring(1);
};

function guid() {
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	s4() + '-' + s4() + s4() + s4();
}

Date.prototype.yyyymmdd = function() {         

	var yyyy = this.getFullYear().toString();                                    
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based         
	var dd  = this.getDate().toString();             

	return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
}; 



app.post('/addToDB', express.bodyParser(), function (req, res){

	var sqlString1 =   req.body.sqlString1 ;
	var sqlString2 =   req.body.sqlString2 ;


	sqlStr1 = "INSERT INTO CONTENT (VIDID,USERNAME,FILELINK,FILETYPE,GENRE,TITLE,ARTIST,CREATED,CITY,COUNTRY,LINK) VALUES ("+sqlString1+")" 
	sqlStr2 = "INSERT INTO BATTLE (VIDID,VIEWS,STATUS,VOTE,GENRE,PRIORITY) VALUES ("+sqlString2+")" 

	//console.log(sqlStr2)
var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };
	var client = new pg.Client(params);
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}
		client.query(sqlStr1, function(err, result) {
			if(err) {
				return //console.error('error running query', err);
			}


			client.query(sqlStr2, function(err, result) {
				if(err) {
					//return console.error('error running query', err);
				}
				client.end();
			});
		});
	});


	res.json({'data':sqlStr2});


});


app.get('/initialOpen', function(req, res) {

	var fs = require('fs');



var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };
	var client = new pg.Client(params);


	data = 0;
	sqlString = "SELECT VIDID,VOTE FROM BATTLE WHERE STATUS = 0 ORDER BY VOTE DESC LIMIT 1"	;
	//console.log(params);

	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}
		client.query(sqlString, function(err, row) {
			if(err) {
				return console.error('error running query', err);
			}

			//console.log(row.rows[0]);
			var vidID = row.rows[0].vidid ;
			votes = row.rows[0].vote;
			sqlString = "SELECT FILELINK,TITLE,ARTIST,LINK,USERNAME FROM CONTENT WHERE VIDID ='" + vidID+"'";

			//console.log(sqlString);

			client.query(sqlString, function(err, row2) {
				if(err) {
					return console.error('error running query', err);
				}

				output1 = {'id':vidID,'userID':'noid','fileLink':row2.rows[0].filelink,'songName':row2.rows[0].title,'bandName':row2.rows[0].artist,'artistLink':row2.rows[0].link,'votes':votes};
				sqlString = "SELECT VIDID,VOTE FROM BATTLE WHERE STATUS = 1 ORDER BY RANDOM() LIMIT 1"	;	 

				client.query(sqlString, function(err, row3) {
					if(err) {
						return console.error('error running query', err);
					}

					var vidID = row3.rows[0].vidid;
					votes = row3.rows[0].vote;
					sqlString = "SELECT FILELINK,TITLE,ARTIST,LINK,USERNAME FROM CONTENT WHERE VIDID ='" + vidID + "'";

					client.query(sqlString, function(err, row4) {
						if(err) {
							return console.error('error running query', err);
						}
						output2 = {'id':vidID,'userID':'noid','fileLink':row4.rows[0].filelink,'songName':row4.rows[0].title,'bandName':row4.rows[0].artist,'artistLink':row4.rows[0].link,'votes':votes};
						//console.log(output2);
						client.end();
						res.json({'out1':output1,'out2':output2})

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
				"USERNAME         VARCHAR(50)    NOT NULL,"+
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
				"VIDID VARCHAR(50)  NOT NULL,"+
				"USERNAME VARCHAR(50)     NOT NULL,"+
				"VOTE           INT    NOT NULL,"+
		"DATE            VARCHAR(50)     NOT NULL);");


		db.run("CREATE TABLE IF NOT EXISTS BATTLE"+
				"(VIDID VARCHAR(50) PRIMARY KEY NOT NULL,"+
				"VIEWS           INT    NOT NULL,"+
				"STATUS           INT    NOT NULL,"+
				"GENRE           VARCHAR(50)    NOT NULL,"+
				"PRIORITY         INT    NOT NULL,"+
		"VOTE           INT    NOT NULL);");



		db.run("CREATE TABLE IF NOT EXISTS PLAYLIST"+
				"(VIDID VARCHAR(50) NOT NULL,"+
				"USERID VARCHAR(50) NOT NULL,"+
				"PLAYS           INT    NOT NULL,"+
				"DATE     VARCHAR(50)     NOT NULL,"+
		"PLAYLISTNAME    VARCHAR(50)  NOT NULL);");


		db.run("CREATE TABLE IF NOT EXISTS BUGS"+
				"(BUGID VARCHAR(50) NOT NULL,"+
				"USERID VARCHAR(50) NOT NULL,"+
				"CREATED        DATE    NOT NULL,"+
				"TITLE        VARCHAR(50)     NOT NULL,"+
		"CONTENT     VARCHAR(50)  NOT NULL);");

		db.run("CREATE TABLE IF NOT EXISTS FEEDBACK"+
				"(FEEDBACKID VARCHAR(50) NOT NULL,"+
				"USERID VARCHAR(50) NOT NULL,"+
				"CREATED        DATE    NOT NULL,"+
				"TITLE        VARCHAR(50)     NOT NULL,"+
		"CONTENT     VARCHAR(50)  NOT NULL);");


		db.run("CREATE TABLE IF NOT EXISTS AWAITINGAPPROVAL"+
				"(VIDID VARCHAR(50)  PRIMARY KEY     NOT NULL,"+
				"FILELINK        VARCHAR(50)    NOT NULL,"+
				"USERNAME         VARCHAR(50)    NOT NULL,"+
				"FILETYPE           VARCHAR(50)    NOT NULL,"+
				"GENRE            VARCHAR(50)     NOT NULL,"+
				"TITLE        VARCHAR(50)    NOT NULL,"+
				"ARTIST         VARCHAR(50)    NOT NULL,"+
				"CREATED        DATE    NOT NULL,"+
				"CITY        VARCHAR(50)     NOT NULL,"+
				"COUNTRY      VARCHAR(50)     NOT NULL,"+
		"LINK VARCHAR(50)    NOT NULL);");

		insertString = "'"+uuid+"'" + "," + "none"+ ","+ type +"," + id + ","  +created+ "," + artist + "," + title + "," + country + "," + city + "," + genre +"," + link;

		db.run("INSERT INTO PROFILE (EMAIL,EMAILCONFIRM,CREATED,FIRSTNAME,SURNAME,PASSWORD,COUNTRY,CITY,AGE,GENDER,PREFERENCES,LINK,PLAYLISTS) VALUES ("+insertString+")");  			       


	});

});



app.post('/feedback', function(req, res) {

	d = new Date();
	timestamp = "'"+d.yyyymmdd() +"'";
	var uuid = "'"+guid() +"'";
	var userID =  req.body.uID ;
	var content =  req.body.content ;
	var title =  req.body.title; 
	content = "'"+ content.replace("'", "''") +"'";
	title = "'"+ title.replace("'", "''") +"'";
	userID = "'"+ userID.replace("'", "''") +"'";


	var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };
	var client = new pg.Client(params);
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}

		d = new Date();
		timestamp = "'"+d.yyyymmdd() +"'";
		var uuid = "'"+guid() +"'";

		sqlStr1 = "INSERT INTO FEEDBACK (FEEDBACKID,USERID,TITLE,CONTENT,CREATED) VALUES ("+uuid+","+userID+","+title+","+content+","+timestamp+" )" 



		client.query(sqlStr1, function(err, row2) {

			//console.log(sqlStr1);

			if(err) {
				return console.error('error running query', err);
			}


			client.end();
			res.json({'out1':'done'})

		});


	});


});

app.post('/bug', function(req, res) {

	d = new Date();
	timestamp = "'"+d.yyyymmdd() +"'";
	var uuid = "'"+guid() +"'";
	var userID =  req.body.uID ;
	var content =  req.body.content ;
	var title =  req.body.title; 
	content = "'"+ content.replace("'", "''") +"'";
	title = "'"+ title.replace("'", "''") +"'";
	userID = "'"+ userID.replace("'", "''") +"'";


	var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };
	var client = new pg.Client(params);
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}

		d = new Date();
		timestamp = "'"+d.yyyymmdd() +"'";
		var uuid = "'"+guid() +"'";

		sqlStr1 = "INSERT INTO BUGS (BUGID,USERID,TITLE,CONTENT,CREATED) VALUES ("+uuid+","+userID+","+title+","+content+","+timestamp+" )" 



		client.query(sqlStr1, function(err, row2) {

			//console.log(sqlStr1);

			if(err) {
				return console.error('error running query', err);
			}

			client.end();
			res.json({'out1':'done'})

		});


	});


});

app.get('/getbugs', function(req, res) {

	var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };
	var client = new pg.Client(params);
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}

		d = new Date();
		timestamp = "'"+d.yyyymmdd() +"'";
		var uuid = "'"+guid() +"'";

		sqlStr1 = "SELECT BUGID,USERID,TITLE,CONTENT,CREATED FROM BUGS ORDER BY CREATED DESC" 



			client.query(sqlStr1, function(err, result) {

				//console.log(sqlStr1);

				if(err) {
					return console.error('error running query', err);
				}

				output=[];
				output1=[];
				output2=[];
				for (var i=0;i<result.rows.length;i++){
					output.push(result.rows[i].content);
					output1.push(result.rows[i].created);
					output2.push(result.rows[i].userid);
					if(i == result.rows.length-1 ){
						client.end();
						res.json({'bug':output,'date':output1,'user':output2})
					}
				};
			});
	});

})


app.get('/getfb', function(req, res) {


	var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };
	var client = new pg.Client(params);
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}

		d = new Date();
		timestamp = "'"+d.yyyymmdd() +"'";
		var uuid = "'"+guid() +"'";

		sqlStr1 = "SELECT FEEDBACKID,USERID,TITLE,CONTENT,CREATED FROM FEEDBACK ORDER BY CREATED DESC" 



			client.query(sqlStr1, function(err, result) {

				//console.log(sqlStr1);

				if(err) {
					return console.error('error running query', err);
				}

				output=[]
				output1=[]
				output2=[]
				for (var i=0;i<result.rows.length;i++){
					output.push(result.rows[i].content);
					output1.push(result.rows[i].created);
					output2.push(result.rows[i].userid);
					if(i == result.rows.length-1 ){
						client.end();
						res.json({'fb':output,'date':output1,'user':output2})
					}
				};
			});
	});

})

app.post('/next', function(req, res) {

	var userID =  req.body.uID ;
	var vidID =  "'" + req.body.vID + "'";
	var type =  "'" + req.body.type + "'";
	var playlistName =  "'" + req.body.pLName + "'";
	var genre = "'" +  req.body.genre +"'" ;

	var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };

	var output2 = 1;
	var client = new pg.Client(params);	

	if(userID=="noid"){


		data = 0;

		if(genre=="'all'"){
			sqlString = "SELECT VIDID,VOTE FROM BATTLE WHERE STATUS = 0 ORDER BY VOTE DESC LIMIT 1"	;
		}else{
			sqlString = "SELECT VIDID,VOTE FROM BATTLE WHERE STATUS = 0 AND GENRE = "+genre+" ORDER BY VOTE DESC LIMIT 1"	;
		}


		client.connect(function(err) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}
			client.query(sqlString, function(err, row) {
				if(err) {
					return console.error('error running query', err);
				}

				//console.log(row.rows[0].vidid);
				var vidID = row.rows[0].vidid ;
				votes = row.rows[0].vote;
				sqlString = "SELECT FILELINK,TITLE,ARTIST,LINK,USERNAME FROM CONTENT WHERE VIDID ='" + vidID+"'";
				//console.log(sqlString)

				client.query(sqlString, function(err, row2) {
					if(err) {
						return console.error('error running query', err);
					}
					//console.log(row2.rows[0]);
					output1 = {'id':vidID,'userID':'noid','fileLink':row2.rows[0].filelink,'songName':row2.rows[0].title,'bandName':row2.rows[0].artist,'artistLink':row2.rows[0].link,'votes':votes};

					if(genre=="'all'"){
						sqlString = "SELECT VIDID,VOTE FROM BATTLE WHERE STATUS = 1 ORDER BY RANDOM() LIMIT 1"	;	 
					}else{
						sqlString = "SELECT VIDID,VOTE FROM BATTLE WHERE STATUS = 1 AND GENRE = "+genre+" ORDER BY RANDOM() LIMIT 1"	;	 
					}
					//console.log(sqlString)

					client.query(sqlString, function(err, row3) {
						if(err) {
							return console.error('error running query', err);
						}

						var vidID = row3.rows[0].vidid;
						votes = row3.rows[0].vote;
						sqlString = "SELECT FILELINK,TITLE,ARTIST,LINK,USERNAME FROM CONTENT WHERE VIDID ='" + vidID + "'";

						//console.log(sqlString)
						client.query(sqlString, function(err, row4) {
							if(err) {
								return console.error('error running query', err);
							}
							output2 = {'id':vidID,'userID':'noid','fileLink':row4.rows[0].filelink,'songName':row4.rows[0].title,'bandName':row4.rows[0].artist,'artistLink':row4.rows[0].link,'votes':votes};
							//console.log(output2);
							client.end();
							res.json({'out1':output1,'out2':output2})

						});
					});



				});


			});
		});

	}else{
		client.connect(function(err) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}


			if(genre=="'all'"){	
				sqlStr2 = "SELECT VIDID,VOTE,VIEWS FROM BATTLE " +
				"WHERE VIDID NOT IN " +
				"(SELECT VIDID FROM VOTES WHERE " +
				"USERNAME = "+ userID +") AND STATUS = 0 " +
				"ORDER BY RANDOM() LIMIT 1"	; 
			}else{
				sqlStr2 = "SELECT VIDID,VOTE,VIEWS FROM BATTLE " +
				"WHERE VIDID NOT IN " +
				"(SELECT VIDID FROM VOTES WHERE " +
				"USERNAME = "+ userID +") AND STATUS = 0 " +
				"AND GENRE="+ genre + " " +
				"ORDER BY RANDOM() LIMIT 1"	; 
			}



			client.query(sqlStr2, function(err, result2) {
				if(err) {
					//return console.error('error running query', err);
				}

				//console.log(sqlStr2 )
				vidID2 = result2.rows[0].vidid;
				votes2 = result2.rows[0].vote;
				views2 = result2.rows[0].views;

				sqlStr3 = "SELECT FILELINK,TITLE,ARTIST,LINK,USERNAME FROM CONTENT WHERE VIDID ='" + vidID2 +"'";	


				client.query(sqlStr3, function(err, result3) {
					if(err) {
						//return console.error('error running query', err);
					}

					output1 = {'vID':vidID2,'fileLink':result3.rows[0].filelink,'songName':result3.rows[0].title,'bandName':result3.rows[0].artist,'artistLink':result3.rows[0].link,'votes':votes2};

					if(genre=="'all'"){	
						sqlStr4 = "SELECT VIDID,VOTE,VIEWS FROM BATTLE " +
						"WHERE VIDID NOT IN " +
						"(SELECT VIDID FROM VOTES WHERE " +
						"USERNAME = "+ userID +") AND STATUS = 1 " +
						"ORDER BY RANDOM() LIMIT 1"	; 
					}else{
						sqlStr4 = "SELECT VIDID,VOTE,VIEWS FROM BATTLE " +
						"WHERE VIDID NOT IN " +
						"(SELECT VIDID FROM VOTES WHERE " +
						"USERNAME = "+ userID +") AND STATUS = 1 " +
						"AND GENRE="+ genre + " " +
						"ORDER BY RANDOM() LIMIT 1"	; 
					}

					client.query(sqlStr4, function(err, result4) {
						if(err) {
							//return console.error('error running query', err);
						}

						vidID2 = result4.rows[0].vidid;
						votes2 = result4.rows[0].vote;
						views2 = result4.rows[0].views;

						sqlStr5 = "SELECT FILELINK,TITLE,ARTIST,LINK,USERNAME FROM CONTENT WHERE VIDID ='" + vidID2 +"'";	

						client.query(sqlStr5, function(err, result5) {
							if(err) {
								//return console.error('error running query', err);
							}

							client.end();
							output2 = {'vID':vidID2,'fileLink':result5.rows[0].filelink,'songName':result5.rows[0].title,'bandName':result5.rows[0].artist,'artistLink':result5.rows[0].link,'votes':votes2};
							res.json({'out1':output1,'out2':output2});

						});
					});
				});

			});
		});


	}


});


app.post('/like', function(req, res) {

	//var vidID =   JSON.stringify(req.body.vidID) ;
	//var userID =   JSON.stringify(req.body.userID) ;

	var userID = req.body.uID   ;
	var vidID = "'" + req.body.vID+"'";
	var type =  req.body.type ;
	var playlistName = req.body.pLName ;

	// 		timestamp = new Date().getTime();
	// 		var uuid = JSON.stringify(guid());

	var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };
	if(userID=="noid"){


		res.json('noid')


	}else{
		var client = new pg.Client(params);
		client.connect(function(err) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}

			d = new Date();
			timestamp = "'"+d.yyyymmdd() +"'";
			var uuid = "'"+guid() +"'";



			if(type=="legendbin") {	//vote	



				sqlStr1 = "SELECT * FROM VOTES WHERE VIDID= "+vidID+" AND USERNAME= "+userID

				client.query(sqlStr1, function(err, result) {
					if(err) {
						return console.error('error running query', err);
					}
					
					//console.log(result.rows);

					if(result.rows.length>0){
						//console.log('error');
						res.send( 'error' );
						client.end();

					}else{

						sqlStr1 = "INSERT INTO VOTES (ID,VIDID,USERNAME,VOTE,DATE) VALUES ("+uuid+","+vidID+","+userID+",1,"+timestamp+" )" 
						sqlStr2 = "UPDATE BATTLE set VOTE = VOTE+1 where VIDID="+vidID



						client.query(sqlStr1, function(err, result) {
							if(err) {
								return //console.error('error running query', err);
							}
							client.query(sqlStr2, function(err, result) {
								if(err) {
									return //console.error('error running query', err);
								}
								client.end();
								res.json('submitted')		
							});	
						});

					}

				});


			}else if(type=="legendkeep") {	//add to playlist


				sqlStr = "SELECT * FROM PLAYLIST WHERE VIDID= "+vidID+" AND USERNAME= "+userID+" AND PLAYLISTNAME= "+playlistName
				client.query(sqlStr, function(err, result) {
					if(err) {
						return console.error('error running query', err);
					}
					//console.log(result.rows);

					if(result.rows.length>0){
						//console.log('error');
						res.send( 'error' );
						client.end();

					}else{

						sqlStr1 = "INSERT INTO PLAYLIST (VIDID,USERNAME,PLAYLISTNAME,PLAYS,DATE) VALUES ("+vidID+","+userID+","+playlistName+",1,"+timestamp+" )"
						//console.log(sqlStr1 )
						//console.log(sqlStr2 )
						client.query(sqlStr1, function(err, result) {
							if(err) {
								return //console.error('error running query', err);
							}
							client.end();
							res.json('submitted')		
						});
					}

				});





			}else if(type=="challengerbin") {	


				sqlStr1 = "SELECT * FROM VOTES WHERE VIDID= "+vidID+" AND USERNAME= "+userID
				//console.log(sqlStr1)

				client.query(sqlStr1, function(err, result) {
					if(err) {
						return console.error('error running query', err);
					}
					//console.log(result.rows);

					if(result.rows.length>0){
						//console.log('error');
						res.send( 'error' );
						client.end();

					}else{

						sqlStr1 = "INSERT INTO VOTES (ID,VIDID,USERNAME,VOTE,DATE) VALUES ("+uuid+","+vidID+","+userID+",1,"+timestamp+" )" 
						sqlStr2 = "UPDATE BATTLE set VOTE = VOTE+1 where VIDID="+vidID

						client.query(sqlStr1, function(err, result) {
							if(err) {
								return //console.error('error running query', err);
							}
							client.query(sqlStr2, function(err, result) {
								if(err) {
									return //console.error('error running query', err);
								}
								client.end();
								res.json('submitted')		
							});	
						});

					}

				});

			}else if(type=="challengerkeep") {	


				sqlStr = "SELECT * FROM PLAYLIST WHERE VIDID= "+vidID+" AND USERNAME= "+userID+" AND PLAYLISTNAME= "+playlistName
				client.query(sqlStr, function(err, result) {
					if(err) {
						return console.error('error running query', err);
					}
					//console.log(result.rows);

					if(result.rows.length>0){
						//console.log('error');
						res.send( 'error' );
						client.end();

					}else{

						sqlStr1 = "INSERT INTO PLAYLIST (VIDID,USERNAME,PLAYLISTNAME,PLAYS,DATE) VALUES ("+vidID+","+userID+","+playlistName+",1,"+timestamp+" )"
						client.query(sqlStr1, function(err, result) {
							if(err) {
								return //console.error('error running query', err);
							}
							client.end();
							res.json('submitted')		
						});
					}

				});



			} 			


		});
	}


});



app.post('/login', function (req, res) {



	var email =   "'"+req.body.username+"'" ;
	var password =   "'"+req.body.password +"'" ;
	var userID =  email ;



var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };

	var output2 = 1;
	sqlStr1 = "SELECT EMAIL,FIRSTNAME,PLAYLISTS from PROFILE WHERE EMAIL="+email+" AND PASSWORD ="+password

	var client = new pg.Client(params);
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}
		client.query(sqlStr1, function(err, result) {
			if(err) {
				return //console.error('error running query', err);
			}


			if(result.rows.length>0){

				userName = result.rows[0].firstname;
				loggedIn  = 1;
				pLName = result.rows[0].playlists;
				output3 = {'userName':userName,'userID':userID,'loggedIn':loggedIn,'plName':pLName};


				sqlStr2 = "SELECT VIDID,VOTE,VIEWS FROM BATTLE " +
				"WHERE VIDID NOT IN " +
				"(SELECT VIDID FROM VOTES WHERE " +
				"USERNAME = "+ userID +") AND STATUS = 0 " +
				"ORDER BY RANDOM() LIMIT 1"	; 

				client.query(sqlStr2, function(err, result2) {
					if(err) {
						//return console.error('error running query', err);
					}

					//console.log(sqlStr2 )
					vidID2 = result2.rows[0].vidid;
					votes2 = result2.rows[0].vote;
					views2 = result2.rows[0].views;

					sqlStr3 = "SELECT FILELINK,TITLE,ARTIST,LINK,USERNAME FROM CONTENT WHERE VIDID ='" + vidID2 +"'";	


					client.query(sqlStr3, function(err, result3) {
						if(err) {
							//return console.error('error running query', err);
						}

						output1 = {'vID':vidID2,'fileLink':result3.rows[0].filelink,'songName':result3.rows[0].title,'bandName':result3.rows[0].artist,'artistLink':result3.rows[0].link,'votes':votes2};

						sqlStr4 = "SELECT VIDID,VOTE,VIEWS FROM BATTLE " +
						"WHERE VIDID NOT IN " +
						"(SELECT VIDID FROM VOTES WHERE " +
						"USERNAME = "+ userID +") AND STATUS = 1 " +
						"ORDER BY RANDOM() LIMIT 1"	; 

						client.query(sqlStr4, function(err, result4) {
							if(err) {
								//return console.error('error running query', err);
							}

							vidID2 = result4.rows[0].vidid;
							votes2 = result4.rows[0].vote;
							views2 = result4.rows[0].views;

							sqlStr5 = "SELECT FILELINK,TITLE,ARTIST,LINK,USERNAME FROM CONTENT WHERE VIDID ='" + vidID2 +"'";	

							client.query(sqlStr5, function(err, result5) {
								if(err) {
									//return console.error('error running query', err);
								}

								client.end();
								output2 = {'vID':vidID2,'fileLink':result5.rows[0].filelink,'songName':result5.rows[0].title,'bandName':result5.rows[0].artist,'artistLink':result5.rows[0].link,'votes':votes2};
								res.json({'out1':output1,'out2':output2,'out3':output3});

							});
						});
					});

				});

			}else{
				client.end();
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

//	var db = new sqlite3.Database('bbbDB');

	var options = {
			host: 'http://api.hostip.info',
			path: '/get_json.php'
	};



	request("http://api.hostip.info/get_json.php", function(error, response, body) {

		body = JSON.parse(body)
		var countryIP = body["country_name"];
		var cityIP = body["city"]; 




		if(req.body.type=="fan"){


			var type =   "'" +req.body.type +"'"  ;
			var email =   "'" +req.body.email+"'" ;
			var emailConfirm = "'1'";
			d = new Date();
			timeStamp = d.yyyymmdd();
			created = "'" +timeStamp+"'" ;
			username = req.body.uname ;
			firstname = req.body.firstname;
			surname  = req.body.lastname;
			password =  req.body.password ;
			country= "'" +countryIP+"'" ;
			city =  "'" +cityIP+"'" ;
			birthday = "'" +req.body.age2+"'" ;
			gender = "'" +req.body.gender2+"'" ;
			preferences  = "'" +req.body.prefs3 +"'" ;
			link =  "'slamstr.com '" ;
			playList = "'playList1,playList2,playList3,playList4,playList5'" ;



			username = username.replace("'", "''") ;
			username = username.replace("*", "") ;
			username = username.replace("=", "") ;
			username = "'"+ username +"'";

			firstname = firstname.replace("'", "''") ;
			firstname = firstname.replace("*", "") ;
			firstname = firstname.replace("=", "") ;
			firstname = "'"+ firstname +"'";

			surname = surname.replace("'", "''") ;
			surname = surname.replace("*", "") ;
			surname = surname.replace("=", "") ;
			surname = "'"+ surname +"'";

			password = password.replace("'", "''") ;
			password = password.replace("*", "") ;
			password = password.replace("=", "") ;
			password = "'"+ password +"'";



			insertString = type +"," + email + "," + emailConfirm + "," + username +"," +created+ "," + firstname + "," + surname + "," + password + "," + country + "," + city + "," + birthday + "," + gender + "," + preferences + "," + link + "," + playList;
		}else{

			var type =   "'" +req.body.type +"'"  ;
			var email =   "'" +req.body.email+"'" ;
			var emailConfirm = "'1'";
			d = new Date();
			timeStamp = d.yyyymmdd();
			created = "'" +timeStamp+"'" ;
			username = req.body.uname ;
			firstname = req.body.firstname;
			surname  = req.body.lastname;
			password =  req.body.password ;
			country= "'" +countryIP+"'" ;
			city =  "'" +cityIP+"'" ;
			birthday = "'" +req.body.age+"'" ;
			gender = "'" +req.body.gender+"'" ;
			preferences  = "'" +req.body.prefs2 +"'" ;
			link =  "'slamstr.com '" ;
			playList = "'playList1,playList2,playList3,playList4,playList5'" ;

			username = username.replace("'", "''") ;
			username = username.replace("*", "") ;
			username = username.replace("=", "") ;
			username = "'"+ username +"'";

			firstname = firstname.replace("'", "''") ;
			firstname = firstname.replace("*", "") ;
			firstname = firstname.replace("=", "") ;
			firstname = "'"+ firstname +"'";

			surname = surname.replace("'", "''") ;
			surname = surname.replace("*", "") ;
			surname = surname.replace("=", "") ;
			surname = "'"+ surname +"'";

			password = password.replace("'", "''") ;
			password = password.replace("*", "") ;
			password = password.replace("=", "") ;
			password = "'"+ password +"'";

			insertString = type +"," + email + "," + emailConfirm + "," + username +"," +created+ "," + firstname + "," + surname + "," + password + "," + country + "," + city + "," + birthday + "," + gender + "," + preferences + "," + link + "," + playList;

		}

		//console.log(insertString)

		var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };
		var client = new pg.Client(params);


		data = 0;
		sqlStr = "SELECT EMAIL from PROFILE WHERE EMAIL="+email
		//console.log(sqlStr);



		client.connect(function(err) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}
			client.query(sqlStr, function(err, result) {
				if(err) {
					return console.error('error running query', err);
				}
				//console.log(result.rows);

				if(result.rows.length>0){
					//console.log('error');
					res.send( output );
					client.end();

				}else{

					sqlStr2 = "INSERT INTO PROFILE (TYPE,EMAIL,EMAILCONFIRM,USERNAME,CREATED,FIRSTNAME,SURNAME,PASSWORD,COUNTRY,CITY,AGE,GENDER,PREFERENCES,LINK,PLAYLISTS) VALUES ("+insertString+")";  

					client.query(sqlStr2, function(err, result) {
						if(err) {
							return console.error('error running query', err);
						}
						//console.log(result.rows);


						//client.query("select count (title) from content", function(err, result) {
						//if(err) {
						//  return console.error('error running query', err);
						//}
						//console.log(result.rows);

						client.end();
						res.send( output );
					});
				}

			});
		});



	});



});



app.get('/listFiles', function (req, res) {
	fs.readdir(__dirname+"/public/music/" , function(err, list) {
		//console.log(list)
		res.json(JSON.stringify(list));
	});
});


app.post('/createTable', function (req, res) {

	var genre =   "'" +req.body.genre +"'"  ;
	var artistsA = new Array();
	var fileLinkA = new Array();
	var genreA = new Array();
	var titleA = new Array();
	var linkA = new Array();
	var output = []



	var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };

	if(genre=="'all'"){
		var sqlStr1 = "SELECT VIDID,VOTE FROM BATTLE ORDER BY VOTE DESC LIMIT 20"
	}else{
		var sqlStr1 = "SELECT VIDID,VOTE FROM BATTLE WHERE GENRE="+genre+" ORDER BY VOTE DESC LIMIT 20"
	}

	var client = new pg.Client(params);
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}
		client.query(sqlStr1, function(err, result) {
			if(err) {
				return //console.error('error running query', err);
			}
			//console.log(sqlStr1);

			vidID = [];
			votes = [];
			//row.forEach(function(rows4){
			for (var i=0;i<result.rows.length;i++){
				vidID.push("'"+result.rows[i].vidid+"'");
				votes.push("'"+result.rows[i].vote+"'");
			};

			//vidID.length)console.log(vidID.length)

			for (var i=0;i<vidID.length;i++){

				sqlStr = "SELECT CONTENT.VIDID,CONTENT.ARTIST,CONTENT.FILELINK,CONTENT.GENRE,CONTENT.TITLE,CONTENT.LINK,BATTLE.VOTE "+
				"from CONTENT JOIN BATTLE ON BATTLE.VIDID = CONTENT.VIDID "+
				"WHERE CONTENT.VIDID="+vidID[i]  ;


				client.query(sqlStr, function(err, result2) {
					if(err) {
						return console.error('error running query', err);
					}

					artistsA.push(result2.rows[0].artist);

					//console.log(output);
					output.push({'vidid':result2.rows[0].vidid,'artist':result2.rows[0].artist,'fileLink':result2.rows[0].filelink,'genre':result2.rows[0].genre,'title':result2.rows[0].title,'votes':result2.rows[0].vote});

					if(artistsA.length==vidID.length){
						//console.log({'artist':artistsA,'fileLink':fileLinkA,'genre':genreA,'title':titleA,'link':linkA})
						//res.json({'artist':artistsA,'fileLink':fileLinkA,'genre':genreA,'title':titleA,'link':linkA});
						client.end();
						res.json(output);
					}

				});
			}
		});
	});
});




app.get('/getTop', function (req, res) {


	output = [];
	var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };

	var sqlStr1 = "SELECT VIDID,VOTE FROM BATTLE ORDER BY VOTE DESC LIMIT 1"

	var client = new pg.Client(params);
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}
		client.query(sqlStr1, function(err, result) {
			if(err) {
				return //console.error('error running query', err);
			}
			//console.log(sqlStr1);

			vidID = [];
			votes = [];
			//row.forEach(function(rows4){
			for (var i=0;i<result.rows.length;i++){
				vidID.push("'"+result.rows[i].vidid+"'");
				votes.push("'"+result.rows[i].vote+"'");
			};

			//vidID.length)console.log(vidID.length)

			//console.log(vidID)

			for (var i=0;i<vidID.length;i++){

				sqlStr = "SELECT CONTENT.ARTIST,CONTENT.FILELINK,CONTENT.GENRE,CONTENT.TITLE,CONTENT.LINK,BATTLE.VOTE "+
				"from CONTENT JOIN BATTLE ON BATTLE.VIDID = CONTENT.VIDID "+
				"WHERE CONTENT.VIDID="+vidID[i]  ;


				client.query(sqlStr, function(err, result2) {
					if(err) {
						return console.error('error running query', err);
					}

					//artistsA.push(result2.rows[0].artist);

					//console.log(output);
					output.push({'vidID':result2.rows[0].vidid,'artist':result2.rows[0].artist,'fileLink':result2.rows[0].filelink,'genre':result2.rows[0].genre,'title':result2.rows[0].title,'votes':result2.rows[0].vote});

					//if(artistsA.length==vidID.length){
						//console.log({'artist':artistsA,'fileLink':fileLinkA,'genre':genreA,'title':titleA,'link':linkA})
						//res.json({'artist':artistsA,'fileLink':fileLinkA,'genre':genreA,'title':titleA,'link':linkA});
						client.end();
						res.json(output);
					//}

				});
			}
		});
	});
});




app.post('/getPlaylist', function (req, res) {

	var userID = req.body.uID;
	var artistsA = new Array();
	//console.log(userID);

	output = []

	if(userID=="noid"){

		res.json({'message':'noid'});

	}else{

		var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };
		var sqlStr1 = "SELECT VIDID,PLAYS,DATE from PLAYLIST WHERE USERNAME="+userID+" ORDER BY plays"
		var client = new pg.Client(params);
		client.connect(function(err) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}
			client.query(sqlStr1, function(err, result) {
				if(err) {
					return //console.error('error running query', err);
				}
				//console.log(sqlStr1);

				vidID = [];
				votes = [];
				//row.forEach(function(rows4){
				for (var i=0;i<result.rows.length;i++){
					vidID.push("'"+result.rows[i].vidid+"'");
				};


				for (var i=0;i<vidID.length;i++){

					sqlStr = "SELECT CONTENT.ARTIST,CONTENT.FILELINK,CONTENT.GENRE,CONTENT.TITLE,CONTENT.LINK,PLAYLIST.PLAYS,PLAYLIST.DATE "+
					"from CONTENT JOIN PLAYLIST ON PLAYLIST.VIDID = CONTENT.VIDID "+
					"WHERE CONTENT.VIDID="+vidID[i] 
					"AND PLAYLIST.USERNAME="+userID;


					client.query(sqlStr, function(err, result2) {
						if(err) {
							return console.error('error running query', err);
						}

						artistsA.push(result2.rows[0].artist);

						output.push({'playlist':'playlist1','artist':result2.rows[0].artist,'fileLink':result2.rows[0].filelink,'genre':result2.rows[0].genre,'title':result2.rows[0].title,'plays':result2.rows[0].plays,'dates':result2.rows[0].dates});
						//output.push({'artist':rows2.ARTIST,'fileLink':rows2.FILELINK,'genre':rows2.GENRE,'title':rows2.TITLE,'plays':rows2.PLAYS,'dates':rows2.DATES});

						if(artistsA.length==vidID.length){
							//console.log({'artist':artistsA,'fileLink':fileLinkA,'genre':genreA,'title':titleA,'link':linkA})
							//res.json({'artist':artistsA,'fileLink':fileLinkA,'genre':genreA,'title':titleA,'link':linkA});
							client.end();
							res.json(output);
						}

					});
				}
			});
		});



	}
	//res.json({'msg':artistsA});

})


app.post('/getAccount', function (req, res) {

	var userID = req.body.uID ;
	var artistsA = new Array();
	//console.log(userID);
	output = []

	if(userID=="'noid'"){

		res.json({'message':'noid'});

	}else{

		var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };
		//var sqlStr1 = "SELECT VIDID,VOTE FROM BATTLE ORDER BY VOTE DESC"
		var sqlStr1 = "SELECT TYPE, EMAIL, USERNAME, FIRSTNAME, SURNAME, COUNTRY, CITY, AGE, GENDER, PREFERENCES, LINK FROM PROFILE WHERE EMAIL="+userID; 
		var client = new pg.Client(params);

		client.connect(function(err) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}
			client.query(sqlStr1, function(err, result) {
				if(err) {

					return //console.error('error running query', err);
				}
				//console.log(sqlStr1);

				output.push({'type':result.rows[0].type,'email':result.rows[0].email,'uname':result.rows[0].username,  'fname':result.rows[0].firstname, 'lname':result.rows[0].surname, 'country':result.rows[0].country,'city':result.rows[0].city,'age':result.rows[0].age, 'gender':result.rows[0].gender,'prefs':result.rows[0].preferences,'link':result.rows[0].link});

				if(output.length==1){
					res.json(output);
					client.end();
				}

			});
		});
	}



})


app.post('/upload', function(req, res) {


	var uuid = guid() ;
	var type =  req.body.type  ;

	//console.log(type)

	if(type == "mp4"){
		type =   "'" +type+"'"  ;

		var tmp_path = req.files.files.path;
		var target_path = './public/video/' + uuid;

		var id =   "'" +req.body.id+"'" ;
		d = new Date();
		timeStamp = d.yyyymmdd();
		created = "'" +timeStamp+"'" ;
		artist = "'" +req.body.artist+"'" ;
		title = "'" +req.body.title+"'" ;
		country= "'" +req.body.country+"'" ;
		city =  "'" +req.body.city+"'" ;
		genre  = "'" +req.body.genre2 +"'" ;
		link =  "'slamstr.com '" ;

		insertString = "'"+uuid+"'" + "," + "'none'"+ ","+ id + "," +type +","  + genre +"," + title + "," + artist + "," +created+ ","  + city + ","+ country + ","   + link;
		//console.log(insertString)


		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
			fs.unlink(tmp_path, function() {
				if (err) throw err;

				fs.rename(tmp_path2, target_path2, function(err) {
					if (err) throw err;
					// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
					fs.unlink(tmp_path2, function() {
						if (err) throw err;



						sqlStr1 = "INSERT INTO AWAITINGAPPROVAL (VIDID,FILELINK,USERNAME,FILETYPE,GENRE,TITLE,ARTIST,CREATED,CITY,COUNTRY,LINK) VALUES ("+insertString+")" 

						//console.log(sqlStr2)
						var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };
						var client = new pg.Client(params);
						client.connect(function(err) {
							if(err) {
								return console.error('could not connect to postgres', err);
							}
							client.query(sqlStr1, function(err, result) {
								if(err) {
									return //console.error('error running query', err);
								}
								client.end();
							});
						});


						output = "<!DOCTYPE html>"+
						"<html>"+
						"<head>"+
						"<title>slamstr</title>"+
						"<script src=\"js/jquery.min.js\" type=\"text/javascript\"></script>"+
						"</head>"+
						"<body>"+

						"<script type=\"text/javascript\">"+
						"$(document).ready(function() {"+

						"	 window.location.replace(\"/upload.html\");"+

						"});"+
						" </script>"
						"<h3>Redirecting</h3>"+
						"</body>"+
						"</html>";

						res.send(output);

					});
				});
			});
		});


	}else if(type == "mp3"){
		type =   "'" +type+"'"  ;


		var tmp_path = req.files.files.path;
		var target_path = './public/music/' + uuid;
		var tmp_path2 = req.files.files2.path;
		var target_path2 = './public/picture/' + uuid;

		var id =   "'" +req.body.id+"'" ;
		d = new Date();
		timeStamp = d.yyyymmdd();
		created = "'" +timeStamp+"'" ;
		artist = "'" +req.body.artist+"'" ;
		title = "'" +req.body.title+"'" ;
		country= "'" +req.body.country+"'" ;
		city =  "'" +req.body.city+"'" ;
		genre  = "'" +req.body.genre2 +"'" ;
		link =  "'slamstr.com '" ;

		insertString = "'"+uuid+"'" + "," + "'none'"+ ","+ id + "," +type +","  + genre +"," + title + "," + artist + "," +created+ ","  + city + ","+ country + ","   + link;
		//console.log(insertString)


		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
			fs.unlink(tmp_path, function() {
				if (err) throw err;

				fs.rename(tmp_path2, target_path2, function(err) {
					if (err) throw err;
					// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
					fs.unlink(tmp_path2, function() {
						if (err) throw err;

						sqlStr1 = "INSERT INTO AWAITINGAPPROVAL (VIDID,FILELINK,USERNAME,FILETYPE,GENRE,TITLE,ARTIST,CREATED,CITY,COUNTRY,LINK) VALUES ("+insertString+")" 
						//console.log(sqlStr1)	

						//console.log(sqlStr2)
						var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };
						var client = new pg.Client(params);
						client.connect(function(err) {
							if(err) {
								return console.error('could not connect to postgres', err);
							}
							client.query(sqlStr1, function(err, result) {
								if(err) {
									return //console.error('error running query', err);
								}
								client.end();
							});
						});


						output = "<!DOCTYPE html>"+
						"<html>"+
						"<head>"+
						"<title>slamstr</title>"+
						"<script src=\"js/jquery.min.js\" type=\"text/javascript\"></script>"+
						"</head>"+
						"<body>"+

						"<script type=\"text/javascript\">"+
						"$(document).ready(function() {"+

						"	 window.location.replace(\"/upload.html\");"+

						"});"+
						" </script>"
						"<h3>Redirecting</h3>"+
						"</body>"+
						"</html>";

						res.send(output);

					});
				});
			});
		});


	}else if(type == "yt"){
		type =   "'" +type+"'"  ;



		var id =   "'" +req.body.id+"'" ;
		d = new Date();
		timeStamp = d.yyyymmdd();
		created = "'" +timeStamp+"'" ;
		artist = "'" +req.body.artist+"'" ;
		title = "'" +req.body.title+"'" ;
		country= "'" +req.body.country+"'" ;
		city =  "'" +req.body.city+"'" ;
		genre  = "'" +req.body.genre2 +"'" ;
		ytLink  = "'" +req.body.link +"'" ;
		link =  "'slamstr.com '" ;

		insertString = "'"+uuid+"'" + "," + ytLink + ","+ id + "," +type +","  + genre +"," + title + "," + artist + "," +created+ ","  + city + ","+ country + ","   + link;
		//console.log(insertString)

		sqlStr1 = "INSERT INTO AWAITINGAPPROVAL (VIDID,FILELINK,USERNAME,FILETYPE,GENRE,TITLE,ARTIST,CREATED,CITY,COUNTRY,LINK) VALUES ("+insertString+")" 


		//console.log(sqlStr2)
		var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };

		var client = new pg.Client(params);
		client.connect(function(err) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}
			client.query(sqlStr1, function(err, result) {
				if(err) {
					return //console.error('error running query', err);
				}
				client.end();
			});
		});

		output = "<!DOCTYPE html>"+
		"<html>"+
		"<head>"+
		"<title>slamstr</title>"+
		"<script src=\"js/jquery.min.js\" type=\"text/javascript\"></script>"+
		"</head>"+
		"<body>"+

		"<script type=\"text/javascript\">"+
		"$(document).ready(function() {"+

		"	 window.location.replace(\"/upload.html\");"+

		"});"+
		" </script>"
		"<h3>Redirecting</h3>"+
		"</body>"+
		"</html>";

		res.send(output);


	}





});







app.get('/getAllTracks', function (req, res) {

	var artistsA = new Array();
	var fileLinkA = new Array();
	var genreA = new Array();
	var titleA = new Array();
	var linkA = new Array();
	var output = []



	var DBHost =  process.env.DBHost;
var DBUser =  process.env.DBUser;
var DBPassword =  process.env.DBPassword;
var DB =  process.env.DB;

	
	var params = {host: DBHost,user: DBUser,password: DBPassword,database: DB,ssl: true };

	var sqlStr1 = "SELECT VIDID,ARTIST,TITLE FROM CONTENT"
		var client = new pg.Client(params);
	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}
		client.query(sqlStr1, function(err, result) {
			if(err) {
				return //console.error('error running query', err);
			}
			//console.log(sqlStr1);

			vidID = [];
			votes = [];
			//row.forEach(function(rows4){
			for (var i=0;i<result.rows.length;i++){
				vidID.push("'"+result.rows[i].vidid+"'");
				votes.push("'"+result.rows[i].vote+"'");


				output.push({'artist':result2.rows[0].artist,'fileLink':result2.rows[0].filelink,'genre':result2.rows[0].genre,'title':result2.rows[0].title,'votes':result2.rows[0].vote});

				if(artistsA.length==50){
					client.end();
					res.json(output);
				}

			};




		});
	});
});


AWS.config.update({
	//accessKeyId:: process.env.AWS_ACCESS_KEY_ID,
    //secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	//accessKeyId: accessKeyId,
	//secretAccessKey: secretAccessKey
});

var s3 = new AWS.S3();

app.post('/uploadTest', function(req, res){


	//console.log(req.files.files.codeID)
	var path = req.files.files.path;
	fs.readFile(path, function(err, file_buffer){
		var params = {
				Bucket: 'slamstr',
				Key: 'myKey1234.png',
				Body: file_buffer
		};

		s3.putObject(params, function (perr, pres) {
			if (perr) {
				console.log("Error uploading data: ", perr);
			} else {
				console.log("Successfully uploaded data to myBucket/myKey");
			}

			res.json("done");

		});
	});
});


//npm install express-mailer
//mailer = require('express-mailer');
//app.get('/', function (req, res, next) {
//app.mailer.send('email', {
//to: 'example@example.com', // REQUIRED. This can be a comma delimited string just like a normal email to field. 
//subject: 'Test Email', // REQUIRED.
//otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
//}, function (err) {
//if (err) {
////handle error
//console.log(err);
//res.send('There was an error sending the email');
//return;
//}
//res.send('Email Sent');
//});
//});






//Begin listening

var port = process.env.PORT || 5000;
app.listen(port, function() {
	//console.log("Listening on " + port);
});
//console.log("Express server is listening on port %d in %s mode", app.address().port, app.settings.env);//Module dependencies
