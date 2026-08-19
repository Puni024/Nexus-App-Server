import { Response } from "express";

const clients = new Map<string, Set<Response>>();

export function addClient(userId: string, res: Response) {
    if (!clients.has(userId)) clients.set(userId, new Set());
    clients.get(userId)!.add(res);
    }

export function removeClient(userId: string, res: Response) {
    const set = clients.get(userId);
    if (!set) return;
    set.delete(res);
    if (set.size === 0) clients.delete(userId);
    }

function writeEvent(res: Response, event: string, payload: unknown) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

export function sendToUser(userId: string, payload: unknown) {
    const set = clients.get(userId);
    if (!set) {
        console.warn(`[SSE] ⚠️ NO MATCH for userId="${userId}" — push failed, will only show after manual refresh.`);
        return;
    }
    for (const res of set) writeEvent(res, "notification", payload);
}

export function sendToUsers(userIds: string[], payload: unknown) {
    for (const id of userIds) sendToUser(id, payload);
}

export function isUserConnected(userId: string): boolean {
    return clients.has(userId);
}