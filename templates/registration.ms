<!DOCTYPE html>
<html>
    <head>
        <script src="server/server.js"></script>
        <title>Registration</title>
    </head>
    <h1>REGISTRATION</h1>
    <body>
        <form action = "/registration.html" method = "POST">
            First Name: <input type = "text" name = "firstName" required><br>
            Last Name: <input type = "text" name = "lastName" required><br>
            E-Mail: <input type = "text" name = "email" required><br>
            Password: <input type="password" name = "password" required><br>
            Confirm Password: <input name = "passwordConfirm" type="password" required><br>
        
            <input type = "Submit" value = "Register">
        </form>
        <a href = login.html>Login</a>
    </body>
</html>