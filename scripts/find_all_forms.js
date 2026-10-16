const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const forms = content.match(/<form[\s\S]*?<\/form>/g);
  if (forms) {
    console.log(f, 'forms count:', forms.length);
    forms.forEach((form, i) => {
      const actionMatch = form.match(/action=["']([^"']*)["']/);
      const idMatch = form.match(/id=["']([^"']*)["']/);
      const clsMatch = form.match(/class=["']([^"']*)["']/);
      console.log('  Form', i+1, {
        id: idMatch ? idMatch[1] : null,
        cls: clsMatch ? clsMatch[1] : null,
        action: actionMatch ? actionMatch[1] : null
      });
    });
  }
});
