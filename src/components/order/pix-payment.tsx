import QRCode from "qrcode";
import { QrCode, Smartphone } from "lucide-react";
import { CopyButton } from "@/components/order/copy-pix";
import { formatBRL } from "@/lib/format";
import { SITE } from "@/lib/site";

/**
 * Bloco de pagamento PIX com QR Code real (BR Code) gerado no servidor.
 *
 * O QR é renderizado como SVG inline: não depende de rede, de CDN nem de
 * canvas no navegador — funciona em preview sandbox e imprime nítido.
 */
export async function PixPayment({
  payload,
  amountCents,
  code,
}: {
  payload: string;
  amountCents: number;
  code: string;
}) {
  const svg = await QRCode.toString(payload, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    width: 220,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });

  return (
    <div className="text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <QrCode size={22} />
      </span>
      <h2 className="mt-4 font-display text-2xl">Pague com PIX para confirmar</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-noir-900/55">
        Escaneie o QR Code com o app do seu banco — o valor e o identificador do
        pedido já vêm preenchidos.
      </p>

      <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
        <div
          className="w-[220px] shrink-0 rounded-2xl border border-noir-900/8 bg-white p-3 shadow-sm [&>svg]:h-auto [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
          aria-label={`QR Code PIX do pedido ${code}`}
          role="img"
        />
        <div className="text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-noir-900/45">
            Valor com desconto PIX
          </p>
          <p className="font-display text-3xl font-semibold text-rose-600">
            {formatBRL(amountCents)}
          </p>
          <p className="mt-3 flex items-center gap-2 text-xs text-noir-900/55">
            <Smartphone size={14} className="text-emerald-600" />
            Abra o app do banco → PIX → Ler QR Code
          </p>
          <p className="mt-3 text-xs leading-relaxed text-noir-900/45">
            Prefere digitar? Use o código copia-e-cola abaixo ou a chave{" "}
            <strong className="text-noir-900/70">{SITE.pixKey}</strong> (
            {SITE.pixHolder}).
          </p>
          <div className="mt-4">
            <CopyButton
              value={payload}
              label="Copiar código PIX"
              copiedLabel="Código copiado!"
            />
          </div>
        </div>
      </div>

      <details className="mt-6 text-left">
        <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.18em] text-noir-900/45 hover:text-noir-900">
          Ver código copia-e-cola
        </summary>
        <p className="mt-2 break-all rounded-xl bg-blush-50 p-3 font-mono text-[10px] leading-relaxed text-noir-900/70">
          {payload}
        </p>
      </details>

      <p className="mt-6 text-xs text-noir-900/45">
        Assim que identificarmos o pagamento, seu pedido é separado e postado em
        até 24h úteis.
      </p>
    </div>
  );
}
