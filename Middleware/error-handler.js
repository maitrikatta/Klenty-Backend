const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../Errors");
function errorHandlerMiddleware(err, req, res, next) {
  //for explicitly thrown errors

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  //form a base error template, if no one matches
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong at server side.",
  };
  if (err.name == "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `${Object.keys(err.keyValue)} already exists.`;
  }
  if (err.name && err.name == "SyntaxError") {
    customError.statusCode = 400;
    customError.msg = "Invalid JSON Format";
  }
  if (err.name && err.name == "CastError") {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.msg = "FILE NOT FOUND";
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
}
module.exports = errorHandlerMiddleware;
