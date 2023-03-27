// These following close codes follow RFC convention
// https://www.iana.org/assignments/websocket/websocket.xhtml

export enum WSCloseCode {
    INTERNAL_SERVER = 1011,
    UNAUTHORIZED = 3000
}

// For convetion, these codes should be in range 0 - 999.
// Note that these codes are used in message exchange which is different usage of websocket close code
export enum WSSensorCode {
    SUCCESS = 0,
    UNAUTHORIZED = 1,
    UNKNOWN = 999
}

// For convention, these commands should be in range 1000 - 1999
export enum WsCmd {
    AUTH = 1000,
    SYS_INFO = 1001
}
