import ip from 'ip';

export default {
  SERVER_URL: `http://${ip.address()}:3001`,
};
