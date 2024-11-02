# 🌍 minecraft-java-server-query

Module to gather basic (MOTD, favicon, player count, version) information from Minecraft Java servers.

# Usage

1. First, import the module:

    ```js
    // Using CommonJS
    const { query } = require("minecraft-java-server-query");

    // Using TypeScript or ESM
    import { query } from "minecraft-java-server-query";
    ```

2. Then, call the `query` function by passing the server's information:

    ```ts
    // Using Hypixel information
    const options = {
        host: "mc.hypixel.net",
        timeout: 15_000
    };

    // Using promises
    query(options).then(response => {
        console.log(response);
    });

    // Using async/await
    const response = await query(options);
    console.log(response);
    ```

# API

```ts
query(options: JavaStatusOptions) => Promise<JavaStatusResponse>
```

Fetch information of a Minecraft server.

-   options.host (`string`): IP address of the server.
-   options.port (optional, `number`): Port of the server. Defaults to `25565`.
-   options.timeout (optional, `number`): Maximum time in milliseconds to disconnect due to inactivity. Defaults to `30_000`.

Returns a `Promise` with the information of the server as a `JavaStatusResponse` object, or throws an error if something happened with the socket, fetching the data or because of timeout.

-   JavaStatusResponse.version (`{ protocol: number, name: string }`): Information about the version of Minecraft that the server is running.
-   JavaStatusResponse.players (`players: { max: number, online: number, sample?: { name: string, id: string }[] }`): Online players, maximum amount of players that the server is capable of having, and an optional sample of players that are online (missing most of the times).
-   JavaStatusResponse.motd (`string`): MOTD (Message of the day) of the server.
-   JavaStatusResponse.favicon (`{ buffer: Buffer, mimeType: string } | null`): Buffer and Media type (Mime type) of the server's icon/image.
