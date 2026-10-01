/**
 * Typisierte Werte für Erklärungsschritte. Die Engine bleibt sprachneutral:
 * Sie liefert Zahlen mit Einheit, die Oberfläche formatiert sie je Sprache.
 */

/** Euro-Betrag, übergeben in Cent (ganze Zahl). */
export const eur = (cents) => ({ eur: cents });

/** Prozentwert, z. B. `pct(7.3)` für 7,3 %. */
export const pct = (percent) => ({ pct: percent });

/** Zahl mit Nachkommastellen (z. B. Faktor 0,912 oder Zwischenwerte der Tarifformel). */
export const num = (value, digits) => ({ num: value, digits });
