import { useState } from 'react';

const networks = [
  { id: 'ethereum', name: 'Ethereum Mainnet' },
  { id: 'optimism', name: 'OP Mainnet' },
  { id: 'base', name: 'Base' },
  { id: 'polygon', name: 'Polygon' }
];

const initialOutput = {
  summary: {
    title: 'Awaiting analysis',
    scoreLabel: 'Risk score: --',
    highlights: [
      'Select a network and enter a contract address to begin.',
      'Optional ABI improves decoding for richer insights.'
    ]
  },
  riskFlags: [],
  details: []
};

function NetworkSelector({ value, onChange }) {
  return (
    <div className="field">
      <label htmlFor="network">Network</label>
      <select id="network" value={value} onChange={(event) => onChange(event.target.value)}>
        {networks.map((network) => (
          <option key={network.id} value={network.id}>
            {network.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function ContractAddressInput({ value, onChange }) {
  return (
    <div className="field">
      <label htmlFor="contract">Contract address</label>
      <input
        id="contract"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="0x..."
      />
    </div>
  );
}

function CalldataInput({ value, onChange }) {
  return (
    <div className="field">
      <label htmlFor="calldata">Calldata</label>
      <textarea
        id="calldata"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="0x..."
        rows={4}
      />
    </div>
  );
}

function AbiInput({ value, onChange }) {
  return (
    <div className="field">
      <label htmlFor="abi">ABI (optional)</label>
      <textarea
        id="abi"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="[{ \"name\": \"transfer\", ... }]"
        rows={4}
      />
    </div>
  );
}

function AnalyzeButton({ onClick }) {
  return (
    <button className="primary" type="button" onClick={onClick}>
      Analyze transaction
    </button>
  );
}

function SummaryCard({ summary }) {
  return (
    <section className="card summary-card">
      <div>
        <p className="eyebrow">Summary</p>
        <h2>{summary.title}</h2>
        <p className="score">{summary.scoreLabel}</p>
      </div>
      <ul>
        {summary.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function RiskFlagsList({ flags }) {
  return (
    <section className="card">
      <div className="card-header">
        <h3>Risk flags</h3>
        <span className="badge">{flags.length} detected</span>
      </div>
      {flags.length === 0 ? (
        <p className="muted">No flags yet. Run analysis to populate results.</p>
      ) : (
        <ul className="flag-list">
          {flags.map((flag) => (
            <li key={flag.title}>
              <strong>{flag.title}</strong>
              <span>{flag.detail}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function DetailsAccordion({ details }) {
  return (
    <section className="card">
      <div className="card-header">
        <h3>Details</h3>
        <span className="badge">{details.length} items</span>
      </div>
      <div className="accordion">
        {details.length === 0 ? (
          <p className="muted">Decoded calldata and execution path will appear here.</p>
        ) : (
          details.map((item) => (
            <details key={item.title}>
              <summary>{item.title}</summary>
              <p>{item.body}</p>
            </details>
          ))
        )}
      </div>
    </section>
  );
}

export default function App() {
  const [network, setNetwork] = useState(networks[0].id);
  const [contractAddress, setContractAddress] = useState('');
  const [calldata, setCalldata] = useState('');
  const [abi, setAbi] = useState('');
  const [output, setOutput] = useState(initialOutput);

  const handleAnalyze = () => {
    const trimmedAddress = contractAddress.trim();
    const trimmedCalldata = calldata.trim();
    const hasAbi = Boolean(abi.trim());

    setOutput({
      summary: {
        title: trimmedAddress ? 'Analysis ready' : 'Missing contract address',
        scoreLabel: trimmedAddress ? 'Risk score: 42 / 100' : 'Risk score: --',
        highlights: [
          trimmedAddress
            ? `Network: ${networks.find((item) => item.id === network)?.name}`
            : 'Add a contract address to start the analysis.',
          trimmedCalldata ? 'Calldata detected and decoded.' : 'Waiting for calldata input.',
          hasAbi ? 'ABI attached for richer insights.' : 'Attach an ABI to improve decoding.'
        ]
      },
      riskFlags: trimmedAddress
        ? [
            {
              title: 'External call detected',
              detail: 'Contract invokes an unverified target during execution.'
            },
            {
              title: 'Value transfer',
              detail: 'Potential ETH transfer found inside calldata.'
            }
          ]
        : [],
      details: trimmedAddress
        ? [
            {
              title: 'Function signature',
              body: 'transfer(address,uint256) detected in calldata.'
            },
            {
              title: 'State changes',
              body: 'Token balance mutation expected for provided recipient.'
            }
          ]
        : []
    });
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Security workflow</p>
          <h1>Smart contract transaction analyzer</h1>
          <p className="subtitle">
            Provide a contract address, calldata, and an optional ABI to generate a summarized risk
            report with decoded details.
          </p>
        </div>
      </header>

      <main className="dashboard">
        <section className="card input-panel">
          <h2>Transaction inputs</h2>
          <p className="muted">Capture the call you want to inspect and generate an analysis.</p>
          <div className="form-grid">
            <NetworkSelector value={network} onChange={setNetwork} />
            <ContractAddressInput value={contractAddress} onChange={setContractAddress} />
          </div>
          <CalldataInput value={calldata} onChange={setCalldata} />
          <AbiInput value={abi} onChange={setAbi} />
          <div className="actions">
            <AnalyzeButton onClick={handleAnalyze} />
            <button
              className="ghost"
              type="button"
              onClick={() => {
                setContractAddress('');
                setCalldata('');
                setAbi('');
                setOutput(initialOutput);
              }}
            >
              Reset
            </button>
          </div>
        </section>

        <section className="output-panel">
          <SummaryCard summary={output.summary} />
          <RiskFlagsList flags={output.riskFlags} />
          <DetailsAccordion details={output.details} />
        </section>
      </main>
    </div>
  );
}
