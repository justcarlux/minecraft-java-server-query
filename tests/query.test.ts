import { query } from "../src/index";

test("query hypixel", async () => {
    const keys = Object.keys(await query({ host: "mc.hypixel.net" }));
    expect(
        keys.includes("version") &&
        keys.includes("players") &&
        keys.includes("motd") &&
        keys.includes("favicon")
    ).toBeTruthy();
}, 15_000);

test("query bedwars practice", async () => {
    const keys = Object.keys(await query({ host: "bedwarspractice.club" }));
    expect(
        keys.includes("version") &&
        keys.includes("players") &&
        keys.includes("motd") &&
        keys.includes("favicon")
    ).toBeTruthy();
}, 15_000);

test("query hycraft", async () => {
    const keys = Object.keys(await query({ host: "mc.hycraft.us" }));
    expect(
        keys.includes("version") &&
        keys.includes("players") &&
        keys.includes("motd") &&
        keys.includes("favicon")
    ).toBeTruthy();
}, 15_000);

test("query universocraft", async () => {
    const keys = Object.keys(await query({ host: "mc.universocraft.com" }));
    expect(
        keys.includes("version") &&
        keys.includes("players") &&
        keys.includes("motd") &&
        keys.includes("favicon")
    ).toBeTruthy();
}, 15_000);

test("query pvplegacy", async () => {
    const keys = Object.keys(await query({ host: "play.pvplegacy.net" }));
    expect(
        keys.includes("version") &&
        keys.includes("players") &&
        keys.includes("motd") &&
        keys.includes("favicon")
    ).toBeTruthy();
}, 15_000);