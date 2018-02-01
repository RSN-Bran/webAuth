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
            <input type = "submit" value = "Login">
        </form>
        
        <h3>This user does not exist</h3>
        
        <a href = registration.html>Registration</a>
    </body>
</html>