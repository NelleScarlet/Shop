import { v4 as uuidv4 } from 'uuid';

export default function getUserId(req) {
  if (req.session.userId) {
    return req.session.userId;
  } else {
    req.session.userId = uuidv4();
  }
  return req.session.userId;
}
