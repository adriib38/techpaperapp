function verifyPost(post) {
    let { title, content, categories } = post;

    let result = { error: false, message: "" };
  
    if (!title || !content) {

        result = { error: true, message: "Missing required fields" };

    } else if (title.length < 5 || title.length > 50) {

        result = { error: true, message: "Title must be between 5 and 50 characters" };

    } else if (content.length < 5 || content.length > 500) {

        result = { error: true, message: "Content must be between 5 and 500 characters" };

    } else if (categories.length > 50) {

        result = { error: true, message: "Categories must be less than 50 characters" };

    }

    return result;
}

module.exports = verifyPost;
  
  