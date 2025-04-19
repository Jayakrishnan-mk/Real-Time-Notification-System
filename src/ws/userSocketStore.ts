// src/ws/userSocketStore.ts

export const userSocketMap = new Map<number, Set<string>>();
// Singleton map of userId => Set of socket ids
