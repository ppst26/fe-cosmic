import { FALLBACK_CHAIN, type Locale } from "./config";
import { deepMerge, type MessageTree } from "./translate";
import type thMessages from "./messages/th.json";

/** โครงของ dictionary ยึด th.json เป็นต้นแบบ */
export type Messages = typeof thMessages;
export type Namespace = keyof Messages;

const LOADERS: Record<Locale, () => Promise<MessageTree>> = {
  th: () => import("./messages/th.json").then((m) => m.default),
  en: () => import("./messages/en.json").then((m) => m.default),
  lo: () => import("./messages/lo.json").then((m) => m.default),
  my: () => import("./messages/my.json").then((m) => m.default),
  vi: () => import("./messages/vi.json").then((m) => m.default),
  zh: () => import("./messages/zh.json").then((m) => m.default),
  id: () => import("./messages/id.json").then((m) => m.default),
  fil: () => import("./messages/fil.json").then((m) => m.default),
  km: () => import("./messages/km.json").then((m) => m.default),
};

/** dictionary ของภาษา merge กับ fallback chain (ท้าย chain = th อยู่ล่างสุด) */
export async function loadMessages(locale: Locale): Promise<MessageTree> {
  const chain = [locale, ...FALLBACK_CHAIN[locale]].reverse();
  const trees = await Promise.all(chain.map((code) => LOADERS[code]()));
  return deepMerge(...trees);
}

export function pickNamespaces(messages: MessageTree, namespaces: readonly Namespace[]): MessageTree {
  return Object.fromEntries(namespaces.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]]));
}
