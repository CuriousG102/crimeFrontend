var RequestMaker = {
    _API_URL: "http://104.131.36.238/crimeAPI/",
    crime_list : function(startDate, endDate, offense, category, district, callback) {
        this._crime_query(false, startDate, endDate, offense, category, district, callback);
    },
    crime_count : function(startDate, endDate, offense, category, district, callback) {
        this._crime_query(true, startDate, endDate, offense, category, district, callback);
    },
    offense_list : function(callback) {
        this._query_list(this._API_URL + "offense/", {}, callback);
    },
    category_list : function(callback) {
        this._query_list(this._API_URL + "category/", {}, callback);
    },
    _crime_query : function (isCount, startDate, endDate, offense, category, district, callback) {
        var queryDict = {}; 
        if (startDate) {
            var startDateString = this._date_string(startDate);
            queryDict['offenseStartRange'] = startDateString;
        }
        if (endDate) {
            var endDateString = this._date_string(endDate);
            queryDict['offenseEndRange'] = endDateString;
        }
        if (offense) {
            queryDict['offense'] = offense;
        }
        if (category) {
            queryDict['category'] = category;
        }
        if (isCount) {
            this._query_detail(this._API_URL + "count/", queryDict, callback);
        } else {
            this._query_list(this._API_URL + "crime/", queryDict, callback);
        }
    },
    _date_string : function(date) {
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd = date.getDate().toString();
        return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]);
    },
    _query_list: function (url, queryDict, callback) {
        queryURL = this._encodeQueryData(url, queryDict);
        this._query_list_helper(queryURL, [], callback, {});
    },
    _query_list_helper: function(url, accumArray, callback, resp) {
        if (Object.keys(resp).length === 0) {
            this._query(url, function (accumArray, callback, error, response) {
                this._query_list_helper("doesntMatter", accumArray, callback, response);
            }.bind(this, accumArray, callback));
        } else {
            for (var i = 0; i < resp['results'].length; i++)
                accumArray.push(resp['results'][i]);
            // accumArray.push.apply(resp['results']);
            if (resp['next']) {
                this._query(resp['next'], function (accumArray, callback, error, response) {
                    this._query_list_helper("doesntMatter", accumArray, callback, response);
                }.bind(this, accumArray, callback));
            }
            else {
                callback(null, accumArray);
            }
        }
    },
    _query_detail: function (url, queryDict, callback) {
        queryURL = this._encodeQueryData(url, queryDict);
        this._query(queryURL, callback);
    },
    _query: function (url, callback) {
        d3.json(url, callback);
    },
    _encodeQueryData: function (url, data) {
        // http://stackoverflow.com/questions/111529/create-query-parameters-in-javascript
        if (Object.keys(data).length != 0) {
            var ret = [];
            for (var d in data)
              ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
            return url + "?" + ret.join("&");
        }

        return url;
    }
}

var reqMaker = Object.create(RequestMaker);