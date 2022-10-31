# crud-express-postgre-sequelize
This is a simple users-->posts crud application with the authorization module, based on JWT tokens
Authorization module includes registration, login, logout, refresh the token (there are two types of tokens:
access and refresh. Refresh token has more livetime and refresh the access token when user is using his account.
When the refresh token livetime is out, user need to sing in again - this provides more security)
Also, there are three middlewares - auth-middleware (checks that user is authorized in a system); 
- checkRole-middleware (checks the role of user ('ADMIN' or 'USER'(by def)));
- errorHandling-middleware (handler for errors by custom class 'ApiError', which describes in the 'error' folder).
