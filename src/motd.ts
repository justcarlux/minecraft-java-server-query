export const MotdColorCodes = {
    "4": "dark_red",
    "c": "red",
    "6": "gold",
    "e": "yellow",
    "2": "dark_green",
    "a": "green",
    "b": "aqua",
    "3": "dark_aqua",
    "1": "dark_blue",
    "9": "blue",
    "d": "light_purple",
    "5": "dark_purple",
    "f": "white",
    "7": "gray",
    "8": "dark_gray",
    "0": "black",
    "g": "minecoin_gold"
};

export const MotdFormatCodes = {
    "k": "obfuscated",
    "l": "bold",
    "m": "strikethrough",
    "n": "underlined",
    "o": "italic",
    "r": "reset"
};

export function toRaw(motd: any, useAmpersand?: boolean): string {

    if (typeof motd === "string") return motd;
    let text = (motd?.text ?? "") + `${(useAmpersand ? "&" : "§")}r`;

    if (motd.color) {
        const code = Object.keys(MotdColorCodes).find(key => {
            return MotdColorCodes[key as keyof typeof MotdColorCodes] === motd.color
        });
        text = (code ? (useAmpersand ? "&" : "§") + code : "") + text;
    }

    const formattingKeys = Object.keys(motd).filter(e => e !== "text" && e !== "extra" && e !== "color");
    
    if (formattingKeys) {
        const codes = formattingKeys.map(format => {
            return (useAmpersand ? "&" : "§") + Object.keys(MotdFormatCodes).find(key => {
                return MotdFormatCodes[key as keyof typeof MotdFormatCodes] === format
            });
        });
        text = codes.join("") + text;
    }

    text = `${(useAmpersand ? "&" : "§")}r` + text;
    return (text) + (motd.extra ? motd.extra.map((e: any) => toRaw(e)).join("") : "");

}