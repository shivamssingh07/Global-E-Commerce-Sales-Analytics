/* =====================================================
   DataPulse — app.js
   All chart data, Chart.js configs, DOM interactions
   ===================================================== */

'use strict';

/* ── Colour palette (hardcoded — Chart.js can't read CSS vars) ── */
const C = {
  blue:   '#4f8ef7',
  green:  '#3ecf8e',
  amber:  '#f5a623',
  red:    '#e5534b',
  purple: '#9d7af7',
  teal:   '#2dd4bf',
  pink:   '#f472b6',
  text:   '#8b90a0',
  grid:   'rgba(255,255,255,0.05)',
  bg:     '#13161d',
};

/* ── Chart.js global defaults ── */
Chart.defaults.color          = C.text;
Chart.defaults.borderColor    = C.grid;
Chart.defaults.font.family    = "'Epilogue', sans-serif";
Chart.defaults.font.size      = 11;
Chart.defaults.plugins.legend.display = false;
Chart.defaults.plugins.tooltip.backgroundColor = '#1e2230';
Chart.defaults.plugins.tooltip.borderColor      = 'rgba(255,255,255,0.1)';
Chart.defaults.plugins.tooltip.borderWidth      = 1;
Chart.defaults.plugins.tooltip.padding          = 10;
Chart.defaults.plugins.tooltip.titleColor       = '#e8eaf0';
Chart.defaults.plugins.tooltip.bodyColor        = '#8b90a0';
Chart.defaults.plugins.tooltip.cornerRadius     = 8;
Chart.defaults.plugins.tooltip.displayColors    = false;

/* ── Dataset ── */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const DATA = {
  revenue: [280,310,295,340,380,420,390,445,480,510,620,680],
  orders:  [5400,6100,5800,6700,7500,8200,7800,8700,9300,9900,12100,13100],
  newCustomers:      [3200,3800,3500,4100,4600,5000,4800,5300,5700,6100,7400,8000],
  returningCustomers:[2200,2300,2300,2600,2900,3200,3000,3400,3600,3800,4700,5100],
};

const CATEGORIES = {
  labels:  ['Electronics','Clothing','Home & Garden','Sports','Beauty','Books'],
  values:  [34, 22, 18, 12, 9, 5],
  colors:  [C.blue, C.teal, C.green, C.amber, C.pink, C.purple],
};

const REGIONS = {
  labels: ['North America','Europe','Asia Pacific','Latin America','Middle East','Africa'],
  values: [1831,1205,984,482,241,77],
  colors: [C.blue,C.teal,C.green,C.amber,C.purple,C.pink],
};

const PRODUCTS = [
  { name: 'Wireless Earbuds Pro',  units: 18420 },
  { name: 'Smart Watch Series 5',  units: 14830 },
  { name: 'Yoga Mat Premium',      units: 12640 },
  { name: 'LED Desk Lamp',         units: 11200 },
  { name: 'Skincare Serum Set',    units: 9870  },
];

const FUNNEL = [
  { stage: 'Visitors',    value: 420000, pct: 100, color: C.blue   },
  { stage: 'Product View',value: 168000, pct: 40,  color: C.teal   },
  { stage: 'Add to Cart', value: 75600,  pct: 18,  color: C.green  },
  { stage: 'Checkout',    value: 43848,  pct: 10.4,color: C.amber  },
  { stage: 'Purchased',   value: 26309,  pct: 6.3, color: C.purple },
];

const CHANNELS = [
  { name: 'Organic Search', revenue: '$1.42M', orders: 28400, conv: '4.2%', badge: 'badge-green' },
  { name: 'Paid Ads',       revenue: '$1.18M', orders: 23600, conv: '3.8%', badge: 'badge-blue'  },
  { name: 'Social Media',   revenue: '$0.74M', orders: 14800, conv: '2.9%', badge: 'badge-amber' },
  { name: 'Email',          revenue: '$0.86M', orders: 17200, conv: '6.1%', badge: 'badge-green' },
  { name: 'Referral',       revenue: '$0.62M', orders: 10210, conv: '3.4%', badge: 'badge-blue'  },
];

/* ── Quarterly filter mappings ── */
const QUARTERS = {
  all: { start:0,  end:11 },
  q1:  { start:0,  end:2  },
  q2:  { start:3,  end:5  },
  q3:  { start:6,  end:8  },
  q4:  { start:9,  end:11 },
};

/* ── Helper: format numbers ── */
function fmt(n) {
  if (n >= 1e6) return '$' + (n/1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n/1e3).toFixed(1) + 'K';
  return n.toString();
}

function fmtCurrency(n) {
  return '$' + n.toLocaleString();
}

/* =========================================================
   CHART 1 — Monthly Revenue & Orders (combo bar + line)
   ========================================================= */
let revenueChart;
function buildRevenueChart(start=0, end=11) {
  const labels = MONTHS.slice(start, end+1);
  const rev    = DATA.revenue.slice(start, end+1);
  const ord    = DATA.orders.slice(start, end+1);

  const legend = document.getElementById('revenueChartLegend');
  legend.innerHTML = `
    <span class="legend-item"><span class="legend-dot" style="background:${C.blue}"></span>Revenue ($K)</span>
    <span class="legend-item"><span class="legend-dot" style="background:${C.teal};border-radius:50%"></span>Orders</span>
  `;

  if (revenueChart) revenueChart.destroy();
  revenueChart = new Chart(document.getElementById('revenueChart'), {
    data: {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Revenue ($K)',
          data: rev,
          backgroundColor: rev.map((v,i) => i === rev.indexOf(Math.max(...rev))
            ? C.blue : 'rgba(79,142,247,0.35)'),
          borderRadius: 5,
          borderSkipped: false,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Orders',
          data: ord,
          borderColor: C.teal,
          backgroundColor: 'rgba(45,212,191,0.08)',
          pointBackgroundColor: C.teal,
          pointRadius: 3,
          pointHoverRadius: 6,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          yAxisID: 'y2',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          grid: { color: C.grid },
          ticks: { maxRotation: 0 },
        },
        y: {
          position: 'left',
          grid: { color: C.grid },
          ticks: { callback: v => '$' + v + 'K' },
        },
        y2: {
          position: 'right',
          grid: { display: false },
          ticks: { callback: v => (v/1000).toFixed(0) + 'K' },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => ctx.dataset.label === 'Revenue ($K)'
              ? ` Revenue: $${ctx.parsed.y}K`
              : ` Orders: ${ctx.parsed.y.toLocaleString()}`,
          },
        },
      },
    },
  });
}

/* =========================================================
   CHART 2 — Category Donut
   ========================================================= */
function buildCategoryChart() {
  new Chart(document.getElementById('categoryChart'), {
    type: 'doughnut',
    data: {
      labels: CATEGORIES.labels,
      datasets: [{
        data: CATEGORIES.values,
        backgroundColor: CATEGORIES.colors,
        borderWidth: 2,
        borderColor: '#13161d',
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed}%`,
          },
        },
      },
    },
  });

  // Custom legend
  const leg = document.getElementById('categoryLegend');
  CATEGORIES.labels.forEach((l,i) => {
    const item = document.createElement('div');
    item.className = 'donut-legend-item';
    item.innerHTML = `<span class="donut-dot" style="background:${CATEGORIES.colors[i]}"></span>${l} <strong style="color:#e8eaf0;margin-left:auto">${CATEGORIES.values[i]}%</strong>`;
    leg.appendChild(item);
  });
}

/* =========================================================
   CHART 3 — Region Horizontal Bar
   ========================================================= */
function buildRegionChart() {
  new Chart(document.getElementById('regionChart'), {
    type: 'bar',
    data: {
      labels: REGIONS.labels,
      datasets: [{
        label: 'Revenue ($K)',
        data: REGIONS.values,
        backgroundColor: REGIONS.colors.map(c => c + '99'),
        borderColor: REGIONS.colors,
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: C.grid },
          ticks: { callback: v => '$' + (v/1000).toFixed(0) + 'K' },
        },
        y: { grid: { display: false } },
      },
      plugins: {
        tooltip: {
          callbacks: { label: ctx => ` $${ctx.parsed.x.toLocaleString()}K` },
        },
      },
    },
  });
}

/* =========================================================
   CHART 4 — Top Products List
   ========================================================= */
function buildProductList() {
  const max = PRODUCTS[0].units;
  const container = document.getElementById('productList');
  PRODUCTS.forEach((p,i) => {
    const row = document.createElement('div');
    row.className = 'product-row';
    row.innerHTML = `
      <span class="product-rank">${i+1}</span>
      <span class="product-name">${p.name}</span>
      <div class="product-bar-wrap">
        <div class="product-bar" style="width:0%" data-w="${(p.units/max*100).toFixed(1)}%"></div>
      </div>
      <span class="product-units">${(p.units/1000).toFixed(1)}K</span>
    `;
    container.appendChild(row);
  });
  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.product-bar').forEach(b => {
      b.style.width = b.dataset.w;
    });
  }, 300);
}

/* =========================================================
   CHART 5 — Conversion Funnel (custom HTML)
   ========================================================= */
function buildFunnel() {
  const container = document.getElementById('funnelChart');
  FUNNEL.forEach(stage => {
    const el = document.createElement('div');
    el.className = 'funnel-stage';
    el.innerHTML = `
      <div class="funnel-label-row">
        <span class="funnel-name">${stage.stage}</span>
        <span>
          <span class="funnel-val">${stage.value.toLocaleString()}</span>
          <span class="funnel-pct"> · ${stage.pct}%</span>
        </span>
      </div>
      <div class="funnel-track">
        <div class="funnel-fill" style="width:0%;background:${stage.color}" data-w="${stage.pct}%"></div>
      </div>
    `;
    container.appendChild(el);
  });
  setTimeout(() => {
    document.querySelectorAll('.funnel-fill').forEach(f => {
      f.style.width = f.dataset.w;
    });
  }, 400);
}

/* =========================================================
   CHART 6 — Customer Acquisition Stacked Area
   ========================================================= */
let customerChart;
function buildCustomerChart(start=0, end=11) {
  const labels = MONTHS.slice(start, end+1);
  const nw = DATA.newCustomers.slice(start, end+1);
  const rt = DATA.returningCustomers.slice(start, end+1);

  if (customerChart) customerChart.destroy();
  customerChart = new Chart(document.getElementById('customerChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'New Customers',
          data: nw,
          borderColor: C.blue,
          backgroundColor: 'rgba(79,142,247,0.15)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 5,
        },
        {
          label: 'Returning Customers',
          data: rt,
          borderColor: C.teal,
          backgroundColor: 'rgba(45,212,191,0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 5,
          borderDash: [4,3],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { grid: { color: C.grid } },
        y: {
          grid: { color: C.grid },
          ticks: { callback: v => (v/1000).toFixed(0) + 'K' },
        },
      },
    },
  });
}

/* =========================================================
   CHART 7 — Order Heatmap (custom HTML/CSS grid)
   ========================================================= */
function buildHeatmap() {
  const days  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const hours = ['6am','9am','12pm','3pm','6pm','9pm'];
  const grid  = document.getElementById('heatmapWrap');

  // Build raw data
  const rawData = hours.map(h =>
    days.map(d => {
      const base = d === 'Sat' || d === 'Sun' ? 60 : 40;
      const isPeak = h === '12pm' || h === '9pm';
      return Math.floor(Math.random() * (isPeak ? 80 : 40) + base);
    })
  );
  const flat = rawData.flat();
  const maxVal = Math.max(...flat);
  const minVal = Math.min(...flat);

  // Header row
  const container = document.createElement('div');
  container.className = 'heatmap-grid';

  // Empty corner
  const corner = document.createElement('div');
  container.appendChild(corner);

  // Day headers
  days.forEach(d => {
    const h = document.createElement('div');
    h.className = 'heatmap-header';
    h.textContent = d;
    container.appendChild(h);
  });

  // Data rows
  hours.forEach((hr, ri) => {
    const rowLabel = document.createElement('div');
    rowLabel.className = 'heatmap-row-label';
    rowLabel.textContent = hr;
    container.appendChild(rowLabel);

    days.forEach((_, ci) => {
      const val = rawData[ri][ci];
      const intensity = (val - minVal) / (maxVal - minVal);
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';

      // Color from dark blue → bright blue
      const r = Math.round(20  + intensity * 30);
      const g = Math.round(30  + intensity * 100);
      const b = Math.round(80  + intensity * 175);
      cell.style.background = `rgb(${r},${g},${b})`;
      cell.title = `${hr} ${days[ci]}: ${val} orders`;
      container.appendChild(cell);
    });
  });

  grid.appendChild(container);
}

/* =========================================================
   CHART 8 — Price vs Rating Scatter
   ========================================================= */
function buildScatterChart() {
  // Generate realistic product dataset
  const products = [
    'Electronics','Clothing','Sports','Beauty','Home','Books'
  ];
  const colors = [C.blue, C.teal, C.amber, C.pink, C.green, C.purple];

  const datasets = products.map((cat, i) => {
    const points = Array.from({length: 12}, () => ({
      x: +(Math.random() * 280 + 20).toFixed(0),
      y: +(Math.random() * 1.5 + 3.2).toFixed(1),
    }));
    return {
      label: cat,
      data: points,
      backgroundColor: colors[i] + 'bb',
      borderColor: colors[i],
      borderWidth: 1,
      pointRadius: 6,
      pointHoverRadius: 9,
    };
  });

  new Chart(document.getElementById('scatterChart'), {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: 'Price ($)', color: C.text },
          grid: { color: C.grid },
          min: 0, max: 320,
          ticks: { callback: v => '$' + v },
        },
        y: {
          title: { display: true, text: 'Rating', color: C.text },
          grid: { color: C.grid },
          min: 2.8, max: 5.1,
        },
      },
      plugins: {
        legend: { display: true, position: 'bottom',
          labels: { boxWidth: 10, boxHeight: 10, padding: 12, color: C.text, font: { size: 11 } },
        },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label} — $${ctx.parsed.x} · ★${ctx.parsed.y}`,
          },
        },
      },
    },
  });
}

/* =========================================================
   CHART 9 — Channel Performance Table
   ========================================================= */
function buildPerfTable() {
  const table = document.getElementById('perfTable');
  const maxOrders = Math.max(...CHANNELS.map(c => c.orders));

  table.innerHTML = `
    <thead>
      <tr>
        <th>Channel</th>
        <th>Revenue</th>
        <th>Orders</th>
        <th>Conv.</th>
      </tr>
    </thead>
    <tbody>
      ${CHANNELS.map(ch => `
        <tr>
          <td>${ch.name}</td>
          <td>${ch.revenue}</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="mini-bar-wrap">
                <div class="mini-bar" style="width:${(ch.orders/maxOrders*100).toFixed(0)}%"></div>
              </div>
              ${(ch.orders/1000).toFixed(1)}K
            </div>
          </td>
          <td><span class="badge ${ch.badge}">${ch.conv}</span></td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

/* =========================================================
   SPARKLINES in KPI cards (tiny canvas charts)
   ========================================================= */
function buildSparkline(canvasId, data, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.map((_,i) => i),
      datasets: [{
        data,
        borderColor: color,
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
        tension: 0.4,
      }],
    },
    options: {
      responsive: false,
      animation: false,
      scales: { x: { display:false }, y: { display:false } },
      plugins: { tooltip: { enabled: false }, legend: { display: false } },
    },
  });
}

function buildSparklines() {
  const canvas = (id) => {
    const el = document.getElementById(id);
    el.width = 100; el.height = 40;
  };
  canvas('sparkRevenue'); canvas('sparkOrders'); canvas('sparkAov'); canvas('sparkCsat');

  buildSparkline('sparkRevenue', DATA.revenue, C.blue);
  buildSparkline('sparkOrders',  DATA.orders,  C.green);
  buildSparkline('sparkAov', [52,51,53,50,51,49,52,51,50,51,50,51], C.amber);
  buildSparkline('sparkCsat', [4.3,4.4,4.4,4.5,4.5,4.5,4.6,4.6,4.7,4.7,4.7,4.7], C.teal);
}

/* =========================================================
   PERIOD FILTER
   ========================================================= */
function updateKPI(start, end) {
  const rev = DATA.revenue.slice(start, end+1).reduce((a,b) => a+b, 0);
  const ord = DATA.orders.slice(start, end+1).reduce((a,b) => a+b, 0);
  const aov = (rev * 1000 / ord).toFixed(2);

  document.getElementById('kpiRevenue').textContent = '$' + (rev/1000).toFixed(2) + 'M';
  document.getElementById('kpiOrders').textContent  = ord.toLocaleString();
  document.getElementById('kpiAOV').textContent     = '$' + aov;
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const p = QUARTERS[btn.dataset.period];
    buildRevenueChart(p.start, p.end);
    buildCustomerChart(p.start, p.end);
    updateKPI(p.start, p.end);
  });
});

/* =========================================================
   EXPORT (print / screenshot helper)
   ========================================================= */
document.getElementById('exportBtn').addEventListener('click', () => {
  window.print();
});

/* =========================================================
   INIT — build everything
   ========================================================= */
function init() {
  buildSparklines();
  buildRevenueChart();
  buildCategoryChart();
  buildRegionChart();
  buildProductList();
  buildFunnel();
  buildCustomerChart();
  buildHeatmap();
  buildScatterChart();
  buildPerfTable();
}

document.addEventListener('DOMContentLoaded', init);