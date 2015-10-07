var querystring = require('querystring');
var https = require('https');
var http = require('http');
var url = require('url');
var rutil = require('./request-util.js');
var util = require('util');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

Request.CONTENT_TYPE = {
  JSON: 'application/json',
  TXT: 'text/plain',
  MULTIPART: 'multipart/form-data'
};

Request.METHODES = {
 GET: 'GET',
 POST: 'POST',
 PUT: 'PUT',
 PATCH: 'PATCH',
 DELETE: 'DELETE',
 OPTIONS: 'OPTIONS',
 HEAD: 'HEAD'
};

/**
 * A simple chainable, readable object with the intense to make speaking HTTP sane.
 * @param {boolean} [debug=false] enable debugging with true
 */
function Request(debug) {

  var _debug = debug;
  var _headers = {};
  var _urlObject = false;
  var _sendContentType = Request.CONTENT_TYPE.JSON;
  var _encoding = 'UTF-8';
  var _boundaryKey = false;
  var _data = {};
  var _method = Request.METHODES.GET;
  var _endpoint;
  var _bufferSize = 4 * 1024;
  var _rejectUnauthorized = true;

  /**
   * create a header for multipart requests
   * @private
   * @return {string} the header for the request
   */
  var _createMultipartHeader = function() {
    var fileHeaderLine = [];
    fileHeaderLine.push('--' + _boundaryKey);
    fileHeaderLine.push('Content-Type: ' + mime.lookup(_data));
    fileHeaderLine.push('Content-Disposition: form-data; name="file"; filename="' + path.basename(_data) + '"');
    fileHeaderLine.push('Content-Transfer-Encoding: binary');
    fileHeaderLine.push('\r\n');
    return fileHeaderLine.join('\r\n');
  };

  /**
   * create a footer for the mulitpart request
   * @private
   * @return {string} the footer for the request
   */
  var _createMultipartFooter = function() {
    return ['\r\n--', _boundaryKey, '--'].join('');
  };

  /**
   * create a options object for the request
   * @private
   * @return {obkect} options used for the request
   */
  var _createOptions = function() {
    var options = {
      host: _urlObject.hostname,
      path: _endpoint,
      method: _method,
      headers: _headers,
      port: _urlObject.port,
      rejectUnauthorized: _rejectUnauthorized
    };
    if (_debug) {
      console.log(options);
    }
    return options;
  };

  /** 
   * get the needed protocol
   * @private
   * @return {object} the http or https object dependend on the url
   */
  var _getProtocol = function() {
    return (_urlObject.protocol === 'http:') ? http : https;
  }

  /**
   * create functions for each METHODE type (POST, GET, PUT, etc.)
   */
  for (var method in Request.METHODES) {
    this[Request.METHODES[method].toLowerCase()] = (function(method) {
      return function(paraUrl) {
        _urlObject = url.parse(paraUrl);
        _method = method;
        return this;
      }
    })(method);
  }

  /**
   * set the data for the request
   * @param  {object} data data as json object
   * @return {object}      self
   */
  this.data = function(data) {
    _data = data;
    return this;
  };

  /**
   * add a header
   * @param {string} key   header key
   * @param {string} value value of the header entry
   * @return {object} self
   */
  this.addHeader = function(key, value) {
    _headers[key] = value;
    return this;
  };

  /**
   * Don't verifie against the list of supplied CAs.
   * @return {object} self
   */
  this.allowUnauthorized = function() {
    _rejectUnauthorized = false;
    return this;
  }

  /**
   * set a authorization header
   * @param {string} authStr authirization string
   * @return {object} self
   */
  this.addAuthorizationHeader = function(authStr) {
    this.addHeader('authorization', authStr);
    return this;
  };

  /**
   * set which type of format you want to send, default ist json
   * @param {object} contentType a valid content type
   * @return {object} self
   */
  this.setSendContentType = function(contentType) {
    _sendContentType = contentType;
    return this;
  };

  /**
   * function to send plain text to the server only make sense with post or put
   * @return {object} self
   */
  this.sendsPlain = function() {
    _sendContentType = Request.CONTENT_TYPE.TXT;
    return this;
  };

  /**
   * defines a multipart request for files, used with post() and data(filename)
   * @return {object} self
   */
  this.sendMultipart = function() {
    _boundaryKey = Math.random().toString(16);
    _sendContentType = Request.CONTENT_TYPE.MULTIPART;
    this.addHeader('Content-Type', [_sendContentType,'; ', 'boundary="', _boundaryKey, '"'].join(''));
    this.setEncoding('binary');
    return this;
  };

  /**
   * set the buffer size for a multipart request default is 4 * 1024
   * @param {number} bufferSize size in byte
   * @return {object} self
   */
  this.setBufferSize = function(bufferSize) {
    _bufferSize = bufferSize;
    return this;
  }

  /**
   * set the response encoding, default is utf-8
   * @param {string} encoding a valid encoding
   * @return {object} self
   */
  this.setEncoding = function(encoding) {
    _encoding = encoding;
    return this;
  };

  /**
   * set the format for the send callback, default is json
   * @param  {string} type a valid content type
   * @return {object}      self
   */
  this.expects = function(type) {
    this.expects = type;
    return this;
  };

  /**
   * perform the previously created request
   * @param  {Function} [callback] function called when the request is ready
   * @return {object}            self
   */
  this.send = function(callback) {
    var _this = this;
    var dataString;
    var fileHeader;
    var fileFooter;

    _endpoint = _urlObject.path;

    if (_method === Request.METHODES.GET) {
      if (_data  && !rutil.isEmpty(_data)) {
        _endpoint += '?' + querystring.stringify(_data);
      }
      _data = false;
    } else if (_sendContentType == Request.CONTENT_TYPE.MULTIPART) {
      fileHeader = _createMultipartHeader();
      fileFooter = _createMultipartFooter();
      this.addHeader('Content-Length', Buffer.byteLength(fs.readFileSync(_data)) + fileHeader.length + fileFooter.length);
    } else {
      dataString = JSON.stringify(_data);
      this.addHeader('Content-Type', _sendContentType);
      this.addHeader('Content-Length', dataString.length);
    }

    var req = _getProtocol().request(_createOptions(), function(res) {
      res.setEncoding(_encoding);
      
      if(_debug) {
        console.log('resonse code:', res.statusCode);
      }

      var responseArray = [];
      res.on('data', function(resData) {
        responseArray.push(resData);
      });

      res.on('end', function() {
        var responseString = responseArray.join('');
        if (_debug) {
          console.log(responseString);
        }
        if (util.isFunction(callback)) {
          if (_this.expects === Request.CONTENT_TYPE.JSON) {
            try {
              if (!responseString) {
                callback({});
              } else {
                callback(JSON.parse(responseString));
              }
            } catch(e) {
              if (_debug) {
                console.log('Response is no valid JSON');
              }
              callback(null);
            }
          } else {
            callback(responseString);
          }
        }
      });

    });

    if (_sendContentType === Request.CONTENT_TYPE.JSON) {
      if (dataString) {
        req.write(dataString);
      }
      req.end();
    } else if (_sendContentType === Request.CONTENT_TYPE.MULTIPART) {
      req.write(fileHeader);
      fs.createReadStream(_data, {
        bufferSize: _bufferSize
      }).on('end', function() {
        req.end(fileFooter);
      }).pipe(req, { end: false });
    } else {
      if (_data && !rutil.isEmpty(_data)) {
        req.write(_data);
      }
      req.end();
    }

    req.on('error', function(error) {
      if (_debug) {
        console.log(error);
      }
    });

    return this;
  };

  return this;
}

module.exports = Request;