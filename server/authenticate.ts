import config from "./config";

// NOTE: The regex must match the pattern and min/max lengths in client/src/login/index.jade
const usernameRegex = /^[A-Za-z0-9_-]{3,20}$/;

export default function(socket: SocketIO.Socket, next: Function) {
  let auth: any;
  if (socket.handshake.query != null) {
    const authJSON = socket.handshake.query.supServerAuth;
    try { auth = JSON.parse(authJSON); } catch (e) { /* Ignore */ }
  }

  if (auth != null && (auth.serverPassword === config.password || config.password.length === 0) && typeof auth.username === "string" && usernameRegex.test(auth.username)) {
    (socket as any).username = auth.username;
  }

  if ((socket as any).username == null) {
    if (config.password.length > 0) { next(new Error("invalidCredentials")); return; }
    else { next(new Error("invalidUsername")); return; }
  }
  next();
}
