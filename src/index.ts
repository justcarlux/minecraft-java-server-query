import { toRaw } from "./motd";
import Socket from "./socket";
import { prefixLength, stringVarIntBuffer, uInt16BEBuffer, varIntBuffer } from "./utils";

/**
 * Options for the query function
 * @interface JavaStatusOptions
*/
interface JavaStatusOptions {
    /** IP address of the server */
    host: string,
    /** Port of the server. Defaults to `25565` */
    port?: number,
    /** Maximum time in milliseconds to disconnect due to inactivity. Defaults to `30_000` */
    timeout?: number
}

/**
 * Response from a Minecraft Java server
 * @interface JavaStatusResponse
*/
interface JavaStatusResponse {
    /** Information about the version of Minecraft that the server is running */
    version: {
        protocol: number,
        name: string,
    },
    /** Online players, maximum amount of players that the server is capable of having, and an optional sample of players that are online (missing most of the times) */
    players: {
        max: number,
        online: number,
        sample?: {
            name: string,
            id: string
        }[]
    },
    /** MOTD (Message of the day) of the server */
    motd: string,
    /** Buffer and Media type (Mime type) of the server's icon/image */
    favicon: {
        buffer: Buffer,
        mimeType: string
    } | null
}

/**
 * Fetch information of a Minecraft server. Returns a `Promise` with the information of the server as a `JavaStatusResponse` object, or throws an error if something happened with the socket, fetching the data or because of timeout.
 * @param {options} JavaStatusOptions Options for the query function
 * @returns {Promise<JavaStatusResponse>} Information of the server. Throws an error if something happens while getting the information
*/
async function query(options: JavaStatusOptions): Promise<JavaStatusResponse> {

    return await new Promise<JavaStatusResponse>(async (resolve, reject) => {

        // Parse arguments
        options.port = options.port ?? 25565;
        options.timeout = options.timeout ?? 30_000;

        // Start connection
        const connection = new Socket({
            host: options.host,
            port: options.port,
            timeout: options.timeout
        });
        connection.init();
        
        const timeout = setTimeout(() => {
            connection.end();
            reject("Timeout");
        }, options.timeout);

        connection.on("error", (error) => {
            clearTimeout(timeout);
            reject(error);
        });

        // Handshake packet
        const handshakePacket = Buffer.concat([
            varIntBuffer(0x00), // packet id
            varIntBuffer(47), // protocol version
            stringVarIntBuffer(options.host), // host
            uInt16BEBuffer(options.port), // port
            varIntBuffer(1) // 1 for status, 2 for login
        ]);
        await new Promise<void>((resolve, reject) => {
            connection.socket?.write(prefixLength(handshakePacket), (error) => {
                if (error) {
                    clearTimeout(timeout);
                    reject(error);
                }
                resolve();
            })
        });

        // Request packet
        const requestPacket = Buffer.concat([ varIntBuffer(0x00) ]);
        await new Promise<void>((resolve, reject) => {
            connection.socket?.write(prefixLength(requestPacket), (error) => {
                if (error) {
                    clearTimeout(timeout);
                    reject(error);
                }
                resolve();
            })
        });

        // Getting packet length, trimming the rest of the buffer and waiting for the full packet
        const packetLength = await connection.readVarInt(() => connection.readUInt8());
        await connection.waitUntilDataIsAvailable(packetLength);

        // Getting packet ID/type, that should be 0x00 always
        const type = await connection.readVarInt(() => connection.readUInt8());
        if (type !== 0x00) {
            clearTimeout(timeout);
            reject("Invalid server response");
        }

        // Parsing the JSON response, disconnect socket and return final object
        const response = JSON.parse(await connection.readStringVarInt());
        connection.end();
        clearTimeout(timeout);
        
        const result = { ...response, favicon: null };
        delete result.description;
        result.motd = toRaw(response.description);

        if (response.favicon) {
            const parts: string[] = response.favicon.split(",");
            result.favicon = {
                buffer: Buffer.from(parts[1], "base64"),
                mimeType: parts[0].split(";")[0].replace("data:", "")
            }
        }

        resolve(result);

    });

}

export { query, JavaStatusOptions, JavaStatusResponse };