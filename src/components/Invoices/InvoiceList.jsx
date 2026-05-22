import { useState, useEffect } from "react";
import { Search, Eye, FileDown, X } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// --- shared helpers ---
function parseDE(str) {
  return parseFloat((str || "0").replace(/\./g, "").replace(",", ".")) || 0;
}
function formatDE(num) {
  return num.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function isoToDE(str) {
  if (!str) return str;
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split("-");
    return `${d}.${m}.${y}`;
  }
  return str;
}
function calcItem(item) {
  return parseDE(item.menge) * parseDE(item.preis);
}
function calcTotals(items) {
  const netto = (items || []).reduce((sum, it) => sum + calcItem(it), 0);
  const groups = {};
  (items || []).forEach((it) => {
    const rate = it.ust;
    const base = calcItem(it);
    if (!groups[rate]) groups[rate] = 0;
    groups[rate] += base;
  });
  let ustGesamt = 0;
  const ustLines = Object.entries(groups).map(([rate, base]) => {
    const tax = base * (parseFloat(rate) / 100);
    ustGesamt += tax;
    return { rate, base, tax };
  });
  return { netto, ustLines, ustGesamt, gesamt: netto + ustGesamt };
}

// --- normalize raw API invoice to component shape ---
function normalizeInvoice(inv) {
  const isCompany = inv.customerType === "COMPANY";
  const src = isCompany ? inv.company : inv.individual;
  const customer = {
    name: src?.name ?? "",
    strasse: src?.street ?? src?.strasse ?? "",
    plz: src?.zip ?? src?.plz ?? "",
    ort: src?.ort ?? ""
  };
  const company = {
    name: inv.issuer?.name ?? "",
    strasse: inv.issuer?.strasse ?? "",
    plz: inv.issuer?.plz ?? "",
    ort: inv.issuer?.ort ?? "",
    fon: inv.issuer?.fon ?? "",
    email: inv.issuer?.email ?? "",
    web: inv.issuer?.web ?? "",
    ustId: inv.issuer?.ustId ?? "",
    iban: inv.issuer?.iban ?? "",
    bic: inv.issuer?.bic ?? "",
    bank: inv.issuer?.bank ?? "",
    kontoinhaber: inv.issuer?.kontoinhaber ?? "",
    owner: inv.issuer?.owner ?? "",
    hrbnumber: inv.issuer?.hrbnumber ?? "",
    registergericht: inv.issuer?.registergericht ?? "",
    steuernummer: inv.issuer?.steuernummer ?? "",
  };
  const invoice = {
    date: inv.rechnungDatum ?? "",
    nummer: inv.rechnungNummer ?? "",
    checkIn: inv.checkIn ?? "",
    checkOut: inv.checkOut ?? "",
    zahlungsfrist: inv.paid ? null : (inv.zahlungsfrist ?? ""),
  };
  const items = (inv.items ?? []).map((it) => ({
    id: it.id,
    menge: parseFloat(it.menge ?? 0).toFixed(2).replace(".", ","),
    produkt: it.produkt ?? "",
    ust: String(parseFloat(it.ust ?? 0)),
    preis: parseFloat(it.preis ?? 0).toFixed(2).replace(".", ","),
  }));
  const { gesamt } = calcTotals(items);
  return {
    id: inv.id,
    customer,
    customerType: isCompany ? "company" : "individual",
    company,
    invoice,
    items,
    totals: { gesamt: formatDE(gesamt) },
  };
}

// --- InvoicePreview (mirrors generatePDF layout) ---
function InvoicePreview({ data }) {
  const { customer, company, invoice, items } = data;
  const { netto, ustLines, ustGesamt, gesamt } = calcTotals(items);

  return (
    <div
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: "11px",
        background: "#fff",
        color: "#222",
        padding: "48px 52px",
        maxWidth: "680px",
        margin: "0 auto",
        boxShadow: "0 4px 40px rgba(0,0,0,0.13)",
        lineHeight: 1.6,
      }}
    >
      {/* Header: date left, logo + company right */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div style={{ fontSize: "10px", color: "#555" }}>{isoToDE(invoice.date)}</div>
        <div style={{ textAlign: "right" }}>
          <img
            src="/xenon_logo.jpg"
            alt="Xenon Hostel"
            style={{ height: 40, marginLeft: "auto", marginBottom: 8, display: "block" }}
          />
          <div style={{ fontWeight: "bold", fontSize: "12px" }}>{company.name}</div>
          <div>{company.strasse}</div>
          <div>{company.plz} {company.ort}</div>
          <div style={{ marginTop: 4 }}>Telefonnummer: {company.fon}</div>
          <div style={{ marginTop: 4 }}>{company.email}</div>
          <div>{company.web}</div>
        </div>
      </div>

      {/* Sender line */}
      <div style={{ fontSize: "8px", color: "#aaa", marginBottom: 4 }}>
        {company.name} · {company.strasse} · {company.plz} {company.ort}
      </div>

      {/* Recipient */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: "bold", fontSize: "13px" }}>{customer.name}</div>
        <div>{customer.strasse}</div>
        <div>{customer.plz} {customer.ort}</div>
      </div>

      <hr style={{ borderColor: "#ddd", marginBottom: 12 }} />

      {/* Invoice title */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: "bold" }}>Rechnung # {invoice.nummer}</div>
        <div>Check-in: {isoToDE(invoice.checkIn)}</div>
        <div>Check-out: {isoToDE(invoice.checkOut)}</div>
      </div>

      {/* Items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 6 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #222", borderTop: "1px solid #222" }}>
            {["Menge", "Produkt", "USt.", "Preis", "Gesamtbetrag"].map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "3px 6px", fontWeight: "bold" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(items || []).map((it, idx) => (
            <tr key={it.id ?? idx} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "3px 6px" }}>{it.menge}</td>
              <td style={{ padding: "3px 6px" }}>{it.produkt}</td>
              <td style={{ padding: "3px 6px" }}>{it.ust}%</td>
              <td style={{ padding: "3px 6px" }}>{it.preis} €</td>
              <td style={{ padding: "3px 6px" }}>{formatDE(calcItem(it))} €</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginBottom: 10 }}>Nettobetrag: {formatDE(netto)} €</div>

      {/* USt table */}
      <div style={{ marginBottom: 4, fontStyle: "italic" }}>zuzüglich Umsatzsteuer</div>
      <table style={{ borderCollapse: "collapse", marginBottom: 6 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #999" }}>
            {["USt. Satz", "Nettopreis", "Ust.-Betrag"].map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "2px 10px 2px 0", fontWeight: "bold", fontSize: "10px" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ustLines.map((l) => (
            <tr key={l.rate} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "2px 10px 2px 0" }}>{l.rate}%</td>
              <td style={{ padding: "2px 10px 2px 0" }}>{formatDE(l.base)} €</td>
              <td style={{ padding: "2px 10px 2px 0" }}>{formatDE(l.tax)} €</td>
            </tr>
          ))}
          <tr>
            <td colSpan={2} style={{ textAlign: "right", padding: "2px 10px 2px 0", fontWeight: "bold" }}>USt. Gesamt:</td>
            <td style={{ padding: "2px 10px 2px 0" }}>{formatDE(ustGesamt)} €</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginBottom: 20 }}>Gesamtbetrag: {formatDE(gesamt)} €</div>

      {invoice.zahlungsfrist && (
        <div style={{ fontWeight: "bold", marginBottom: 8 }}>
          Bitte überweisen Sie bis zum {isoToDE(invoice.zahlungsfrist)}.
        </div>
      )}
      <div style={{ fontSize: "10px", color: "#555" }}>Powered by Xenon Hostel UG</div>

      {/* Footer */}
      <div style={{ marginTop: 40, textAlign: "right", fontSize: "9px", color: "#555" }}>
        <div>USt-ID: {company.ustId}</div>
        {company.steuernummer && <div>Steuernummer: {company.steuernummer}</div>}
        <div>IBAN {company.iban}</div>
        <div>BIC {company.bic}</div>
        <div>{company.bank}</div>
        <div>Kontoinhaber: {company.kontoinhaber}</div>
        {company.registergericht && <div>Registergericht: {company.registergericht}</div>}
        {company.hrbnumber && <div>Handelsregister : {company.hrbnumber}</div>}
        {company.owner && <div>Geschäftsführer: {company.owner}</div>}
        <div style={{ marginTop: 8, textAlign: "center", color: "#aaa" }}>Seite 1/1</div>
      </div>
    </div>
  );
}

// --- PDF generator (mirrors InvoicePreview layout) ---
async function generatePDF(inv) {
  const { customer, company, invoice, items } = inv;
  const { netto, ustLines, ustGesamt, gesamt } = calcTotals(items);
  const doc = new jsPDF();
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // load logo from public/
  let logoDataUrl = null;
  try {
    const resp = await fetch("/xenon_logo.jpg");
    const blob = await resp.blob();
    logoDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (_) {}

  // logo top-right
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "JPEG", W - 66, 6, 52, 18);
  }

  // date top-left
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.setTextColor(85);
  doc.text(isoToDE(invoice.date) ?? "", 14, 18);
  doc.setTextColor(0);

  // company block top-right (shifted down to sit below logo)
  doc.setFont("courier", "bold");
  doc.setFontSize(10);
  doc.text(company.name, W - 14, 30, { align: "right" });
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.text(company.strasse, W - 14, 35, { align: "right" });
  doc.text(`${company.plz} ${company.ort}`, W - 14, 40, { align: "right" });
  doc.text(`Telefonnummer: ${company.fon}`, W - 14, 46, { align: "right" });
  doc.text(company.email, W - 14, 56, { align: "right" });
  doc.text(company.web, W - 14, 61, { align: "right" });

  // sender line
  doc.setFontSize(7);
  doc.setTextColor(170);
  doc.text(`${company.name} · ${company.strasse} · ${company.plz} ${company.ort}`, 14, 70);
  doc.setTextColor(0);

  // recipient
  doc.setFont("courier", "bold");
  doc.setFontSize(10);
  doc.text(customer.name, 14, 78);
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.text(customer.strasse, 14, 83);
  doc.text(`${customer.plz} ${customer.ort}`, 14, 88);

  // divider
  doc.setDrawColor(200);
  doc.line(14, 93, W - 14, 93);

  // invoice title
  doc.setFont("courier", "bold");
  doc.setFontSize(9);
  doc.text(`Rechnung # ${invoice.nummer} `, 14, 105);
  doc.setFont("courier", "normal");
  doc.text(`Check-in: ${isoToDE(invoice.checkIn)}`, 14, 110);
  doc.text(`Check-out: ${isoToDE(invoice.checkOut)}`, 14, 113);

  // items table
  autoTable(doc, {
    head: [["Menge", "Produkt", "USt.", "Preis", "Gesamtbetrag"]],
    body: (items || []).map((it) => [
      it.menge, it.produkt, `${it.ust}%`, `${it.preis} €`, `${formatDE(calcItem(it))} €`,
    ]),
    startY: 115,
    theme: "plain",
    styles: { font: "courier", fontSize: 9, cellPadding: 2 },
    headStyles: { fontStyle: "bold", lineWidth: { top: 0.3, bottom: 0.3 }, lineColor: [34, 34, 34] },
    bodyStyles: { lineWidth: { bottom: 0.1 }, lineColor: [200, 200, 200] },
  });

  let y = doc.lastAutoTable.finalY + 5;

  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.text(`Nettobetrag: ${formatDE(netto)} €`, 14, y);
  y += 7;

  doc.setFont("courier", "italic");
  doc.setFontSize(8);
  doc.text("zuzüglich Umsatzsteuer", 14, y);
  doc.setFont("courier", "normal");
  y += 4;

  // USt table
  const ustBody = ustLines.map((l) => [`${l.rate}%`, `${formatDE(l.base)} €`, `${formatDE(l.tax)} €`]);
  ustBody.push(["", "USt. Gesamt:", `${formatDE(ustGesamt)} €`]);

  autoTable(doc, {
    head: [["USt. Satz", "Nettopreis", "Ust.-Betrag"]],
    body: ustBody,
    startY: y,
    theme: "plain",
    styles: { font: "courier", fontSize: 8, cellPadding: 1.5 },
    headStyles: { fontStyle: "bold", lineWidth: { bottom: 0.2 }, lineColor: [150, 150, 150] },
    bodyStyles: { lineWidth: { bottom: 0.1 }, lineColor: [200, 200, 200] },
  });

  y = doc.lastAutoTable.finalY + 6;

  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.text(`Gesamtbetrag: ${formatDE(gesamt)} €`, 14, y);
  y += 8;

  if (invoice.zahlungsfrist) {
    doc.setFont("courier", "bold");
    doc.setFontSize(9);
    doc.text(`Bitte überweisen Sie bis zum ${isoToDE(invoice.zahlungsfrist)}.`, 14, y);
    y += 6;
  }

  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.setTextColor(85);
  doc.text("Powered by Xenon Hostel UG", 14, y);

  // footer
  doc.setFontSize(8);
  doc.setTextColor(85);
  doc.text(`USt-ID: ${company.ustId}`, W - 14, H - 48, { align: "right" });
  if (company.steuernummer) doc.text(`Steuernummer: ${company.steuernummer}`, W - 14, H - 43, { align: "right" });
  doc.text(`IBAN ${company.iban}`, W - 14, H - 38, { align: "right" });
  doc.text(`BIC ${company.bic}`, W - 14, H - 33, { align: "right" });
  doc.text(company.bank, W - 14, H - 28, { align: "right" });
  doc.text(`Kontoinhaber: ${company.kontoinhaber}`, W - 14, H - 23, { align: "right" });
  if (company.registergericht) doc.text(`Registergericht: ${company.registergericht}`, W - 14, H - 18, { align: "right" });
  if (company.hrbnumber) doc.text(`Handelsregister: ${company.hrbnumber}`, W - 14, H - 13, { align: "right" });
  if (company.owner) doc.text(`Geschäftsführer: ${company.owner}`, W - 14, H - 8, { align: "right" });
  doc.setTextColor(180);
  doc.text("Seite 1/1", W / 2, H - 4, { align: "center" });

  doc.save(`Rechnung_${invoice.nummer ?? "invoice"}.pdf`);
}

// --- main component ---
const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_BASE_URL}/hotel/invoice`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${JSON.parse(token)}` } : {}),
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const list = Array.isArray(data.data) ? data.data.map(normalizeInvoice) : [];
        setInvoices(list);
        setFiltered(list);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      invoices.filter(
        (inv) =>
          (inv.invoice?.nummer ?? "").toLowerCase().includes(q) ||
          (inv.customer?.name ?? "").toLowerCase().includes(q)
      )
    );
  }, [search, invoices]);

  return (
    <>
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">All Invoices</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice # or customer…"
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-16 text-gray-400 text-sm">Loading invoices…</div>
        )}

        {error && (
          <div className="text-center py-16 text-red-400 text-sm">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500 text-sm">No invoices found.</div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700 text-sm">
              <thead>
                <tr>
                  {["#", "Invoice No.", "Customer", "Date", "Total", "Payment Due", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filtered.map((inv, i) => (
                  <tr key={inv.id ?? i} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-100 font-medium">{inv.invoice?.nummer ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-300">{inv.customer?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-300">{isoToDE(inv.invoice?.date) ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-100 font-semibold">{inv.totals?.gesamt ?? "—"} €</td>
                    <td className="px-4 py-3">
                      {inv.invoice?.zahlungsfrist
                        ? <span className="text-gray-300">{isoToDE(inv.invoice.zahlungsfrist)}</span>
                        : <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Paid</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelected(inv)}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          title="Preview"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          onClick={() => generatePDF(inv)}
                          className="text-green-400 hover:text-green-300 transition-colors"
                          title="Download PDF"
                        >
                          <FileDown size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-10"
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div className="relative w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="text-gray-300 text-sm font-medium">
                Invoice Preview — {selected.invoice?.nummer}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => generatePDF(selected)}
                  className="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <FileDown size={14} /> Download PDF
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-100 transition-colors p-1"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <InvoicePreview data={selected} />
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceList;
