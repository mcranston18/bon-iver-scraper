const hasTickets = itemBoxes => {
  const items = itemBoxes
    .map(x => {
      const item = x.replace('\n', '');
      const sections = ['Dress Circle A', 'Dress Circle B', 'Loge', 'Boxes', 'Orchestra'];
      const matchedSection = sections.find(section => item.includes(section));
      const soldOut = item.toLowerCase().includes('sold out');

      if (matchedSection && !soldOut) {
        return {
          section: matchedSection,
          soldOut,
        };
      }

      return null;
    })
    .filter(x => !!x);

  if (items.length) {
    return JSON.stringify(items);
  }

  return false;
};

module.exports = hasTickets;
