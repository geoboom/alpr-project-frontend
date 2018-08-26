export const handleError = (e) => {
  if (e.response) {
    return e.response.data;
  }
  if (e.request) {
    return 'Failed to connect to server.';
  }
  return e;
};

export const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
