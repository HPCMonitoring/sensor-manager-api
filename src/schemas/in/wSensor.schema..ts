import * as t from "io-ts";

const WSensorInfoMessageCodec = t.type({
    kernelName: t.string,
    kernelVersion: t.string,
    arch: t.string,
    hostname: t.string,
    rootUser: t.string
});

export type WSensorInfoMessage = t.TypeOf<typeof WSensorInfoMessageCodec>;

// const input = `
//   {
//     "id": "1234",
//     "name": "Kieran"
//   }
// `;

// const result = WSensorInfoMessageCodec.decode(JSON.parse(input));

// if (isLeft(result)) {
//   console.log(PathReporter.report(result));
// } else {
//   console.log(result.right.name);
// }
