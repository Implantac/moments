/**
 * Gerador de BR Code (PIX estático) conforme o padrão EMV® QRCPS-MPM
 * e o Manual de Padrões QR Code do Banco Central do Brasil.
 *
 * Gera o "PIX copia e cola" com valor, chave e identificador do pedido.
 * Não requer gateway: a taxa do PIX cai direto na conta do recebedor.
 */

const PIX_GUI = "br.gov.bcb.pix";

/** CRC16-CCITT (0x1021, init 0xFFFF) — obrigatório no campo 63 do BR Code. */
export function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/** EMV TLV: id (2 dígitos) + tamanho (2 dígitos) + valor. */
function tlv(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

/** Remove acentos e limita ao tamanho do campo (padrão EMV exige ASCII). */
function sanitize(value: string, maxLength: number): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .trim()
    .slice(0, maxLength)
    .toUpperCase();
}

export type PixInput = {
  /** Chave PIX (CPF, CNPJ, e-mail, telefone ou aleatória). */
  key: string;
  /** Nome do recebedor (máx. 25 caracteres, sem acento). */
  merchantName: string;
  /** Cidade do recebedor (máx. 15 caracteres, sem acento). */
  merchantCity: string;
  /** Valor em reais. Omitir para deixar o pagador escolher. */
  amount?: number;
  /** Identificador do pedido (máx. 25 caracteres alfanuméricos). */
  txid?: string;
};

/**
 * Monta o payload do BR Code. Retorna uma string pronta para ser
 * transformada em QR Code ou exibida como "PIX copia e cola".
 */
export function buildPixPayload({
  key,
  merchantName,
  merchantCity,
  amount,
  txid = "***",
}: PixInput): string {
  const normalizedKey = key.replace(/[.\-\s]/g, "");
  const merchantAccount = tlv("00", PIX_GUI) + tlv("01", normalizedKey);
  const cleanTxid = txid.replace(/[^A-Za-z0-9]/g, "").slice(0, 25) || "***";

  const body =
    tlv("00", "01") +
    tlv("26", merchantAccount) +
    tlv("52", "0000") + // categoria do estabelecimento
    tlv("53", "986") + // BRL
    (amount ? tlv("54", amount.toFixed(2)) : "") +
    tlv("58", "BR") +
    tlv("59", sanitize(merchantName, 25)) +
    tlv("60", sanitize(merchantCity, 15)) +
    tlv("62", tlv("05", cleanTxid)) +
    "6304";

  return body + crc16(body);
}

/** Valida o CRC de um payload já montado (útil em testes). */
export function isValidPixPayload(payload: string): boolean {
  if (payload.length < 8) return false;
  const body = payload.slice(0, -4);
  return crc16(body) === payload.slice(-4).toUpperCase();
}
