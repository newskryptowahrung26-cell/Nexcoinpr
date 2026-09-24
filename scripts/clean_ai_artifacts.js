const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== '.git' && file !== 'node_modules') {
        results = results.concat(walk(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('.');
let changesMade = 0;

const replacements = [
  // Awkward automated dynamics / fast-paced replacements
  { from: /state transition fast-paceds/g, to: 'state transition dynamics' },
  { from: /fast-pacedally query/g, to: 'continuously query' },
  { from: /id="market-fast-paceds"/g, to: 'id="market-dynamics"' },
  { from: /href="#market-fast-paceds"/g, to: 'href="#market-dynamics"' },
  { from: /currency fast-paceds/g, to: 'currency market dynamics' },
  { from: /carry trade fast-paceds/g, to: 'carry trade dynamics' },
  { from: /economic fast-paceds/g, to: 'economic developments' },

  // Speed and output -> efficiency
  { from: /Prover Speed and output/g, to: 'Prover Efficiency' },
  { from: /speed and output/g, to: 'efficiency' },

  // Awkward urgent replacements
  { from: /zero urgent vulnerabilities/g, to: 'zero critical vulnerabilities' },
  { from: /a urgent launch stage/g, to: 'a critical milestone' },
  { from: /burns urgent marketing budget/g, to: 'burns valuable marketing budget' },
  { from: /miss urgent Series A\/B funding windows/g, to: 'miss critical Series A/B funding windows' },
  { from: /urgent contract logic/g, to: 'mission-critical contract logic' },
  { from: /In these urgent moments/g, to: 'In these critical moments' },
  { from: /pass urgent domain equity/g, to: 'pass authoritative domain equity' },
  { from: /pass urgent link equity/g, to: 'pass valuable link equity' },
  { from: /is urgent to tuning PR budget/g, to: 'is essential to maximizing PR budget' },

  // Awkward launch stage replacements -> milestone
  { from: /AUM launch stages/g, to: 'AUM milestones' },
  { from: /TVL launch stages/g, to: 'TVL milestones' },
  { from: /TVL launch stage/g, to: 'TVL milestone' },
  { from: /Never bury the launch stage/g, to: 'Never bury the lead milestone' },
  { from: /verifiable launch stages/g, to: 'verifiable milestones' },
  { from: /verifiable launch stage/g, to: 'verifiable milestone' },
  { from: /Deposit &amp; Customer Launch stages/g, to: 'Deposit &amp; Customer Milestones' },
  { from: /Customer launch stages/g, to: 'Customer milestones' },
  { from: /Customer Launch stages/g, to: 'Customer Milestones' },
  { from: /account launch stages/g, to: 'account milestones' },
  { from: /funding launch stages/g, to: 'funding milestones' },
  { from: /licensing launch stages/g, to: 'licensing milestones' },
  { from: /licensing launch stage/g, to: 'licensing milestone' },
  { from: /security launch stages/g, to: 'security milestones' },
  { from: /timeline launch stages/g, to: 'timeline milestones' },
  { from: /timeline launch stage/g, to: 'timeline milestone' },
  { from: /governance launch stages/g, to: 'governance milestones' },
  { from: /operational launch stages/g, to: 'operational milestones' },
  { from: /payout launch stage/g, to: 'payout milestone' },
  { from: /payout launch stages/g, to: 'payout milestones' },
  { from: /announcements, and launch stages/g, to: 'announcements, and key milestones' },
  { from: /customized to your launch stage/g, to: 'customized to your growth stage' },
  { from: /major launch stage, but a listing/g, to: 'major milestone, but a listing' },
  { from: /testnet launch stages/g, to: 'testnet milestones' },
  { from: /prop trading launch stages/g, to: 'prop trading milestones' },
  { from: /regulatory launch stages/g, to: 'regulatory milestones' },
  { from: /formal technical and commercial launch stage/g, to: 'formal technical and commercial milestone' },
  { from: /clear launch stage \(e\.g\./g, to: 'clear milestone (e.g.' },
  { from: /main operational launch stages/g, to: 'main operational milestones' },
  { from: /newsworthy launch stage/g, to: 'newsworthy milestone' },
  { from: /technological launch stage solves/g, to: 'technological breakthrough solves' },
  { from: /mainnet launch stage/g, to: 'mainnet milestone' },
  { from: /audited payout report, or research launch\./g, to: 'audited payout report, or research release.' },
  { from: /ecosystem launch stages/g, to: 'ecosystem milestones' },
  { from: /institutional launch stages/g, to: 'institutional milestones' },
  { from: /audited TVL launch stages/g, to: 'audited TVL milestones' },

  // AI clichés: elevate & seamlessly
  { from: /elevate their market presence/g, to: 'strengthen their market presence' },
  { from: /elevate brand authority/g, to: 'strengthen brand authority' },
  { from: /seamlessly/g, to: 'smoothly' },
  { from: /media landscapes/g, to: 'media ecosystems' },
  { from: /id="competitor-landscape"/g, to: 'id="competitor-comparison"' },
  { from: /href="#competitor-landscape"/g, to: 'href="#competitor-comparison"' }
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changesMade++;
    console.log('Cleaned AI artifacts in:', file);
  }
});

console.log('Total files cleaned of AI artifacts:', changesMade);
