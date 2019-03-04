const sendError = (res, status = 400, message = 'Something went wrong!') => {
  res.status(status);
  res.send({message});
};

module.exports = { sendError };