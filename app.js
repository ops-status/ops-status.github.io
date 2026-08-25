const dateButton = document.querySelector('#dateButton');
const dateMenu = document.querySelector('#dateMenu');
const selectedDate = document.querySelector('#selectedDate');
const toast = document.querySelector('#toast');
const modal = document.querySelector('#detailModal');
const modalTitle = document.querySelector('#modalTitle');
const modalKicker = document.querySelector('#modalKicker');
const modalText = document.querySelector('#modalText');
const modalInsight = document.querySelector('#modalInsight');

const details = {
  workforce: {
    kicker: 'WORKFORCE DETAIL',
    title: 'Driver coverage snapshot',
    text: 'The active roster covers 87.3% of the 797-driver workforce. Standby capacity adds 45 drivers for operational flexibility.',
    insight: '<b>Leadership signal:</b> Coverage is stable. Review the 15 DW drivers and 8 suspended drivers before the next duty allocation.'
  },
  incident: {
    kicker: 'EVENT BRIEF',
    title: 'Recorded accident · Route 2',
    text: 'One type B accident involving bus type MA was recorded. The report classifies the driver as not guilty.',
    insight: '<b>Recommended action:</b> Keep the event in route-level monitoring. No guilty-accident escalation is required today.'
  },
  'case-01': {
    kicker: 'PRIORITY 1',
    title: 'Driver affairs review',
    text: 'Two of eight driver affairs cases remain pending. Six cases are already closed, producing a 75% closure rate.',
    insight: '<b>Next decision:</b> Assign a supervisor owner and target closure before the next daily summary.'
  },
  'case-02': {
    kicker: 'PRIORITY 2',
    title: 'DW roster validation',
    text: 'The daily summary lists 15 DW drivers. Their roster status should be confirmed before reassignment decisions are made.',
    insight: '<b>Control point:</b> Reconcile the driver list with the planned-duty roster and document any exceptions.'
  },
  'case-03': {
    kicker: 'PRIORITY 3',
    title: 'Route 2 safety watch',
    text: 'Route 2 appears in the single recorded accident. The driver was classified as not guilty.',
    insight: '<b>Monitoring rule:</b> Retain the route in the weekly trend view and escalate only if a repeat pattern appears.'
  },
  'investigation-01': {
    kicker: 'INVESTIGATION · INV-01',
    title: 'Driver affairs review',
    text: 'This active investigation is in evidence review with Operations Admin assigned as the current owner.',
    insight: '<b>Next control:</b> Confirm the supporting records, record the reviewer note and move the case to decision pending.'
  },
  'investigation-02': {
    kicker: 'INVESTIGATION · INV-02',
    title: 'Service case follow-up',
    text: 'The evidence review is complete and the case is awaiting an operational decision.',
    insight: '<b>Next control:</b> Record the supervisor decision and close or return the case with a clear reason.'
  }
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2400);
}

function closeDateMenu() {
  dateMenu.hidden = true;
  dateButton.setAttribute('aria-expanded', 'false');
}

dateButton.addEventListener('click', () => {
  const opening = dateMenu.hidden;
  dateMenu.hidden = !opening;
  dateButton.setAttribute('aria-expanded', String(opening));
});

document.querySelectorAll('[data-date]').forEach((button) => {
  button.addEventListener('click', () => {
    selectedDate.textContent = button.dataset.date;
    closeDateMenu();
    showToast(button.dataset.date === '04 Aug 2026' ? 'Current report selected' : 'Preview date selected · demo values retained');
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.date-control')) closeDateMenu();
});

document.querySelectorAll('.rail-button').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.querySelector(`#${button.dataset.target}`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const sections = [...document.querySelectorAll('#overview, #workforce, #safety, #investigations')];
const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  document.querySelectorAll('.rail-button').forEach((button) => button.classList.toggle('active', button.dataset.target === visible.target.id));
}, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .15, .35] });
sections.forEach((section) => observer.observe(section));

document.querySelectorAll('.filter-chip').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.queue-row').forEach((row) => {
      row.hidden = filter !== 'all' && row.dataset.status !== filter;
    });
  });
});

function openModal(key) {
  const item = details[key];
  if (!item) return;
  modalKicker.textContent = item.kicker;
  modalTitle.textContent = item.title;
  modalText.textContent = item.text;
  modalInsight.innerHTML = item.insight;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close').focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-open]').forEach((button) => button.addEventListener('click', () => openModal(button.dataset.open)));
modal.querySelector('.modal-close').addEventListener('click', closeModal);
modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
modal.querySelector('.modal-action').addEventListener('click', () => { closeModal(); showToast('Marked as reviewed for this session'); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });
document.querySelector('#exportButton').addEventListener('click', () => window.print());
