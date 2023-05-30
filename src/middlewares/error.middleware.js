const error = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.status) {
    return res.status(error.status).json({ error: error.message });
  } else {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = error;
