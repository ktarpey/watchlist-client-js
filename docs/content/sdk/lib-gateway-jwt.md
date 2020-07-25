## Contents {docsify-ignore}

* [JwtEndpoint](#JwtEndpoint) 

* [JwtGateway](#JwtGateway) 


* * *

## JwtEndpoint :id=jwtendpoint
> <p>Static utilities for JWT token generation (used for development purposes only).</p>

**Kind**: global class  
**Access**: public  

* [JwtEndpoint](#JwtEndpoint)
    * _static_
        * [.forDevelopment(user)](#JwtEndpointforDevelopment) ⇒ <code>Endpoint</code>
        * [.forTest(user)](#JwtEndpointforTest) ⇒ <code>Endpoint</code>
        * [.forDemo(user)](#JwtEndpointforDemo) ⇒ <code>Endpoint</code>


* * *

### JwtEndpoint.forDevelopment(user) :id=jwtendpointfordevelopment
> <p>Creates and starts a new [JwtEndpoint](/content/sdk/lib-gateway-jwt?id=jwtendpoint) for use in the development environment.</p>

**Kind**: static method of [<code>JwtEndpoint</code>](#JwtEndpoint)  
**Returns**: <code>Endpoint</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | <p>The identifier of the user to impersonate.</p> |


* * *

### JwtEndpoint.forTest(user) :id=jwtendpointfortest
> <p>Creates and starts a new [JwtEndpoint](/content/sdk/lib-gateway-jwt?id=jwtendpoint) for use in the test environment.</p>

**Kind**: static method of [<code>JwtEndpoint</code>](#JwtEndpoint)  
**Returns**: <code>Endpoint</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | <p>The identifier of the user to impersonate.</p> |


* * *

### JwtEndpoint.forDemo(user) :id=jwtendpointfordemo
> <p>Creates and starts a new [JwtEndpoint](/content/sdk/lib-gateway-jwt?id=jwtendpoint) for use in the demo environment.</p>

**Kind**: static method of [<code>JwtEndpoint</code>](#JwtEndpoint)  
**Returns**: <code>Endpoint</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | <p>The identifier of the user to impersonate.</p> |


* * *

## JwtGateway :id=jwtgateway
> <p>Web service gateway for obtaining JWT tokens (for development purposes).</p>

**Kind**: global class  
**Extends**: <code>Disposable</code>  
**Access**: public  

* [JwtGateway](#JwtGateway) ⇐ <code>Disposable</code>
    * _instance_
        * [.start()](#JwtGatewaystart) ⇒ [<code>Promise.&lt;JwtGateway&gt;</code>](#JwtGateway)
        * [.readToken()](#JwtGatewayreadToken) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.toRequestInterceptor()](#JwtGatewaytoRequestInterceptor) ⇒ <code>RequestInterceptor</code>
    * _static_
        * [.forDevelopmentClient(userId)](#JwtGatewayforDevelopmentClient) ⇒ <code>Promise.&lt;RequestInterceptor&gt;</code>
        * [.forTestClient(userId)](#JwtGatewayforTestClient) ⇒ <code>Promise.&lt;RequestInterceptor&gt;</code>
        * [.forDemoClient(userId)](#JwtGatewayforDemoClient) ⇒ <code>Promise.&lt;RequestInterceptor&gt;</code>
    * _constructor_
        * [new JwtGateway(endpoint, [refreshInterval])](#new_JwtGateway_new)


* * *

### jwtGateway.start() :id=jwtgatewaystart
> <p>Initializes the connection to the remote server and returns a promise
> containing the current instance</p>

**Kind**: instance method of [<code>JwtGateway</code>](#JwtGateway)  
**Returns**: [<code>Promise.&lt;JwtGateway&gt;</code>](#JwtGateway)  
**Access**: public  

* * *

### jwtGateway.readToken() :id=jwtgatewayreadtoken
> <p>Retrieves a JWT token from the remote server.</p>

**Kind**: instance method of [<code>JwtGateway</code>](#JwtGateway)  
**Returns**: <code>Promise.&lt;String&gt;</code>  
**Access**: public  

* * *

### jwtGateway.toRequestInterceptor() :id=jwtgatewaytorequestinterceptor
> <p>Returns a [RequestInterceptor](#requestinterceptor) suitable for use with other API calls.</p>

**Kind**: instance method of [<code>JwtGateway</code>](#JwtGateway)  
**Returns**: <code>RequestInterceptor</code>  
**Access**: public  

* * *

### JwtGateway.forDevelopmentClient(userId) :id=jwtgatewayfordevelopmentclient
> <p>Creates and starts a new [RequestInterceptor](#requestinterceptor) for use in the development environment.</p>

**Kind**: static method of [<code>JwtGateway</code>](#JwtGateway)  
**Returns**: <code>Promise.&lt;RequestInterceptor&gt;</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>String</code> | <p>The identifier of the user to impersonate.</p> |


* * *

### JwtGateway.forTestClient(userId) :id=jwtgatewayfortestclient
> <p>Creates and starts a new [RequestInterceptor](#requestinterceptor) for use in the testing environment.</p>

**Kind**: static method of [<code>JwtGateway</code>](#JwtGateway)  
**Returns**: <code>Promise.&lt;RequestInterceptor&gt;</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>String</code> | <p>The identifier of the user to impersonate.</p> |


* * *

### JwtGateway.forDemoClient(userId) :id=jwtgatewayfordemoclient
> <p>Creates and starts a new [RequestInterceptor](#requestinterceptor) for use in the demo environment.</p>

**Kind**: static method of [<code>JwtGateway</code>](#JwtGateway)  
**Returns**: <code>Promise.&lt;RequestInterceptor&gt;</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>String</code> | <p>The identifier of the user to impersonate.</p> |


* * *

### new JwtGateway(endpoint, [refreshInterval]) :id=new_jwtgateway_new
**Kind**: constructor of [<code>JwtGateway</code>](#JwtGateway)  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>Endpoint</code> |  |
| [refreshInterval] | <code>Number</code> | <p>Interval, in milliseconds, which a token refresh should occur. If zero, the token does not need to be refreshed.</p> |


* * *

