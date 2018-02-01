<!DOCTYPE html>
<html>
    <head>
        <script src="index.js"></script>
        <title>Login</title>
    </head>
    <h1>LOGIN</h1>
    <body>
        <form method="POST" action=/login.html>
            E-Mail: <input name = "email" value = "{{_email}}" required><br>
            Password: <input type="password" name = "password" required><br>
            <input type = "submit" value = "Login"><br>
            
            {{_error}}<br>
            
        </form>
        <a href = registration.html>Registration</a>
    </body>
</html>