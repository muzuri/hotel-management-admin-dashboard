import { useState, useEffect } from "react";

const defaultItems = [
  { id: 1, menge: "1,00", produkt: "Künstlerische Gestaltung (Stunde):", ust: "7", preis: "160,00" },
  { id: 2, menge: "400,00", produkt: "Luftballon: Bunt, ca. 500ml", ust: "19", preis: "0,79" },
  { id: 3, menge: "200,00", produkt: "Heiße Luft pro Liter:", ust: "19", preis: "0,10" },
];

function generateInvoiceNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = String(Math.floor(100 + Math.random() * 900));
  return `RE-${y}${m}${d}/${rand}`;
}

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

function deToIso(str) {
  if (!str) return str;
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str; // already ISO
  const [d, m, y] = str.split(".");
  if (!d || !m || !y) return str;
  return `${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`;
}

function calcItem(item) {
  return parseDE(item.menge) * parseDE(item.preis);
}

function calcTotals(items) {
  const netto = items.reduce((sum, it) => sum + calcItem(it), 0);
  const groups = {};
  items.forEach((it) => {
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

function InvoicePreview({ data }) {
  const { customer, customerType, company, invoice, items } = data;
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
      {/* Header */}
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
        {customerType === "company" ? (
          <>
            <div style={{ fontWeight: "bold", fontSize: "13px" }}>{customer.firmenname}</div>
            {customer.ustId && <div style={{ fontSize: "10px", color: "#777" }}>USt-ID: {customer.ustId}</div>}
          </>
        ) : (
          <div style={{ fontWeight: "bold", fontSize: "13px" }}>{customer.name}</div>
        )}
        <div>{customer.strasse}</div>
        <div>{customer.plz} {customer.ort}</div>
      </div>

      <hr style={{ borderColor: "#ddd", marginBottom: 12 }} />

     

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: "bold" }}>
          Rechnung # {invoice.rechnungNummer}
        </div>
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
          {items.map((it) => (
            <tr key={it.id} style={{ borderBottom: "1px solid #ccc" }}>
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
        {company.hrbnumber && <div>Handelsregister: {company.hrbnumber}</div>}
        {company.owner && <div>Geschäftsführer: {company.owner}</div>}
        <div style={{ marginTop: 8, textAlign: "center", color: "#aaa" }}>Seite 1/1</div>
      </div>
    </div>
  );
}

export default function App() {
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [paid, setPaid] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [customerType, setCustomerType] = useState("individual"); // 'individual' | 'company'

  const [customer, setCustomer] = useState({
    name: "", strasse: "", plz: "", ort: "",
  });
  const [customerCo, setCustomerCo] = useState({
    firmenname: "Company Name", guestName: "Guest Name", strasse: "", plz: "", ort: "",
  });

  const issuerId = 1;
  const [company, setCompany] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [companyError, setCompanyError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setCompanyLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/hotel/issuer/${issuerId}`, {
      headers: token ? { Authorization: `Bearer ${JSON.parse(token)}` } : {},
    })
      .then((res) => { if (!res.ok) throw new Error(`Server error ${res.status}`); return res.json(); })
      .then((data) => { setCompany(data); setCompanyError(null); })
      .catch((err) => setCompanyError(err.message))
      .finally(() => setCompanyLoading(false));
  }, []);
  const today = new Date();
  const todayFormatted = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;

  const [invoice, setInvoice] = useState({
    date: todayFormatted, rechnungNummer: generateInvoiceNumber(), checkIn: "",
    checkOut: "", zahlungsfrist: "",
  });
  const [items, setItems] = useState(defaultItems);

  const setC = (k) => (e) => setCustomer((p) => ({ ...p, [k]: e.target.value }));
  const setCCo = (k) => (e) => setCustomerCo((p) => ({ ...p, [k]: e.target.value }));
  const setI = (k) => (e) => setInvoice((p) => ({ ...p, [k]: e.target.value }));

  const updateItem = (id, k, v) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [k]: v } : it)));
  const addItem = () =>
    setItems((prev) => [...prev, { id: Date.now(), menge: "1,00", produkt: "", ust: "19", preis: "0,00" }]);
  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id));

  const { netto, ustLines, ustGesamt, gesamt } = calcTotals(items);

  const saveInvoice = async () => {
    setSaving(true);
    setSaveStatus(null);
    const token = sessionStorage.getItem("token");
    const payload = {
      customerType: customerType.toUpperCase(),
      individual: customerType === "individual" ? customer : null,
      company: customerType === "company" ? customerCo : null,
      invoice: {
        date: deToIso(invoice.date),
        rechnungNummer: invoice.rechnungNummer,
        checkIn: invoice.checkIn,
        checkOut: invoice.checkOut,
        zahlungsfrist: deToIso(invoice.zahlungsfrist),
        paid,
      },
      items: items.map(({ id, ...rest }) => ({
        menge: parseDE(rest.menge),
        produkt: rest.produkt,
        ust: parseFloat(rest.ust),
        preis: parseDE(rest.preis),
      })),
      issuerId,
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/hotel/invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${JSON.parse(token)}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setSaveStatus("success");
    } catch (err) {
      console.error("Failed to save invoice:", err);
      setSaveStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  return (
    <div className="pb-8">
      {/* Toolbar */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setPreview((p) => !p)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          {preview ? "← Formular" : "Vorschau →"}
        </button>
      </div>

      {preview ? (
        companyLoading ? (
          <div className="text-center text-gray-400 py-16">Loading issuer data…</div>
        ) : companyError ? (
          <div className="text-center text-red-400 py-16">Failed to load issuer: {companyError}</div>
        ) : company ? (
          <InvoicePreview data={{ customer: customerType === "individual" ? customer : customerCo, customerType, company, invoice, items }} />
        ) : (
          <div className="text-center text-gray-400 py-16">No issuer data available.</div>
        )
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">

          {/* Kundendaten */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-100">Kundendaten</h2>
              {/* Type toggle */}
              <div className="flex bg-gray-900 rounded-lg p-1 gap-1">
                {["individual", "company"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setCustomerType(type)}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-150 ${
                      customerType === type
                        ? "bg-indigo-600 text-white shadow"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {type === "individual" ? "Individual" : "Company"}
                  </button>
                ))}
              </div>
            </div>

            {customerType === "individual" ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                  <input value={customer.name} onChange={setC("name")} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Straße & Hausnummer</label>
                  <input value={customer.strasse} onChange={setC("strasse")} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">PLZ</label>
                  <input value={customer.plz} onChange={setC("plz")} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ort</label>
                  <input value={customer.ort} onChange={setC("ort")} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Firmenname</label>
                  <input value={customerCo.firmenname} onChange={setCCo("firmenname")} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Guest Name</label>
                  <input value={customerCo.guestName} onChange={setCCo("guestName")} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Straße & Hausnummer</label>
                  <input value={customerCo.strasse} onChange={setCCo("strasse")} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">PLZ</label>
                  <input value={customerCo.plz} onChange={setCCo("plz")} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ort</label>
                  <input value={customerCo.ort} onChange={setCCo("ort")} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            )}
          </div>

          {/* Rechnungsdaten */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-100">Rechnungsdaten</h2>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={paid}
                  onChange={(e) => setPaid(e.target.checked)}
                  className="w-4 h-4 rounded accent-green-500 cursor-pointer"
                />
                <span className={`text-sm font-medium ${paid ? "text-green-400" : "text-gray-400"}`}>
                  Paid
                </span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: "date", label: "Rechnungsdatum", span: true },
                { k: "rechnungNummer", label: "Rechnungsnummer", span: true },
                { k: "checkIn", label: "Check-in", type: "date" },
                { k: "checkOut", label: "Check-out", type: "date" },
                ...(!paid ? [{ k: "zahlungsfrist", label: "Zahlungsfrist bis", span: true }] : []),
              ].map(({ k, label, span, type }) => (
                <div key={k} className={span ? "col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</label>
                  <input type={type ?? "text"} value={invoice[k]} onChange={setI(k)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:dark]" />
                </div>
              ))}
            </div>
          </div>

          {/* Positionen */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-100">Positionen</h2>
              <button
                onClick={addItem}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                + Position
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-600">
                    {["Menge", "Produkt", "USt. %", "Preis (€)", "Gesamt (€)", ""].map((h) => (
                      <th key={h} className="text-left py-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} className="border-b border-gray-700">
                      {[
                        { k: "menge", w: "w-20" },
                        { k: "produkt", w: "w-60" },
                        { k: "ust", w: "w-16" },
                        { k: "preis", w: "w-24" },
                      ].map(({ k, w }) => (
                        <td key={k} className="py-2 px-2">
                          <input
                            value={it[k]}
                            onChange={(e) => updateItem(it.id, k, e.target.value)}
                            className={`${w} bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                          />
                        </td>
                      ))}
                      <td className="py-2 px-2 font-semibold text-gray-200">
                        {formatDE(calcItem(it))} €
                      </td>
                      <td className="py-2 px-2">
                        <button
                          onClick={() => removeItem(it.id)}
                          className="text-red-400 hover:text-red-300 text-lg leading-none transition-colors"
                          title="Löschen"
                        >
                           x
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-6 p-4 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Steuerübersicht</div>
              {ustLines.map((l) => (
                <div key={l.rate} className="flex gap-6 text-sm text-gray-300 mb-1">
                  <span className="w-12">{l.rate}%</span>
                  <span>Netto: {formatDE(l.base)} €</span>
                  <span>USt: {formatDE(l.tax)} €</span>
                </div>
              ))}
              <div className="border-t border-gray-600 mt-3 pt-3 flex justify-between items-center">
                <div className="text-sm text-gray-300">
                  Netto: <strong className="text-gray-100">{formatDE(netto)} €</strong>
                  <span className="mx-2 text-gray-500">·</span>
                  USt: <strong className="text-gray-100">{formatDE(ustGesamt)} €</strong>
                </div>
                <div className="text-base font-bold text-gray-100">Gesamt: {formatDE(gesamt)} €</div>
              </div>
            </div>
          </div>

          {/* Save footer */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-lg flex items-center justify-between">
            <div className="text-sm">
              {saveStatus === "success" && (
                <span className="text-green-400 font-medium">&#10003; Invoice saved successfully.</span>
              )}
              {saveStatus === "error" && (
                <span className="text-red-400 font-medium">&#10007; Failed to save. Please try again.</span>
              )}
            </div>
            <button
              onClick={saveInvoice}
              disabled={saving}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl text-sm tracking-wide shadow-lg transition-all duration-200 hover:shadow-green-900/40 hover:shadow-xl"
            >
              {saving ? "Saving…" : "Save Invoice"}
            </button>
          </div>

        </form>
      )}
      
     
    </div>
  );
}