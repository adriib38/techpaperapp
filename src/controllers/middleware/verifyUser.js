function verifyUser(user) {
    let regEx_Mail = '/\S+@\S+\.\S+/';



    let { email, username, password } = user;

    let result = { error: false, message: "" };
  
    if (!email || !username || !password) {

        result = { error: true, message: "Missing required fields" };

    } else if (email.length < 4 || email.length > 30) {

        result = { error: true, message: "Email must be between 4 and 30 characters" };

    } else if (username.length < 2 || username.length > 25) {

        result = { error: true, message: "Username must be between 2 and 25 characters" };

    } else if (password.length < 8 || password.length > 25) {   

        result = { error: true, message: "Password must be between 8 and 25 characters" };

    }
    
    return result;
}

module.exports = verifyUser;
  
  