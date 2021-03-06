/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
		
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scan, false);
		document.getElementById('gotopage').addEventListener('click', this.gotopage, false);
        document.getElementById('encode').addEventListener('click', this.encode, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
		var db = window.sqlitePlugin.openDatabase({name: "sa.db", createFromLocation: 1});
		db.executeSql('select count(*) as rowscount from ta', [], function(res){
		alert("record count " + res.rows.item(0).rowscount);
		}, function(error) {
    alert("SELECT SQL statement ERROR: " + error.message);		
		} );
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        alert('Received Event: ' + id);
    },

    scan: function() {
        console.log('scanning');
        
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) { 

            alert("Получен штрихкод\n" + 
            "Результат: " + result.text + "\n" + 
            "Формат: " + result.format + "\n" + 
            "Отмена: " + result.cancelled);  

            /* console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");
            document.getElementById("info").innerHTML = result.text;
            console.log(result);
			window.open('http://www.opti-com.ru/catalog/online/categories/product-%D0%900000002832/', '_blank', 'location=yes');
            
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) { 
            alert("Scanning failed: ", error); 
        } );
    },
	
	gotopage: function() {
		var scanner = cordova.require("cordova/plugin/BarcodeScanner");
		scanner.scan( 
			function (result) {
				var sqlstr = "select * from ta where c=" + result.text;
				alert(sqlstr);
				var db = window.sqlitePlugin.openDatabase({name: "sa.db", createFromLocation: 1});
				db.executeSql(sqlstr, [], 
					function(res){
						alert("product " + res.rows.item(0).b);
						var stgo = "http://www.opti-com.ru/catalog/online/categories/product-" + res.rows.item(0).b + "/";
						alert(stgo);						
						window.open(stgo, '_blank', 'location=yes');	
					}, 
					function(error) {
    						alert("SELECT SQL statement ERROR: " + error.message);		
					} 
					);
			}, 
			function (error) { 
           			alert("Scanning failed: ", error); 
        		} 
		);	
		},

    encode: function() {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.opti-com.ru", function(success) {
            alert("encode success: " + success);
          }, function(fail) {
            alert("encoding failed: " + fail);
          }
        );

    }

};
