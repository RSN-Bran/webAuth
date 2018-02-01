<!DOCTYPE html>
<html>
    <head>
        <script src="server/server.js"></script>
        <title>Registration</title>
    </head>
    <h1>REGISTRATION</h1>
    <body>
        <form action = "/registration.html" method = "POST">
            First Name: <input type = "text" name = "firstName" value = "{{_firstName}}" required><br>
            Last Name: <input type = "text" name = "lastName" value = "{{_lastName}}" required><br>
            E-Mail: <input type = "text" name = "email" value = "{{_email}}" required><br>
            Password: <input type="password" name = "password" required><br>
            Confirm Password: <input name = "passwordConfirm" type="password" required><br>
        
            <input type = "Submit" value = "Register"> <br>
            
        {{_firstNameErr}}<br>
        {{_lastNameErr}}<br>
        {{_emailFormatErr}}<br>
        {{_passwordConfirmErr}}<br>
        {{_passwordLenErr}}<br>
        {{_passwordFormatErr}}<br>
        
        </form>
        <a href = login.html>Login</a> <br>
        

        
    </body>
</html>