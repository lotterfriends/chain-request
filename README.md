# chain-request
A simple chainable, readable object with the intense to make speaking HTTP sane.

## Installation
```bash
> npm install --save chain-request
```

## Usage
Just include the module and name it, e.g.:
```javascript
var request = require('chain-request');
```

## Examples

Use the google REST-API
```javascript
new request()
	.get('http://ajax.googleapis.com/ajax/services/search/web')
	.expects(request.CONTENT_TYPE.JSON)
	.data({
		v: '1.0',
		q: 'test'
	})
	.send(function(data) {
		data.responseData.results.forEach(function(result) {
			console.log(result);
		});
	});
```

Upload a file with authorization Header
```javascript
new request()
	.post('https://build.phonegap.com/api/v1/apps')
	.expects(request.CONTENT_TYPE.JSON)
	.addAuthorizationHeader('Basic: a2Vrc2U6a3VjaGVu')
	.data('app.zip')
	.sendMultipart()
	.send(function(result) {
		console.log(result);
	})
```
Get a specific jira task
```javascript
new request()
	.get('https://my-jira.tld/rest/api/2/issue/FOO-39')
	.expects(request.CONTENT_TYPE.JSON)
	.addAuthorizationHeader('Basic: a2Vrc2U6a3VjaGVu')
	.send(function(result) {
		console.log(result);
	})
```

## API

### Functions
<dl>
<dt><a href="#Request">Request([debug])</a></dt>
<dd><p>A simple chainable, readable object with the intense to make speaking HTTP sane.</p>
</dd>
<dt><a href="#get">get()</a> ⇒ <code>object</code></dt>
<dd><p>Make a get request</p>
</dd>
<dt><a href="#put">put()</a> ⇒ <code>object</code></dt>
<dd><p>make a put request</p>
</dd>
<dt><a href="#post">post()</a> ⇒ <code>object</code></dt>
<dd><p>make a post request</p>
</dd>
<dt><a href="#patch">patch()</a> ⇒ <code>object</code></dt>
<dd><p>make a patch request</p>
</dd>
<dt><a href="#delete">delete()</a> ⇒ <code>object</code></dt>
<dd><p>make a delete request</p>
</dd>
<dt><a href="#options">options()</a> ⇒ <code>object</code></dt>
<dd><p>make a options request</p>
</dd>
<dt><a href="#head">head()</a> ⇒ <code>object</code></dt>
<dd><p>make a head request</p>
</dd>
<dt><a href="#data">data(data)</a> ⇒ <code>object</code></dt>
<dd><p>set the data for the request</p>
</dd>
<dt><a href="#addHeader">addHeader(key, value)</a> ⇒ <code>object</code></dt>
<dd><p>add a header</p>
</dd>
<dt><a href="#allowUnauthorized">allowUnauthorized()</a> ⇒ <code>object</code></dt>
<dd><p>Don&#39;t verifie against the list of supplied CAs.</p>
</dd>
<dt><a href="#addAuthorizationHeader">addAuthorizationHeader(authStr)</a> ⇒ <code>object</code></dt>
<dd><p>set a authorization header</p>
</dd>
<dt><a href="#setSendContentType">setSendContentType(contentType)</a> ⇒ <code>object</code></dt>
<dd><p>set which type of format you want to send, default ist json</p>
</dd>
<dt><a href="#sendsPlain">sendsPlain()</a> ⇒ <code>object</code></dt>
<dd><p>function to send plain text to the server only make sense with post or put</p>
</dd>
<dt><a href="#sendMultipart">sendMultipart()</a> ⇒ <code>object</code></dt>
<dd><p>defines a multipart request for files, used with post() and data(filename)</p>
</dd>
<dt><a href="#setBufferSize">setBufferSize(bufferSize)</a> ⇒ <code>object</code></dt>
<dd><p>set the buffer size for a multipart request default is 4 * 1024</p>
</dd>
<dt><a href="#setEncoding">setEncoding(encoding)</a> ⇒ <code>object</code></dt>
<dd><p>set the response encoding, default is utf-8</p>
</dd>
<dt><a href="#expects">expects(type)</a> ⇒ <code>object</code></dt>
<dd><p>set the format for the send callback, default is json</p>
</dd>
<dt><a href="#send">send([callback])</a> ⇒ <code>object</code></dt>
<dd><p>perform the previously created request</p>
</dd>
</dl>
<a name="Request"></a>
### Request([debug])
A simple chainable, readable object with the intense to make speaking HTTP sane.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [debug] | <code>boolean</code> | <code>false</code> | enable debugging with true |

<a name="get"></a>
### get() ⇒ <code>object</code>
make a get request

**Kind**: global function  
**Returns**: <code>object</code> - self  

<a name="put"></a>
### put() ⇒ <code>object</code>
make a put request

**Kind**: global function  
**Returns**: <code>object</code> - self  

<a name="post"></a>
### post() ⇒ <code>object</code>
make a post request

**Kind**: global function  
**Returns**: <code>object</code> - self  

<a name="patch"></a>
### patch() ⇒ <code>object</code>
make a patch request

<a name="delete"></a>
### delete() ⇒ <code>object</code>
make a delete request

**Kind**: global function  
**Returns**: <code>object</code> - self  

<a name="options"></a>
### options() ⇒ <code>object</code>
make a options request

**Kind**: global function  
**Returns**: <code>object</code> - self  

<a name="head"></a>
### head() ⇒ <code>object</code>
make a head request

**Kind**: global function  
**Returns**: <code>object</code> - self  


**Kind**: global function  
**Returns**: <code>object</code> - self  

<a name="data"></a>
### data(data) ⇒ <code>object</code>
set the data for the request

**Kind**: global function  
**Returns**: <code>object</code> - self  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | data as json object |

<a name="addHeader"></a>
### addHeader(key, value) ⇒ <code>object</code>
add a header

**Kind**: global function  
**Returns**: <code>object</code> - self  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | header key |
| value | <code>string</code> | value of the header entry |

<a name="allowUnauthorized"></a>
### allowUnauthorized() ⇒ <code>object</code>
Don't verifie against the list of supplied CAs.

**Kind**: global function  
**Returns**: <code>object</code> - self  
<a name="addAuthorizationHeader"></a>
### addAuthorizationHeader(authStr) ⇒ <code>object</code>
set a authorization header

**Kind**: global function  
**Returns**: <code>object</code> - self  

| Param | Type | Description |
| --- | --- | --- |
| authStr | <code>string</code> | authirization string |

<a name="setSendContentType"></a>
### setSendContentType(contentType) ⇒ <code>object</code>
set which type of format you want to send, default ist json

**Kind**: global function  
**Returns**: <code>object</code> - self  

| Param | Type | Description |
| --- | --- | --- |
| contentType | <code>object</code> | a valid content type |

<a name="sendsPlain"></a>
### sendsPlain() ⇒ <code>object</code>
function to send plain text to the server only make sense with post or put

**Kind**: global function  
**Returns**: <code>object</code> - self  
<a name="sendMultipart"></a>
### sendMultipart() ⇒ <code>object</code>
defines a multipart request for files, used with post() and data(filename)

**Kind**: global function  
**Returns**: <code>object</code> - self  
<a name="setBufferSize"></a>
### setBufferSize(bufferSize) ⇒ <code>object</code>
set the buffer size for a multipart request default is 4 * 1024

**Kind**: global function  
**Returns**: <code>object</code> - self  

| Param | Type | Description |
| --- | --- | --- |
| bufferSize | <code>number</code> | size in byte |

<a name="setEncoding"></a>
### setEncoding(encoding) ⇒ <code>object</code>
set the response encoding, default is utf-8

**Kind**: global function  
**Returns**: <code>object</code> - self  

| Param | Type | Description |
| --- | --- | --- |
| encoding | <code>string</code> | a valid encoding |

<a name="expects"></a>
### expects(type) ⇒ <code>object</code>
set the format for the send callback, default is json

**Kind**: global function  
**Returns**: <code>object</code> - self  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | a valid content type |

<a name="send"></a>
### send([callback]) ⇒ <code>object</code>
perform the previously created request

**Kind**: global function  
**Returns**: <code>object</code> - self  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | <code>function</code> | function called when the request is ready |

